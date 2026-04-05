# Software Portfolio

Full-stack developer portfolio built with Next.js 16, Payload CMS v3, and Neon Postgres. Features GSAP/Framer Motion animations, a custom command palette, terminal-style pages, and a fully CMS-driven content architecture.

## Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack)
- **CMS** — Payload CMS v3 (embedded in Next.js)
- **Database** — Neon Postgres
- **Styling** — Tailwind CSS v4
- **Animations** — GSAP (ScrollTrigger) + Framer Motion
- **Storage** — Vercel Blob
- **Email** — Resend
- **Deployment** — Vercel

## Features

- Animated hero with CMS-editable content and floating greeting toast
- Project case studies with device frames (browser, phone, tablet), gallery lightbox, and rich text
- Horizontal scroll project conveyor (desktop) with filterable grid (mobile)
- Dual-direction project marquee (web L-R, mobile R-L)
- Auto-scrolling testimonial carousel with LinkedIn verification links
- Experience timeline with scroll-driven SVG line draw animation
- Certification timeline with badge display
- Tech stack section with category tabs, icons, and GSAP burst animation
- GitHub activity dashboard (contributions, streak, top languages, repos)
- Client logo marquee with pause-on-hover
- FAQ accordion with staggered scroll-reveal
- Command palette (`Ctrl+/`) with project search, navigation, and easter eggs
- Terminal-style 404 page with typewriter animation and live keyboard input
- Terminal-style /secret page with CMS-editable content
- Konami code easter egg with confetti
- Custom cursor, page transitions, depth-tilt images
- Dark/light theme with system preference detection
- SEO: Open Graph images, sitemap, robots.txt
- Fully responsive across all breakpoints

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon Postgres database
- A Vercel Blob store (for media uploads in production)

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
DATABASE_URL=           # Neon Postgres connection string
PAYLOAD_SECRET=         # Random string for Payload auth
BLOB_READ_WRITE_TOKEN=  # Vercel Blob storage token
RESEND_API_KEY=         # Resend API key for contact form
GITHUB_TOKEN=           # GitHub personal access token (read:user scope)
GITHUB_USERNAME=        # Your GitHub username
NEXT_PUBLIC_SITE_URL=   # Your deployed URL
```

### Development

```bash
npm install
npm run dev
```

The Payload admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

### Build

```bash
npm run build
npm start
```

## CMS Structure

### Collections

| Collection     | Purpose                          |
| -------------- | -------------------------------- |
| Projects       | Portfolio case studies           |
| Experience     | Work history timeline            |
| Certifications | Professional certifications      |
| Testimonials   | Client/colleague recommendations |
| Media          | Uploaded images and files        |
| Users          | Admin authentication             |

### Globals

| Global        | Purpose                                    |
| ------------- | ------------------------------------------ |
| Site Settings | Social links, FAQ, resume, theme           |
| Home Page     | Hero content, about teaser, CTA, logos     |
| About Page    | Bio, stats, values, tech stack, process    |
| Secret Page   | Terminal content for /secret easter egg    |

## Deployment

Deploy to Vercel with the environment variables configured. The database schema auto-pushes on server start.

## License

Private. All rights reserved.
