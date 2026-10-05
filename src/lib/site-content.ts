import { CATEGORIES_CONFIG, NEWS_ITEMS, PROJECTS, DEFAULT_AWARDS } from "@/lib/projects-data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { Database, Json } from "@/types/database.types";
import { NewsItem, Project, ProjectTestimonial, AwardItem } from "@/types/project";

const CMS_STORAGE_KEY = "plane-admin-content-v1";

export interface CmsContentState {
  settings: SiteSettings;
  projects: Project[];
  news: NewsItem[];
  testimonials: ProjectTestimonial[];
  awards: AwardItem[];
}

export interface CmsDeletedContent {
  projects: string[];
  news: string[];
  testimonials: string[];
  awards: string[];
}

export const DEFAULT_TESTIMONIALS: ProjectTestimonial[] = [
  {
    id: "testimonial-1",
    projectSlug: "brahmaputra-ecological-campus",
    author: "Dr. Farhana Rahman",
    role: "Managing Director, Delta Ecological Foundation",
    quote: "Plane Architect designed our ecological campus with profound sensitivity to the river monsoon hydrology. It is not just an architectural icon; it functions as a living ecological sanctuary.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    rating: 5,
    isPublished: true,
    sortOrder: 0,
    createdAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "testimonial-2",
    projectSlug: "bengal-delta-pavilion",
    author: "Kazi Anis Ahmed",
    role: "Trustee & Patron, Bengal Cultural Council",
    quote: "The spatial clarity and interplay between brick tectonics and natural light created an unforgettable civic atmosphere for our exhibitions and international cultural gatherings.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    rating: 5,
    isPublished: true,
    sortOrder: 1,
    createdAt: "2024-02-10T00:00:00.000Z",
  },
  {
    id: "testimonial-3",
    projectSlug: "meghna-river-residence",
    author: "Naveed Chowdhury",
    role: "Private Residence Client",
    quote: "Living in the Meghna River Residence is a transformative experience. Every morning the mist off the water enters through the shaded verandahs exactly as envisioned.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    rating: 5,
    isPublished: true,
    sortOrder: 2,
    createdAt: "2024-03-05T00:00:00.000Z",
  },
  {
    id: "testimonial-4",
    projectSlug: "dhaka-jamdani-weaver-village",
    author: "Tahmina Huq",
    role: "Director, Artisan Guild Bangladesh",
    quote: "They worked side-by-side with local weavers to understand the loom ergonomics and natural ventilation needs. The architecture elevates our cultural craft heritage.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    rating: 5,
    isPublished: true,
    sortOrder: 3,
    createdAt: "2024-04-12T00:00:00.000Z",
  },
  {
    id: "testimonial-5",
    projectSlug: "buriganga-riverfront-revitalization",
    author: "Mahfuzur Rahman",
    role: "CEO, Urban Heritage & Development",
    quote: "A masterful balance between modern urban engineering and timeless delta vernacular. Plane Architect transformed our waterfront promenade into a thriving public realm.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    rating: 5,
    isPublished: true,
    sortOrder: 4,
    createdAt: "2024-05-20T00:00:00.000Z",
  },
];

