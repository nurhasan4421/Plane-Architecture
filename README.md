# PLANE ARCHITECT

An architectural studio website based in **Dhaka, Bangladesh** (Dhaka, Bangladesh).

- **Studio Name**: Plane Architect
- **Address**: Dhaka, Bangladesh
- **Contact Email**: hello@planearchitect.com
- **Phone**: +88012345678912
- **Typography**:
  - **Display**: Ledger
  - **Body**: Jost

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Supabase**, and deployed as a **Cloudflare Worker** with OpenNext.

---

## ✨ Features

- **Plane Geometric Intro Splash**: Minimalist geometric vector animation revealing the Plane Architect Dhaka mark.
- **Architectural Wireframe Logo**: Scalable SVG vector mark combining intersecting architectural planes and Ledger wordmark.
- **Left-Aligned Project Cards**: Monogram/glyph SVG icons in black square frames, exact typographic hierarchy with Ledger titles and Jost body specifications.
- **Dynamic Scale Controls (S / M / L)**: Custom architectural view scaler with smooth cubic-bezier transitions.
- **Sticky Architectural Navigation**: Category filtering (*Architecture*, *Interiors*, *Landscape*, *Planning*, *Products*) and subcategories.
- **Horizontal Storytelling Project Viewer**:
  - Comprehensive architectural specifications (Year, Client, Typology, Size m²/ft², Status, Share buttons).
  - **Interactive 6-step Concept Diagram Stepper** showing morphological project evolution.
  - Plane Architect design philosophy statements and quotes.
  - High-resolution gallery photographs from curated architecture archives.
  - Team, collaborator, and award credits.
- **Slide-out Navigation Drawer**: Seamless access to Projects, News, About, Sustainability, People, Careers, and Contact.
- **Interactive Contact Modal**: Flagship Dhaka studio directory with direct inquiry submission to **Supabase**.
- **Online CMS**: Admin authentication and project, journal, testimonial, category, and site-settings management backed by Supabase.
- **Supabase Storage**: Upload project, journal, and testimonial images to the `site-media` bucket.
- **Cloudflare Workers**: Public website and `/admin` run on the same Worker domain.

---

## 📁 Project Structure

```text
big-architecture/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD to Cloudflare Workers
├── src/
│   ├── app/
│   │   ├── about/              # Plane Architect manifesto, Delta Ecology & Team
│   │   ├── news/               # Architectural updates & press releases
│   │   ├── projects/[slug]/    # Dynamic SSG project detail routes
│   │   ├── globals.css         # Typography (Ledger & Jost) & CSS design system
│   │   ├── layout.tsx          # Root layout & SEO meta tags
│   │   └── page.tsx            # Main architectural showcase
│   ├── components/
│   │   ├── PlaneLogo.tsx       # Geometric wireframe Plane Architect logo
│   │   ├── IntroSplash.tsx     # Animated entrance splash screen
│   │   ├── Header.tsx          # Sticky architectural header & subcategories
│   │   ├── NavigationDrawer.tsx# Left slide-out navigation panel
│   │   ├── ProjectCard.tsx     # Signature project card with black box glyph
│   │   ├── ProjectFeed.tsx     # Scalable project feed container
│   │   ├── HorizontalProjectViewer.tsx # Horizontal storytelling canvas & diagram stepper
│   │   ├── ContactModal.tsx    # Dhaka studio directory & Supabase contact form
│   │   └── Footer.tsx          # Minimal architectural footer
│   ├── lib/
│   │   ├── projects-data.ts    # Authentic Plane Architect projects, diagrams & news
│   │   └── supabase.ts         # Supabase client with graceful demo fallback
│   └── types/
│       ├── project.ts          # TypeScript interfaces for projects and diagrams
│       └── database.types.ts   # Supabase database schema types
├── supabase/
│   ├── schema.sql              # Base PostgreSQL schema and project seed data
│   └── cms.sql                 # CMS tables, RLS policies, and Storage bucket
├── .env.example                # Supabase environment variables template
├── next.config.ts              # Next.js and OpenNext configuration
├── wrangler.toml               # Cloudflare Worker deployment configuration
└── package.json                # Project dependencies and scripts
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql), then [`supabase/cms.sql`](supabase/cms.sql). The CMS script creates the admin table, CMS settings/testimonials, policies, and `site-media` Storage bucket.
3. In **Authentication → Users**, create an administrator account. Copy its user UUID and run:
  ```sql
  insert into public.admin_users (user_id) values ('<auth-user-uuid>');
  ```
4. Create a `.env.local` file in the project root for local development:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
Use the project's public anon/publishable key. Never expose a Supabase service-role key in `NEXT_PUBLIC_` variables or browser code.

---

## ☁️ Deploying to Cloudflare Workers

The website and CMS are routes in the same Worker. The admin panel is available at <https://plane-architecture.nurhasan90446.workers.dev/admin>.

### GitHub Actions

The workflow at `.github/workflows/deploy.yml` runs `npm run deploy` after pushes to `main`, or from **Actions → Deploy Cloudflare Worker → Run workflow**. In the GitHub repository, open **Settings → Secrets and variables → Actions** and add these repository variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anon/publishable key
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID

Add this repository secret:

- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with permission to deploy Workers Scripts

Next.js bundles `NEXT_PUBLIC_` values during the build, so configure them in GitHub before deploying. The workflow checks that all four settings exist and stops with a clear error if any are missing.

### Local deployment

Ensure `.env.local` has the two Supabase variables, authenticate Wrangler with `npx wrangler login` (or set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in your shell), and run:

```bash
npm run deploy
```

Project covers, journal images, and testimonial portraits can be uploaded from `/admin` to the public `site-media` Supabase Storage bucket. The app saves the resulting public URL in the matching database record. Uploads require a signed-in Auth user whose UUID is in `public.admin_users`.
