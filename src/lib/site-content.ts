import { CATEGORIES_CONFIG, NEWS_ITEMS, PROJECTS } from "@/lib/projects-data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { Database, Json } from "@/types/database.types";
import { NewsItem, Project, ProjectTestimonial } from "@/types/project";

const CMS_STORAGE_KEY = "plane-admin-content-v1";

export interface CmsContentState {
  settings: SiteSettings;
  projects: Project[];
  news: NewsItem[];
  testimonials: ProjectTestimonial[];
}

export interface CmsDeletedContent {
  projects: string[];
  news: string[];
  testimonials: string[];
}

export function readLocalCmsState(): CmsContentState {
  if (typeof window === "undefined") {
    return {
      settings: fallbackSettings,
      projects: PROJECTS,
      news: NEWS_ITEMS,
      testimonials: [],
    };
  }

  try {
    const raw = window.localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) {
      return {
        settings: fallbackSettings,
        projects: PROJECTS,
        news: NEWS_ITEMS,
        testimonials: [],
      };
    }

    const parsed = JSON.parse(raw) as Partial<CmsContentState>;
    return {
      settings: { ...fallbackSettings, ...(parsed.settings ?? {}) },
      projects: Array.isArray(parsed.projects) && parsed.projects.length ? parsed.projects : PROJECTS,
      news: Array.isArray(parsed.news) && parsed.news.length ? parsed.news : NEWS_ITEMS,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : [],
    };
  } catch {
    return {
      settings: fallbackSettings,
      projects: PROJECTS,
      news: NEWS_ITEMS,
      testimonials: [],
    };
  }
}

export function writeLocalCmsState(state: Partial<CmsContentState>) {
  if (typeof window === "undefined") return;
  const next = { ...readLocalCmsState(), ...state };
  window.localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("plane-cms-updated"));
}

export interface SiteCategory {
  id: string;
  label: string;
  subcategories: { id: string; label: string; slug?: string }[];
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  tagline: string;
  companyDescription: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: SocialLink[];
  carouselEnabled: boolean;
  featuredProjectSlugs: string[];
  categories: SiteCategory[];
  about: {
    eyebrow: string;
    headline: string;
    paragraphs: string[];
    philosophyTitle: string;
    philosophyParagraphs: string[];
    leadership: { name: string; role: string; studio: string }[];
  };
  contact: {
    heading: string;
    intro: string;
    inquiryTypes: string[];
    budgetOptions: string[];
  };
}