export function readLocalCmsState(): CmsContentState {
  if (typeof window === "undefined") {
    return {
      settings: fallbackSettings,
      projects: PROJECTS,
      news: NEWS_ITEMS,
      testimonials: DEFAULT_TESTIMONIALS,
      awards: DEFAULT_AWARDS,
    };
  }

  try {
    const raw = window.localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) {
      return {
        settings: fallbackSettings,
        projects: PROJECTS,
        news: NEWS_ITEMS,
        testimonials: DEFAULT_TESTIMONIALS,
        awards: DEFAULT_AWARDS,
      };
    }

    const parsed = JSON.parse(raw) as Partial<CmsContentState>;
    const rawLocalNews = Array.isArray(parsed.news) && parsed.news.length ? parsed.news : NEWS_ITEMS;
    const localBySlug = new Map(rawLocalNews.map((n) => [n.slug, n]));
    const mergedNews = NEWS_ITEMS.map((item) => {
      const existing = localBySlug.get(item.slug);
      if (!existing) return item;
      return {
        ...item,
        ...existing,
        // Upgrade legacy non-uuid ids to valid UUIDs
        id: existing.id && existing.id.length > 10 ? existing.id : item.id,
        body: existing.body || item.body,
        isPublished: existing.isPublished ?? item.isPublished ?? true,
      };
    });
    const defaultSlugs = new Set(NEWS_ITEMS.map((n) => n.slug));
    const userCreatedNews = rawLocalNews.filter((n) => !defaultSlugs.has(n.slug));
    const finalLocalNews = [...mergedNews, ...userCreatedNews];

    const rawLocalAwards = Array.isArray(parsed.awards) && parsed.awards.length ? parsed.awards : DEFAULT_AWARDS;
    const localAwardsById = new Map(rawLocalAwards.map((a) => [a.id, a]));
    const mergedAwards = DEFAULT_AWARDS.map((item) => {
      const existing = localAwardsById.get(item.id);
      if (!existing) return item;
      return {
        ...item,
        ...existing,
        isPublished: existing.isPublished ?? item.isPublished ?? true,
      };
    });
    const defaultAwardIds = new Set(DEFAULT_AWARDS.map((a) => a.id));
    const userCreatedAwards = rawLocalAwards.filter((a) => !defaultAwardIds.has(a.id));
    const finalLocalAwards = [...mergedAwards, ...userCreatedAwards];

    return {
      settings: { ...fallbackSettings, ...(parsed.settings ?? {}) },
      projects: Array.isArray(parsed.projects) && parsed.projects.length ? parsed.projects : PROJECTS,
      news: finalLocalNews,
      testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length ? parsed.testimonials : DEFAULT_TESTIMONIALS,
      awards: finalLocalAwards,
    };
  } catch {
    return {
      settings: fallbackSettings,
      projects: PROJECTS,
      news: NEWS_ITEMS,
      testimonials: DEFAULT_TESTIMONIALS,
      awards: DEFAULT_AWARDS,
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
    heading: "LET'S MAKE ROOM FOR WHAT'S NEXT.",
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
    const diagramsJson = row.diagrams as Record<string, unknown> | null;
    const narrative = (diagramsJson && typeof diagramsJson === "object" && "narrative" in diagramsJson && typeof diagramsJson.narrative === "object")
      ? (diagramsJson.narrative as Record<string, string | undefined>)
      : {};
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
      diagrams: (Array.isArray(row.diagrams) ? row.diagrams : (diagramsJson && Array.isArray((diagramsJson as Record<string, unknown>).steps) ? (diagramsJson as Record<string, unknown>).steps : undefined)) as unknown as Project["diagrams"],
      gallery: (row.gallery as unknown as Project["gallery"]) ?? undefined,
      credits: (row.credits as unknown as Project["credits"]) ?? undefined,
      materials: narrative.materials,
      climateStrategy: narrative.climateStrategy,
      structuralSystem: narrative.structuralSystem,
      siteArea: narrative.siteArea,
      historyContext: narrative.historyContext,
      designConcept: narrative.designConcept,
      planningStory: narrative.planningStory,
      sustainabilityStory: narrative.sustainabilityStory,
      sortOrder: row.sort_order,
      isPublished: row.is_published,
      createdAt: row.created_at,
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

  const localProjects = PROJECTS;
  const supabaseProjects = (projectsResult.data ?? []).map(mapProject);
  const supabaseBySlug = new Map(supabaseProjects.map((p) => [p.slug, p]));
  const localSlugs = new Set(localProjects.map((p) => p.slug));

  const mergedProjects = localProjects.map((p) => supabaseBySlug.get(p.slug) ?? p);
  const extraProjects = supabaseProjects.filter((p) => !localSlugs.has(p.slug));

  const localNews = readLocalCmsState().news;
  const supabaseNews = (newsResult.data ?? []).map(mapNews);
  const supabaseNewsBySlug = new Map(supabaseNews.map((n) => [n.slug, n]));
  const localNewsSlugs = new Set(localNews.map((n) => n.slug));

  const mergedNews = localNews.map((n) => supabaseNewsBySlug.get(n.slug) ?? n);
  const extraNews = supabaseNews.filter((n) => !localNewsSlugs.has(n.slug));
  const finalNews: NewsItem[] = (mergedNews.length > 0 || extraNews.length > 0) ? [...mergedNews, ...extraNews] : NEWS_ITEMS;

  const settingsJson = settingsResult.data?.settings as Record<string, unknown> | undefined;
  const remoteAwards = Array.isArray(settingsJson?.awards) ? (settingsJson?.awards as unknown as AwardItem[]) : [];
  const localAwards = readLocalCmsState().awards;
  const remoteAwardsById = new Map(remoteAwards.map((a) => [a.id, a]));
  const mergedAwards = localAwards.map((a) => remoteAwardsById.get(a.id) ?? a);
  const extraAwards = remoteAwards.filter((a) => !localAwards.some((l) => l.id === a.id));
  const finalAwards: AwardItem[] = (mergedAwards.length > 0 || extraAwards.length > 0) ? [...mergedAwards, ...extraAwards] : DEFAULT_AWARDS;

  return {
    settings: mapSiteSettings(settingsResult.data?.settings),
    projects: [...mergedProjects, ...extraProjects],
    news: finalNews,
    testimonials: (testimonialsResult.data && testimonialsResult.data.length > 0) ? testimonialsResult.data.map(mapTestimonial) : readLocalCmsState().testimonials,
    awards: finalAwards,
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
      settings: {
        ...(state.settings as unknown as Record<string, unknown>),
        awards: state.awards,
      } as unknown as Json,
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
      diagrams: {
        narrative: {
          materials: project.materials,
          climateStrategy: project.climateStrategy,
          structuralSystem: project.structuralSystem,
          siteArea: project.siteArea,
          historyContext: project.historyContext,
          designConcept: project.designConcept,
          planningStory: project.planningStory,
          sustainabilityStory: project.sustainabilityStory,
        },
        steps: Array.isArray(project.diagrams) ? project.diagrams : [],
      } as unknown as Json,
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
  // Always use local projects as the baseline so code-defined projects are always visible.
  const localProjects = PROJECTS;

  if (!isSupabaseConfigured || !supabase) return readLocalCmsState().projects;
  const client = supabase as NonNullable<typeof supabase>;
  const response = await client
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true }) as QueryResult<Database["public"]["Tables"]["projects"]["Row"][]>;
  const { data, error } = response;

  // On error or empty DB, fall back to local projects
  if (error || !data || data.length === 0) return readLocalCmsState().projects;

  const supabaseProjects = data.map(mapProject);
  const supabaseBySlug = new Map(supabaseProjects.map((p) => [p.slug, p]));
  const localSlugs = new Set(localProjects.map((p) => p.slug));

  // Local projects with Supabase override applied where available (admin edits win)
  const merged = localProjects.map((p) => supabaseBySlug.get(p.slug) ?? p);
  // Append any projects created via admin that don't exist in local code
  const extraProjects = supabaseProjects.filter((p) => !localSlugs.has(p.slug));

  return [...merged, ...extraProjects];
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
    // If not found in Supabase, fall through to local data below
  }
  // Check localStorage-saved projects first, then fall back to code-defined PROJECTS
  return (
    readLocalCmsState().projects.find((project) => project.slug === slug) ??
    PROJECTS.find((project) => project.slug === slug) ??
    null
  );
}

