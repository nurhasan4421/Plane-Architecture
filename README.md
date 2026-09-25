# BIG (Bjarke Ingels Group) Architecture Website

An architectural website built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Supabase**, and configured for zero-configuration static export deployment on **Cloudflare Pages** and **GitHub**.

Modeled after **[big.dk](https://big.dk/)**, featuring:
- **Cinematic BIG Intro Splash**: Animated blocky SVG logo reveal and smooth dissolution.
- **Iconic Left-Aligned Project Cards**: Monogram/glyph SVG icons in black square frames, exact typographic hierarchy, and responsive aspect-ratio photography.
- **Dynamic Scale Controls**: S / M / L scaler slider matching BIG's custom interface scaling.
- **Sticky Architecture Header**: Category navigation (`Architecture`, `Interiors`, `Landscape`, `Planning`, `Products`) with hover subcategories and mobile accordion.
- **Signature Horizontal Project Story Viewer**:
  - Detailed architectural specifications (Year, Client, Typology, Size m²/ft², Status, Share buttons).
  - **Interactive 6-step Concept Diagram Stepper** showing morphological project evolution.
  - Full-bleed Bjarke Ingels quotations and design philosophy statements.
  - High-resolution gallery photographs and construction progress documentation.
  - Partner and design team credits.
- **Slide-out Navigation Drawer**: Quick navigation to Projects, News, About, Sustainability, People, Careers, and Contact.
- **Interactive Contact Modal**: Global studio directory (Copenhagen, New York, London, Barcelona, Shenzhen) with inquiry submission directly connected to **Supabase**.
- **100% Static Export Optimized (`out/`)**: Deploys seamlessly on Cloudflare Pages with zero server cold start and instant worldwide CDN caching.

---

## 📁 Project Structure

```text
big-architecture/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD to Cloudflare Pages
├── src/
│   ├── app/
│   │   ├── about/              # BIG Manifesto, Sustainability & Leadership
│   │   ├── news/               # Architectural updates & press releases
│   │   ├── projects/[slug]/    # Dynamic SSG project detail routes
│   │   ├── globals.css         # Architectural CSS design system
│   │   ├── layout.tsx          # Root layout & SEO meta tags
│   │   └── page.tsx            # Main architectural showcase
│   ├── components/
│   │   ├── BigLogo.tsx         # Precise SVG wireframe BIG logo
│   │   ├── IntroSplash.tsx     # Animated entrance splash screen
│   │   ├── Header.tsx          # Sticky architectural header & subcategories
│   │   ├── NavigationDrawer.tsx# Left slide-out navigation panel
│   │   ├── ProjectCard.tsx     # Signature project card with black box glyph
│   │   ├── ProjectFeed.tsx     # Scalable project feed container
│   │   ├── HorizontalProjectViewer.tsx # Horizontal storytelling viewer & diagram stepper
│   │   ├── ContactModal.tsx    # Worldwide studio directory & Supabase contact form
│   │   └── Footer.tsx          # Minimal architectural footer
│   ├── lib/
│   │   ├── projects-data.ts    # Authentic project catalogue, diagrams & news
│   │   └── supabase.ts         # Supabase client with graceful demo fallback
│   └── types/
│       ├── project.ts          # TypeScript interfaces for projects and diagrams
│       └── database.types.ts   # Supabase database schema types
├── supabase/
│   └── schema.sql              # PostgreSQL DDL, RLS policies, and seed data
├── .env.example                # Supabase environment variables template
├── next.config.ts              # Static export & media patterns config
├── wrangler.toml               # Cloudflare Pages deployment configuration
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
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Open [`supabase/schema.sql`](file:///Users/nurhasan/.gemini/antigravity-ide/scratch/big-architecture/supabase/schema.sql) and paste its contents into the editor, then click **Run**.
4. Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Note: If you run without Supabase keys, the website operates seamlessly with local simulated data so you can test immediately without any errors.)*

---

## ☁️ Deploying to Cloudflare Pages

### Option A: Via GitHub (Recommended)
1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete BIG architecture website clone"
   git remote add origin https://github.com/YOUR_USERNAME/big-architecture.git
   git branch -M main
   git push -u origin main
   ```
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/):
   - Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   - Select your `big-architecture` repository.
   - Set **Build command**: `npm run build`
   - Set **Build output directory**: `out`
   - Under **Environment variables**, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` if using Supabase.
   - Click **Save and Deploy**.

### Option B: Direct Deployment via Wrangler
```bash
npm run build
npx wrangler pages deploy out --project-name big-architecture
```
