// Run: npx tsx scripts/delete-broken-media.ts
// Deletes broken media records (IDs 41-46) and project 7 (Gaznger) which references media 45.

import { readFileSync } from 'fs'
import pg from 'pg'

// Load .env.local
const envContent = readFileSync('.env.local', 'utf8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx).trim()
  const val = trimmed.slice(eqIdx + 1).trim()
  if (!process.env[key]) process.env[key] = val.replace(/^["']|["']$/g, '')
}

const BROKEN_MEDIA_IDS = [41, 42, 43, 44, 45, 46]

async function main() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await client.connect()
  console.log('Connected to database\n')

  // 1. Find projects referencing broken media
  const { rows: affectedProjects } = await client.query(
    `SELECT id, title, cover_image_id FROM projects WHERE cover_image_id = ANY($1)`,
    [BROKEN_MEDIA_IDS],
  )
  console.log('Affected projects:', affectedProjects)

  // 2. Delete gallery entries for affected projects
  for (const proj of affectedProjects) {
    console.log(`\nDeleting gallery for project ${proj.id} (${proj.title})...`)
    const r1 = await client.query(`DELETE FROM projects_gallery WHERE _parent_id = $1`, [proj.id])
    console.log(`  Gallery rows deleted: ${r1.rowCount}`)

    // Also delete tech_stack, tags arrays
    await client.query(`DELETE FROM projects_tech_stack WHERE _parent_id = $1`, [proj.id]).then(r => console.log(`  Tech stack rows: ${r.rowCount}`)).catch(() => {})
    await client.query(`DELETE FROM projects_tags WHERE _parent_id = $1`, [proj.id]).then(r => console.log(`  Tags rows: ${r.rowCount}`)).catch(() => {})
  }

  // 3. Delete the affected projects
  for (const proj of affectedProjects) {
    console.log(`Deleting project ${proj.id} (${proj.title})...`)
    const r = await client.query(`DELETE FROM projects WHERE id = $1`, [proj.id])
    console.log(`  ✓ Deleted (${r.rowCount} row)`)
  }

  // 4. Clear any testimonial avatar references to broken media
  const { rows: affectedTestimonials } = await client.query(
    `SELECT id, author_name FROM testimonials WHERE author_avatar_id = ANY($1)`,
    [BROKEN_MEDIA_IDS],
  )
  for (const t of affectedTestimonials) {
    console.log(`Clearing avatar on testimonial ${t.id} (${t.author_name})...`)
    await client.query(`UPDATE testimonials SET author_avatar_id = NULL WHERE id = $1`, [t.id])
    console.log('  ✓ Cleared')
  }

  // 5. Clear any home_page or about_page references
  await client.query(`UPDATE home_page SET headshot_id = NULL WHERE headshot_id = ANY($1)`, [BROKEN_MEDIA_IDS])
    .then(r => r.rowCount && console.log(`Cleared ${r.rowCount} home_page headshot refs`))
  await client.query(`UPDATE about_page SET portrait_id = NULL WHERE portrait_id = ANY($1)`, [BROKEN_MEDIA_IDS])
    .then(r => r.rowCount && console.log(`Cleared ${r.rowCount} about_page portrait refs`))

  // 6. Delete the broken media records
  console.log('\nDeleting broken media records...')
  for (const id of BROKEN_MEDIA_IDS) {
    try {
      const r = await client.query(`DELETE FROM media WHERE id = $1`, [id])
      console.log(`  ✓ Deleted media ${id} (${r.rowCount} row)`)
    } catch (err: any) {
      console.log(`  ⚠ Failed media ${id}: ${err.message}`)
    }
  }

  await client.end()
  console.log('\nDone. Re-upload images and re-create affected projects via the admin panel.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