export async function getNewsItems(): Promise<NewsItem[]> {
  const localNews = readLocalCmsState().news.filter((item) => item.isPublished !== false);
  if (!isSupabaseConfigured || !supabase) return localNews.length > 0 ? localNews : NEWS_ITEMS;
  const client = supabase as NonNullable<typeof supabase>;
  const response = await client
    .from("news")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true }) as QueryResult<Database["public"]["Tables"]["news"]["Row"][]>;
  const { data, error } = response;
  if (error || !data || data.length === 0) return localNews.length > 0 ? localNews : NEWS_ITEMS;

  const supabaseNews = data.map(mapNews);
  const supabaseBySlug = new Map(supabaseNews.map((n) => [n.slug, n]));
  const localSlugs = new Set(localNews.map((n) => n.slug));

  const merged = localNews.map((n) => supabaseBySlug.get(n.slug) ?? n);
  const extraNews = supabaseNews.filter((n) => !localSlugs.has(n.slug));

  return [...merged, ...extraNews];
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
  }
  return (
    readLocalCmsState().news.find((item) => item.slug === slug) ??
    NEWS_ITEMS.find((item) => item.slug === slug) ??
    null
  );
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
  if (error || !data || data.length === 0) return readLocalCmsState().testimonials;
  return data.map(mapTestimonial);
}

export async function getAwards(): Promise<AwardItem[]> {
  const localAwards = readLocalCmsState().awards.filter((a) => a.isPublished !== false);
  if (!isSupabaseConfigured || !supabase) return localAwards.length > 0 ? localAwards : DEFAULT_AWARDS;

  try {
    const client = supabase as NonNullable<typeof supabase>;
    const response = await client
      .from("site_settings")
      .select("settings")
      .eq("singleton", true)
      .maybeSingle() as QueryResult<{ settings: Json }>;
    const settingsJson = response.data?.settings as Record<string, unknown> | undefined;
    if (Array.isArray(settingsJson?.awards) && settingsJson.awards.length > 0) {
      const remote = (settingsJson.awards as unknown as AwardItem[]).filter((a) => a.isPublished !== false);
      return remote.length > 0 ? remote : localAwards;
    }
  } catch {
    // fallback
  }

  return localAwards.length > 0 ? localAwards : DEFAULT_AWARDS;
}