const fallbackSettings: SiteSettings = {
  siteName: "Plane Architect",
  logoUrl: "/logo.png",
  tagline: "Dhaka, Bangladesh",
  companyDescription: "Plane Architect is a Dhaka-based practice working across architecture, landscape, and place.",
  address: "Gulshan Architectural Quarter, Dhaka 1212, Bangladesh",
  phone: "+8801234567891",
  email: "hello@planearchitect.com",
  socialLinks: [
    { label: "Instagram", url: "https://www.instagram.com/plane.architect/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/company/plane-architect/" },
  ],
  carouselEnabled: true,
  featuredProjectSlugs: PROJECTS.slice(0, 5).map((project) => project.slug),
  categories: CATEGORIES_CONFIG,
  about: {
    eyebrow: "About Plane Architect • Dhaka, Bangladesh",
    headline: "Plane Architect is an architectural and spatial laboratory based in Dhaka, Bangladesh, investigating how geometric planes mediate climate, water, and human community.",
    paragraphs: [
      "Founded in Dhaka, Bangladesh, Plane Architect operates at the nexus of deltaic geography, tropical climate resilience, and rigorous architectural geometry. Our work spans cultural institutions, master plans, public riverfronts, and sustainable structures across South Asia and abroad.",
      "Rather than importing generic glass containers unsuited to tropical heat, Plane Architect articulates tactile envelopes: perforated brick jalis, deep monsoon overhangs, breathing timber frames, and shaded internal courtyards that temper heat and invite natural light.",
    ],
    philosophyTitle: "Contextual Materiality & Delta Ecology",
    philosophyParagraphs: [
      "In Bangladesh, the landscape is in continuous motion with river cycles and seasonal monsoons. We view architecture not as a static barrier against nature, but as an inhabitable filter that responds gracefully to seasonal waters, rainfall, and prevailing winds.",
      "Our research focuses on low-carbon local materials — locally manufactured gas-cured terracotta, compressed earth, structural bamboo, and reclaimed timber — paired with high-performance computational envelope modeling.",
    ],
    leadership: [
      { name: "K. M. Rahman", role: "Principal Architect & Founder", studio: "Dhaka" },
      { name: "S. N. Chowdhury", role: "Director of Urban Design & Partner", studio: "Dhaka" },
      { name: "Tariq Ahmed", role: "Head of Environmental Engineering", studio: "Dhaka" },
      { name: "Nadia Hasan", role: "Partner, Landscape Ecology", studio: "Dhaka" },
      { name: "Asif Karim", role: "Director of Research & Materiality", studio: "Dhaka" },
      { name: "M. Siddique", role: "Head of Structural Computation", studio: "Chittagong" },
    ],
  },
  contact: {
    heading: "Let's make room for what's next.",
    intro: "Tell us about the place, the people, and the possibility. Our Dhaka studio will be in touch.",
    inquiryTypes: ["New Project", "Masterplanning", "Press & Media", "Careers", "General"],
    budgetOptions: ["Under BDT 10 lakh", "BDT 10-50 lakh", "BDT 50 lakh-2 crore", "Above BDT 2 crore", "Not sure yet"],
  },
};

function isRecord(value: Json): value is { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mapSiteSettings(payload: Json | null | undefined): SiteSettings {
  if (!payload || !isRecord(payload)) return fallbackSettings;
  const settings = payload as Record<string, Json | undefined>;
  const aboutSettings = settings.about && isRecord(settings.about) ? settings.about : {};
  const contactSettings = settings.contact && isRecord(settings.contact) ? settings.contact : {};

  return {
    ...fallbackSettings,
    ...settings,
    socialLinks: Array.isArray(settings.socialLinks) ? settings.socialLinks as unknown as SocialLink[] : fallbackSettings.socialLinks,
    categories: Array.isArray(settings.categories) ? settings.categories as unknown as SiteCategory[] : fallbackSettings.categories,
    featuredProjectSlugs: Array.isArray(settings.featuredProjectSlugs) ? settings.featuredProjectSlugs as string[] : fallbackSettings.featuredProjectSlugs,
    about: { ...fallbackSettings.about, ...aboutSettings } as SiteSettings["about"],
    contact: { ...fallbackSettings.contact, ...contactSettings } as SiteSettings["contact"],
  } as SiteSettings;
}

export function getFallbackSiteSettings() {
  return fallbackSettings;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured || !supabase) return readLocalCmsState().settings;
  const client = supabase as NonNullable<typeof supabase>;
  const response = await client
    .from("site_settings")
    .select("settings")
    .eq("singleton", true)
    .maybeSingle() as { data: { settings?: Json } | null; error: { message?: string } | null };

  const { data, error } = response;
  if (error || !data) return readLocalCmsState().settings;
  return mapSiteSettings(data.settings);
}

function mapProject(row: Database["public"]["Tables"]["projects"]["Row"]): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    year: row.year,
    client: row.client,
    typology: row.typology,
    category: row.category,
    subcategory: row.subcategory,
    sizeM2: row.size_m2,
    sizeFt2: row.size_ft2 ?? undefined,
    status: row.status as Project["status"],
    aspectRatio: row.aspect_ratio,
    heroImage: row.hero_image,
    heroMediaType: row.hero_media_type === "video" ? "video" : "image",
    iconSvg: row.icon_svg ?? undefined,
    quote: row.quote ?? undefined,
    quoteAuthor: row.quote_author ?? undefined,
    quoteAuthorRole: row.quote_author_role ?? undefined,
    description: row.description,
    awards: (row.awards as string[] | null) ?? undefined,
    collaborators: (row.collaborators as string[] | null) ?? undefined,
    diagrams: (row.diagrams as unknown as Project["diagrams"]) ?? undefined,
    gallery: (row.gallery as unknown as Project["gallery"]) ?? undefined,
    credits: (row.credits as unknown as Project["credits"]) ?? undefined,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
  };
}

