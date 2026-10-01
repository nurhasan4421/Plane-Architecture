# PLANE ARCHITECT

An architectural studio website based in **Dhaka, Bangladesh** (Dhaka, Bangladesh).

- **Studio Name**: Plane Architect
- **Address**: Dhala, Bangladesh
- **Contact Email**: hello@planearchitect.com
- **Phone**: +8801234567891
- **Typography**:
  - **Display**: Ledger
  - **Body**: Jost

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Supabase**, and configured for zero-configuration static export deployment on **Cloudflare Pages** and **GitHub**.

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
- **Turnkey Static Export (`out/`)**: Instant edge deployment on Cloudflare Pages.

---

## 📁 Project Structure

```text
big-architecture/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD to Cloudflare Pages
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

---

## ☁️ Deploying to Cloudflare Pages

### Option A: Via GitHub
1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: Plane Architect website setup"
   git remote add origin https://github.com/YOUR_USERNAME/plane-architect.git
   git push -u origin main
   ```
2. In Cloudflare Dashboard:
   - Connect your GitHub repository.
   - Build command: `npm run build`
   - Build output directory: `out`
   - Deploy.

### Option B: Via Wrangler CLI
```bash
npm run build
npx wrangler pages deploy out --project-name plane-architect
```
