import { getPayloadClient } from '@/lib/payload'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'media',
    limit: 10,
    sort: '-createdAt',
  })

  const summary = docs.map((doc) => ({
    id: doc.id,
    filename: doc.filename,
    url: doc.url,
    alt: doc.alt,
    createdAt: doc.createdAt,
  }))

  const token = process.env.BLOB_READ_WRITE_TOKEN
  return NextResponse.json({
    blobToken: token ? `${token.slice(0, 20)}...` : 'NOT SET',
    blobTokenLength: token?.length ?? 0,
    media: summary,
  })
}
