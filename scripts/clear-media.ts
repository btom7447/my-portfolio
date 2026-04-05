// Run: npx tsx scripts/clear-media.ts
// Deletes all media records from the database so you can re-upload

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function clearMedia() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'media',
    limit: 500,
  })

  console.log(`Found ${docs.length} media records. Deleting...`)

  for (const doc of docs) {
    try {
      await payload.delete({ collection: 'media', id: doc.id })
      console.log(`  Deleted: ${doc.alt || doc.id}`)
    } catch (err: any) {
      console.log(`  Skipped ${doc.id}: ${err.message}`)
    }
  }

  console.log('Done. You can now re-upload media through the admin panel.')
  process.exit(0)
}

clearMedia()