function mapNews(row: Database["public"]["Tables"]["news"]["Row"]): NewsItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date,
    author: row.author,
    sourceUrl: row.source_url ?? undefined,
    category: row.category,
    excerpt: row.excerpt,
    image: row.image,
    readTime: row.read_time,
    body: row.body,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
  };
}

function mapTestimonial(row: Database["public"]["Tables"]["testimonials"]["Row"]): ProjectTestimonial {
  return {
    id: row.id,
    projectSlug: row.project_slug,
    author: row.author,
    role: row.role,
    quote: row.quote,
    image: row.image_url,
    rating: row.rating,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

type QueryResult<T> = { data: T | null; error: { message?: string } | null };

export async function getAdminCmsContent(): Promise<CmsContentState> {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase is not configured.");
  const client = supabase as NonNullable<typeof supabase>;
  const [settingsQuery, projectsQuery, newsQuery, testimonialsQuery] = await Promise.all([
    client.from("site_settings").select("settings").eq("singleton", true).maybeSingle(),
    client.from("projects").select("*").order("sort_order", { ascending: true }),
    client.from("news").select("*").order("sort_order", { ascending: true }),
    client.from("testimonials").select("*").order("sort_order", { ascending: true }),
  ]);

  const settingsResult = settingsQuery as QueryResult<{ settings: Json }>;
  const projectsResult = projectsQuery as QueryResult<Database["public"]["Tables"]["projects"]["Row"][]>;
  const newsResult = newsQuery as QueryResult<Database["public"]["Tables"]["news"]["Row"][]>;
  const testimonialsResult = testimonialsQuery as QueryResult<Database["public"]["Tables"]["testimonials"]["Row"][]>;
  const queryError = settingsResult.error || projectsResult.error || newsResult.error || testimonialsResult.error;

  if (queryError) throw new Error(queryError.message || "Unable to load CMS content from Supabase.");

  return {
    settings: mapSiteSettings(settingsResult.data?.settings),
    projects: (projectsResult.data ?? []).map(mapProject),
    news: (newsResult.data ?? []).map(mapNews),
    testimonials: (testimonialsResult.data ?? []).map(mapTestimonial),
  };
}

export async function saveAdminCmsContent(state: CmsContentState, deleted: CmsDeletedContent): Promise<void> {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase is not configured.");
  const client = supabase as NonNullable<typeof supabase>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmsClient = client as any;

  const [settingsResult, projectsResult, newsResult, testimonialsResult] = await Promise.all([
    cmsClient.from("site_settings").upsert({
      singleton: true,
      settings: state.settings as unknown as Json,
      updated_at: new Date().toISOString(),
    }, { onConflict: "singleton" }),
    cmsClient.from("projects").upsert(state.projects.map((project: Project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      location: project.location,
      year: project.year,
      client: project.client,
      typology: project.typology,
      category: project.category,
      subcategory: project.subcategory,
      size_m2: project.sizeM2,
      size_ft2: project.sizeFt2 ?? null,
      status: project.status,
      aspect_ratio: project.aspectRatio,
      hero_image: project.heroImage,
      hero_media_type: project.heroMediaType ?? "image",
      icon_svg: project.iconSvg ?? null,
      quote: project.quote ?? null,
      quote_author: project.quoteAuthor ?? null,
      quote_author_role: project.quoteAuthorRole ?? null,
      description: project.description,
      awards: (project.awards ?? []) as Json,
      collaborators: (project.collaborators ?? []) as Json,
      diagrams: (project.diagrams ?? []) as unknown as Json,
      gallery: (project.gallery ?? []) as unknown as Json,
      credits: (project.credits ?? []) as unknown as Json,
      sort_order: project.sortOrder ?? 0,
      is_published: project.isPublished ?? false,
    }))),
    cmsClient.from("news").upsert(state.news.map((item: NewsItem) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      date: item.date,
      author: item.author ?? "Plane Architect",
      source_url: item.sourceUrl ?? null,
      category: item.category,
      excerpt: item.excerpt,
      image: item.image,
      read_time: item.readTime,
      body: item.body ?? "",
      sort_order: item.sortOrder ?? 0,
      is_published: item.isPublished ?? false,
    }))),
    cmsClient.from("testimonials").upsert(state.testimonials.map((item: ProjectTestimonial) => ({
      id: item.id,
      project_slug: item.projectSlug,
      author: item.author,
      role: item.role,
      quote: item.quote,
      image_url: item.image ?? "",
      rating: Math.max(1, Math.min(5, item.rating)),
      is_published: item.isPublished,
      sort_order: item.sortOrder,
    }))),
  ]);

  const writeError = settingsResult.error || projectsResult.error || newsResult.error || testimonialsResult.error;
  if (writeError) throw new Error(writeError.message || "Unable to save CMS content to Supabase.");

  const deleteResults = await Promise.all([
    deleted.projects.length ? cmsClient.from("projects").delete().in("id", deleted.projects) : Promise.resolve({ error: null }),
    deleted.news.length ? cmsClient.from("news").delete().in("id", deleted.news) : Promise.resolve({ error: null }),
    deleted.testimonials.length ? cmsClient.from("testimonials").delete().in("id", deleted.testimonials) : Promise.resolve({ error: null }),
  ]);
  const deleteError = deleteResults.find((result) => result.error)?.error;
  if (deleteError) throw new Error(deleteError.message || "Unable to delete CMS content from Supabase.");
}

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase) return readLocalCmsState().projects;
  const client = supabase as NonNullable<typeof supabase>;
  const response = await client
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true }) as QueryResult<Database["public"]["Tables"]["projects"]["Row"][]>;
  const { data, error } = response;
  if (error) return readLocalCmsState().projects;
  return (data ?? []).map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isSupabaseConfigured && supabase) {
    const client = supabase as NonNullable<typeof supabase>;
    const response = await client
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle() as QueryResult<Database["public"]["Tables"]["projects"]["Row"]>;
    const { data, error } = response;
    if (!error && data) return mapProject(data);
    if (!error) return null;
  }
  return readLocalCmsState().projects.find((project) => project.slug === slug) ?? null;
}

