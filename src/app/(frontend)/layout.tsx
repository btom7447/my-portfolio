import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Geist_Mono } from 'next/font/google'
import { PageTransition } from '@/components/PageTransition'
import { CustomCursor } from '@/components/CustomCursor'
import { CommandPalette } from '@/components/CommandPalette'
import { DelightLayer } from '@/components/DelightLayer'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Portfolio — Full-Stack Engineer',
    template: '%s — Portfolio',
  },
  description: 'Full-stack web and mobile developer portfolio. Building polished products for web and mobile.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Portfolio',
    title: 'Full-Stack Engineer — Web & Mobile',
    description: 'Full-stack web and mobile developer portfolio',
    images: [{ url: '/og?title=Full-Stack+Engineer&description=Web+%26+Mobile', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Full-Stack Engineer — Web & Mobile',
    description: 'Full-stack web and mobile developer portfolio',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.setAttribute('data-theme','dark')}else{document.documentElement.setAttribute('data-theme','light')}}catch(e){}})()`,
          }}
        />
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){var w=console.warn,e=console.error;console.warn=function(){};console.error=function(){}})()`,
            }}
          />
        )}
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <CustomCursor />
        <CommandPalette />
        <DelightLayer />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
