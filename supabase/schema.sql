-- Supabase SQL Schema for Plane Architect (Dhaka, Bangladesh)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    year TEXT NOT NULL,
    client TEXT NOT NULL,
    typology TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    size_m2 TEXT NOT NULL,
    size_ft2 TEXT,
    status TEXT NOT NULL,
    aspect_ratio TEXT DEFAULT '16 / 9',
    hero_image TEXT NOT NULL,
    icon_svg TEXT,
    quote TEXT,
    quote_author TEXT DEFAULT 'Plane Architect',
    quote_author_role TEXT DEFAULT 'Design Principal, Plane Architect Dhaka',
    description TEXT NOT NULL,
    awards JSONB DEFAULT '[]'::jsonb,
    collaborators JSONB DEFAULT '[]'::jsonb,
    diagrams JSONB DEFAULT '[]'::jsonb,
    gallery JSONB DEFAULT '[]'::jsonb,
    credits JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by category and slug
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

-- 3. Inquiries / Contact Submissions Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    office TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. News Table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    image TEXT NOT NULL,
    read_time TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Allow public read access to Projects
CREATE POLICY "Public read projects"
    ON public.projects
    FOR SELECT
    USING (true);

-- Allow public read access to News
CREATE POLICY "Public read news"
    ON public.news
    FOR SELECT
    USING (true);

-- Allow public insert into inquiries (contact form)
CREATE POLICY "Allow public insert into inquiries"
    ON public.inquiries
    FOR INSERT
    WITH CHECK (true);

-- 6. Initial Seed Data for Plane Architect
INSERT INTO public.projects (
    slug, title, location, year, client, typology, category, subcategory, size_m2, size_ft2, status, aspect_ratio, hero_image, quote, quote_author, quote_author_role, description
) VALUES 
(
    'dhaka-contemporary-art-center',
    'Dhaka Contemporary Art Center',
    'Dhaka, Bangladesh',
    '2026',
    'National Arts Trust & Ministry of Cultural Affairs',
    'Culture',
    'architecture',
    'culture',
    '48,000',
    '516,000',
    'Completed',
    '16 / 9',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    'Architecture in the Bengal delta must breathe with water, light, and monsoon rhythm. By elevating the galleries above high-water thresholds and carving perforated terracotta screen walls, the center transforms tropical climatic reality into luminous spatial poetry.',
    'Plane Architect',
    'Design Principal, Plane Architect Dhaka',
    'A flagship cultural landmark positioned along the revitalized waterfront of Dhaka.'
),
(
    'gulshan-botanical-pavilion',
    'Gulshan Botanical Pavilion',
    'Dhaka, Bangladesh',
    '2025',
    'Dhaka Urban Green Trust',
    'Landscape',
    'landscape',
    'parks',
    '14,500',
    '156,000',
    'Completed',
    '16 / 10',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=85',
    'In a dense metropolis, nature cannot be merely a decorative fringe. It must be woven as an active botanical lung that filters urban dust, regulates microclimate, and provides sanctuary.',
    'Plane Architect',
    'Design Principal, Plane Architect',
    'A biophilic sanctuary situated in Gulshan, Dhaka, comprising stepped botanical terraces.'
),
(
    'apex-commercial-tower',
    'Apex Aerodynamic Tower',
    'Dhaka, Bangladesh',
    '2026',
    'Apex Financial Holdings',
    'Work',
    'architecture',
    'work',
    '85,000',
    '914,000',
    'In Progress',
    '16 / 10',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
    'A skyscraper in tropical Dhaka must be an aerodynamic kite. By sculpting the tower to dissipate cyclones and embedding vertical sky gardens, we re-invent workplace well-being in South Asia.',
    'Plane Architect',
    'Design Principal, Plane Architect Dhaka',
    'A 42-story commercial tower in Motijheel, Dhaka, with an aerodynamic curved silhouette.'
)
ON CONFLICT (slug) DO NOTHING;
