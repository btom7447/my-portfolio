/**
 * Migrates local media files to Vercel Blob and updates database records.
 * Uses @vercel/blob + pg directly — no Payload dependency.
 *
 * Prerequisites:
 *   - BLOB_READ_WRITE_TOKEN set in .env.local
 *   - DATABASE_URL set in .env.local
 *   - Local /media directory with the original files
 *
 * Run: npx tsx scripts/migrate-media-to-blob.ts
 */

import fs from 'fs'
import path from 'path'
import { put } from '@vercel/blob'
import pg from 'pg'

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

const MEDIA_DIR = path.resolve(process.cwd(), 'media')
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const DATABASE_URL = process.env.DATABASE_URL

async function migrate() {
  if (!BLOB_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is not set in .env.local')
    process.exit(1)
  }
  if (!DATABASE_URL) {
    console.error('DATABASE_URL is not set in .env.local')
    process.exit(1)
  }
  if (!fs.existsSync(MEDIA_DIR)) {
    console.error(`Media directory not found: ${MEDIA_DIR}`)
    process.exit(1)
  }

  // Verify connection string looks right
  const masked = DATABASE_URL.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')
  console.log(`Connecting to: ${masked}\n`)

  const pool = new pg.Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })

  // Discover actual column names
  const { rows: cols } = await pool.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'media' ORDER BY ordinal_position"
  )
  console.log('Media columns:', cols.map(c => c.column_name).join(', '), '\n')

  // Get all media records
  const { rows } = await pool.query('SELECT * FROM media ORDER BY id')
  console.log(`Found ${rows.length} media records.\n`)

  let migrated = 0
  let skipped = 0
  let failed = 0

  // Log first row to see structure
  if (rows.length > 0) {
    console.log('Sample row keys:', Object.keys(rows[0]).join(', '), '\n')
  }

  for (const row of rows) {
    const id = row.id
    const filename = row.filename
    const url = row.url
    // Payload v3 with postgres stores sizes as separate columns like thumbnail_url, card_url, etc.
    // or as a JSON column. We'll detect dynamically.
    const sizes = row.sizes ?? null

    if (!filename) {
      console.log(`  [skip] ID ${id} — no filename`)
      skipped++
      continue
    }

    // Already migrated
    if (url && url.startsWith('https://')) {
      console.log(`  [skip] ${filename} — already on blob`)
      skipped++
      continue
    }

    const filePath = path.join(MEDIA_DIR, filename)
    if (!fs.existsSync(filePath)) {
      console.log(`  [miss] ${filename} — not found locally`)
      failed++
      continue
    }

    try {
      // Upload main file
      const fileBuffer = fs.readFileSync(filePath)
      const blob = await put(`media/${filename}`, fileBuffer, {
        access: 'public',
        token: BLOB_TOKEN,
      })

      let newUrl = blob.url

      // Upload image sizes (Payload v3 postgres uses separate columns per size)
      const sizeNames = ['thumbnail', 'card', 'hero']
      const setClauses = ['url = $1']
      const params: unknown[] = [newUrl]
      let paramIdx = 2

      for (const sizeName of sizeNames) {
        const sizeFilename = row[`${sizeName}_filename`]
        const sizeUrlCol = `${sizeName}_url`

        if (sizeFilename) {
          const sizePath = path.join(MEDIA_DIR, sizeFilename)
          if (fs.existsSync(sizePath)) {
            const sizeBuffer = fs.readFileSync(sizePath)
            const sizeBlob = await put(`media/${sizeFilename}`, sizeBuffer, {
              access: 'public',
              token: BLOB_TOKEN,
            })
            setClauses.push(`${sizeUrlCol} = $${paramIdx}`)
            params.push(sizeBlob.url)
            paramIdx++
          }
        }
      }

      params.push(id)
      await pool.query(
        `UPDATE media SET ${setClauses.join(', ')} WHERE id = $${paramIdx}`,
        params,
      )

      console.log(`  [done] ${filename} → ${newUrl}`)
      migrated++
    } catch (err: any) {
      console.log(`  [fail] ${filename} — ${err.message}`)
      failed++
    }
  }

  await pool.end()

  console.log(`\nMigration complete:`)
  console.log(`  Migrated: ${migrated}`)
  console.log(`  Skipped:  ${skipped}`)
  console.log(`  Failed:   ${failed}`)

  process.exit(0)
}

migrate()