export async function getNewsItems(): Promise<NewsItem[]> {
  if (!isSupabaseConfigured || !supabase) return readLocalCmsState().news;
  const client = supabase as NonNullable<typeof supabase>;
  const response = await client
    .from("news")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true }) as QueryResult<Database["public"]["Tables"]["news"]["Row"][]>;
  const { data, error } = response;
  if (error) return readLocalCmsState().news;
  return (data ?? []).map(mapNews);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  if (isSupabaseConfigured && supabase) {
    const client = supabase as NonNullable<typeof supabase>;
    const response = await client
      .from("news")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle() as QueryResult<Database["public"]["Tables"]["news"]["Row"]>;
    const { data, error } = response;
    if (!error && data) return mapNews(data);
    if (!error) return null;
  }
  return readLocalCmsState().news.find((item) => item.slug === slug) ?? null;
}

export async function getTestimonials(): Promise<ProjectTestimonial[]> {
  if (!isSupabaseConfigured || !supabase) return readLocalCmsState().testimonials;
  const client = supabase as NonNullable<typeof supabase>;
  const response = await client
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true }) as QueryResult<Database["public"]["Tables"]["testimonials"]["Row"][]>;
  const { data, error } = response;
  if (error || !data) return readLocalCmsState().testimonials;
  return data.map(mapTestimonial);
}