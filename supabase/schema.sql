-- Supabase SQL Schema for Bjarke Ingels Group (BIG) Architecture Website

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
    quote_author TEXT DEFAULT 'Bjarke Ingels',
    quote_author_role TEXT DEFAULT 'Founder & Creative Director, BIG',
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

-- 4. News & Press Table
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

-- Allow anyone (public/anon) to submit a contact inquiry
CREATE POLICY "Allow public insert into inquiries"
    ON public.inquiries
    FOR INSERT
    WITH CHECK (true);

-- 6. Sample Initial Seed Data
INSERT INTO public.projects (
    slug, title, location, year, client, typology, category, subcategory, size_m2, size_ft2, status, aspect_ratio, hero_image, quote, description
) VALUES 
(
    'suzhou-museum-of-contemporary-art',
    'Suzhou Museum of Contemporary Art',
    'Suzhou, China',
    '2026',
    'Suzhou Industrial Park Culture, Sports and Tourism Bureau & Suzhou Harmony Development Group',
    'Culture',
    'architecture',
    'culture',
    '60,000',
    '646,000',
    'Completed',
    '4400 / 2288',
    'https://media.big.dk/2-SUZHOU-MOCA-BY-SUZHOU-MOCA_web.jpg?width=1200',
    'If the historic city center is the cradle of the Chinese garden, the lake district is the cradle of a new Suzhou. The site of the Suzhou Museum of Contemporary Art is sandwiched between the city and the lake. By dissolving the museum into a Chinese garden of interconnected galleries, the museum becomes a connection between the city and the lake.',
    'Located on Jinji Lake, the 60,000-m2 Suzhou Museum of Contemporary Art offers a modern interpretation of the garden elements that have defined Suzhou urbanism for centuries.'
),
(
    'dymak-hq',
    'Dymak HQ',
    'Odense, Denmark',
    '2024',
    'Dymak A/S',
    'Work',
    'architecture',
    'work',
    '5,800',
    '62,400',
    'Completed',
    '3303 / 2288',
    'https://media.big.dk/19_21085_N282_webproject.jpg?width=1200',
    'By elevating the traditional industrial warehouse into a campus of light, timber, and botanical greenery, Dymak HQ demonstrates how modern corporate headquarters can fuse workplace well-being with carbon-conscious design.',
    'A combined headquarters, showroom, and logistics facility for global floral accessory specialist Dymak.'
),
(
    'stem-university',
    'STEM University',
    'Bentonville, United States',
    '2025',
    'Walton Family Foundation',
    'Education',
    'architecture',
    'education',
    '45,000',
    '484,000',
    'In Progress',
    '4066 / 2288',
    'https://media.big.dk/BIG_STEM_01_Aerial-Rendering_final.jpg?width=1200',
    'STEM education thrives when disciplines collide. The university is arranged as a continuous topographical landscape where laboratories, machine shops, and seminar rooms weave together.',
    'A state-of-the-art polytechnic campus integrated directly into the Ozark landscape.'
)
ON CONFLICT (slug) DO NOTHING;
