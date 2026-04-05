import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'

import { Projects } from './collections/Projects'
import { Certifications } from './collections/Certifications'
import { Testimonials } from './collections/Testimonials'
import { Experience } from './collections/Experience'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { SecretPage } from './globals/SecretPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Portfolio CMS',
      icons: [
        {
          url: '/logo.png',
          type: 'image/png',
        },
      ],
    },
    avatar: 'default',
  },
  collections: [Users, Media, Projects, Certifications, Testimonials, Experience],
  globals: [SiteSettings, AboutPage, HomePage, SecretPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          prefix: 'media',
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
