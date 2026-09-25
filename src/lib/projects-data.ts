import { Project, NewsItem } from "@/types/project";

export const PROJECTS: Project[] = [
  {
    id: "1",
    slug: "dhaka-contemporary-art-center",
    title: "Dhaka Contemporary Art Center",
    location: "Dhaka, Bangladesh",
    year: "2026",
    client: "National Arts Trust & Ministry of Cultural Affairs",
    typology: "Culture",
    category: "architecture",
    subcategory: "culture",
    sizeM2: "48,000",
    sizeFt2: "516,000",
    status: "Completed",
    aspectRatio: "16 / 9",
    heroImage:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="32" height="32" stroke="white" stroke-width="2.5"/><circle cx="26" cy="26" r="8" fill="white"/></svg>`,
    quote:
      "Architecture in the Bengal delta must breathe with water, light, and monsoon rhythm. By elevating the galleries above high-water thresholds and carving perforated terracotta screen walls, the center transforms tropical climatic reality into luminous spatial poetry.",
    quoteAuthor: "Plane Architect",
    quoteAuthorRole: "Design Principal, Plane Architect Dhaka",
    description:
      "A flagship cultural landmark positioned along the revitalized waterfront of Dhaka. Featuring a series of interlocking exhibition pavilions wrapped in locally fired perforated terracotta, the complex celebrates Bangladesh's artistic heritage while offering climate-resilient civic gathering halls.",
    awards: ["South Asian Architecture Excellence Award 2025", "International Civic Architecture Gold"],
    collaborators: ["Bengal Structural Consultants", "Delta Climate Labs", "Arup Façades"],
    diagrams: [
      {
        step: "01",
        title: "Site & Floodplain Alignment",
        description: "The 350-meter waterfront boundary establishes the primary axis, aligned with dominant seasonal breeze vectors from the Bay of Bengal.",
        image:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80",
      },
      {
        step: "02",
        title: "Plinth Elevation",
        description: "Elevating the primary public concourse 3.5 meters above maximum fifty-year flood levels creates a secure dry-season amphitheater.",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      },
      {
        step: "03",
        title: "Perforated Terracotta Skin",
        description: "Layering the building envelope with porous brick jali screens reduces solar heat gain by 68% while sustaining natural cross-ventilation.",
        image:
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
      },
      {
        step: "04",
        title: "Courtyard Microclimates",
        description: "Internal shaded water courtyards induce evaporative cooling, lowering ambient gallery temperatures naturally.",
        image:
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
      },
      {
        step: "05",
        title: "Monsoon Roof Scape",
        description: "Deep overhangs and inverted hyperbolic roofs collect 100% of rainwater for year-round cooling and landscape hydration.",
        image:
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
      },
      {
        step: "06",
        title: "Public Promenade",
        description: "The rooftop landscape steps gradually down to the riverbank, returning public green space back to the citizens of Dhaka.",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
        caption: "Main waterfront facade with illuminated perforated terracotta screens",
        aspectRatio: "16 / 9",
      },
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
        caption: "Central atrium with filtered northern daylight and reflection pool",
        aspectRatio: "16 / 9",
      },
      {
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85",
        caption: "Elevated sculpture courtyard connecting east and west galleries",
        aspectRatio: "16 / 9",
      },
    ],
    credits: [
      {
        role: "Principal Architect",
        people: ["Plane Architect Studio"],
      },
      {
        role: "Project Director",
        people: ["K. Rahman", "S. Chowdhury"],
      },
      {
        role: "Design Team",
        people: ["N. Hasan", "T. Ahmed", "M. Karim", "A. Siddique"],
      },
    ],
  },
  {
    id: "2",
    slug: "gulshan-botanical-pavilion",
    title: "Gulshan Botanical Pavilion",
    location: "Dhaka, Bangladesh",
    year: "2025",
    client: "Dhaka Urban Green Trust",
    typology: "Landscape",
    category: "landscape",
    subcategory: "parks",
    sizeM2: "14,500",
    sizeFt2: "156,000",
    status: "Completed",
    aspectRatio: "16 / 10",
    heroImage:
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=85",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 10C16 18 12 30 16 38C20 44 32 44 36 38C40 30 36 18 26 10Z" stroke="white" stroke-width="2.5"/><line x1="26" y1="18" x2="26" y2="42" stroke="white" stroke-width="2"/></svg>`,
    quote:
      "In a dense metropolis, nature cannot be merely a decorative fringe. It must be woven as an active botanical lung that filters urban dust, regulates microclimate, and provides sanctuary.",
    quoteAuthor: "Plane Architect",
    quoteAuthorRole: "Design Principal, Plane Architect",
    description:
      "A biophilic sanctuary situated in Gulshan, Dhaka, comprising stepped botanical terraces, native wetland gardens, and open-air timber pavilions for community contemplation.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=85",
        caption: "Verdant stepped terraces framing the urban reflection lake",
        aspectRatio: "16 / 10",
      },
    ],
    credits: [
      {
        role: "Landscape Lead",
        people: ["Plane Architect Landscape Division"],
      },
    ],
  },
  {
    id: "3",
    slug: "brahmaputra-ecological-campus",
    title: "Brahmaputra Ecological Campus",
    location: "Mymensingh, Bangladesh",
    year: "2025",
    client: "Agricultural Research Foundation",
    typology: "Education",
    category: "architecture",
    subcategory: "education",
    sizeM2: "62,000",
    sizeFt2: "667,000",
    status: "In Progress",
    aspectRatio: "16 / 9",
    heroImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 40L26 12L40 40H12Z" stroke="white" stroke-width="2.5"/><circle cx="26" cy="30" r="4" fill="white"/></svg>`,
    quote:
      "Agrarian landscapes and cutting-edge biotechnology labs meet under a continuous undulating bamboo timber superstructure, blurring the boundary between indoor laboratory and field research.",
    quoteAuthor: "Plane Architect",
    quoteAuthorRole: "Plane Architect Studio",
    description:
      "An advanced agro-climatic university and research campus on the banks of the Brahmaputra River, designed with mass engineered bamboo, rammed earth, and solar canopies.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85",
        caption: "Main research complex with natural daylit timber galleries",
        aspectRatio: "16 / 9",
      },
    ],
    credits: [
      {
        role: "Lead Architects",
        people: ["Plane Architect Studio"],
      },
    ],
  },
  {
    id: "4",
    slug: "meghna-riverside-sanctuary",
    title: "Meghna Riverside Sanctuary",
    location: "Narayanganj, Bangladesh",
    year: "2024",
    client: "Heritage Conservation Trust",
    typology: "Hospitality",
    category: "architecture",
    subcategory: "hospitality",
    sizeM2: "18,200",
    sizeFt2: "195,000",
    status: "Completed",
    aspectRatio: "16 / 10",
    heroImage:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 26C18 20 34 20 42 26C34 32 18 32 10 26Z" stroke="white" stroke-width="2.5"/><circle cx="26" cy="26" r="3" fill="white"/></svg>`,
    quote:
      "Riverine life is the primordial heartbeat of Bengal. The retreat rests gently along the Meghna riverbanks, touching the earth lightly on slender pilotis to permit seasonal tidal ebb and flow.",
    quoteAuthor: "Plane Architect",
    quoteAuthorRole: "Plane Architect Studio",
    description:
      "A low-impact eco-resort and wellness haven surrounded by ancient river canals, utilizing vernacular hand-woven thatch, local red clay, and floating timber decks.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85",
        caption: "Riverside pavilions bathed in dawn mist",
        aspectRatio: "16 / 10",
      },
    ],
    credits: [
      {
        role: "Principal Architects",
        people: ["Plane Architect Studio"],
      },
    ],
  },
  {
    id: "5",
    slug: "sylhet-rain-pavilion",
    title: "Sylhet Rain Pavilion",
    location: "Sylhet, Bangladesh",
    year: "2024",
    client: "Surma Botanical Society",
    typology: "Culture",
    category: "architecture",
    subcategory: "culture",
    sizeM2: "6,400",
    sizeFt2: "68,800",
    status: "Completed",
    aspectRatio: "16 / 9",
    heroImage:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=85",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="26" y1="10" x2="26" y2="42" stroke="white" stroke-width="3"/><path d="M14 22L26 10L38 22" stroke="white" stroke-width="3"/></svg>`,
    quote:
      "Rain is not an adversary to be sealed away, but a sensory symphony to be framed, celebrated, and channeled into cascading fountains and lush moss courts.",
    quoteAuthor: "Plane Architect",
    quoteAuthorRole: "Plane Architect Studio",
    description:
      "An open-air pavilion in the misty tea hills of Sylhet celebrating monsoon rainfall through inverted bronze roof gullies and acoustic rainwater chambers.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=85",
        caption: "Inverted canopy channeling rainwater into the central sunken court",
        aspectRatio: "16 / 9",
      },
    ],
    credits: [
      {
        role: "Design Lead",
        people: ["Plane Architect Studio"],
      },
    ],
  },
  {
    id: "6",
    slug: "apex-commercial-tower",
    title: "Apex Aerodynamic Tower",
    location: "Dhaka, Bangladesh",
    year: "2026",
    client: "Apex Financial Holdings",
    typology: "Work",
    category: "architecture",
    subcategory: "work",
    sizeM2: "85,000",
    sizeFt2: "914,000",
    status: "In Progress",
    aspectRatio: "16 / 10",
    heroImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="8" width="24" height="36" stroke="white" stroke-width="2"/><line x1="14" y1="20" x2="38" y2="20" stroke="white" stroke-width="2"/><line x1="14" y1="32" x2="38" y2="32" stroke="white" stroke-width="2"/></svg>`,
    quote:
      "A skyscraper in tropical Dhaka must be an aerodynamic kite. By sculpting the tower to dissipate cyclones and embedding vertical sky gardens every three stories, we re-invent workplace well-being in South Asia.",
    quoteAuthor: "Plane Architect",
    quoteAuthorRole: "Design Principal, Plane Architect Dhaka",
    description:
      "A 42-story commercial tower in Motijheel, Dhaka, with an aerodynamic curved silhouette that reduces wind vortex shedding and integrates landscaped double-height sky gardens.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
        caption: "Glazed corner terraces overlooking the skyline of Dhaka",
        aspectRatio: "16 / 10",
      },
    ],
    credits: [
      {
        role: "Partners",
        people: ["Plane Architect Studio"],
      },
    ],
  },
  {
    id: "7",
    slug: "sonargaon-cultural-archive",
    title: "Sonargaon Cultural Archive",
    location: "Sonargaon, Bangladesh",
    year: "2023",
    client: "Folk Art and Crafts Foundation",
    typology: "Culture",
    category: "architecture",
    subcategory: "culture",
    sizeM2: "11,800",
    sizeFt2: "127,000",
    status: "Completed",
    aspectRatio: "16 / 9",
    heroImage:
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=85",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="14" width="28" height="24" stroke="white" stroke-width="2"/><line x1="12" y1="26" x2="40" y2="26" stroke="white" stroke-width="2"/></svg>`,
    quote:
      "Historic craftsmanship is not a nostalgic memory; it is an active architectural language of thermal mass, tactile earth, and human-scale detailing.",
    quoteAuthor: "Plane Architect",
    quoteAuthorRole: "Plane Architect Studio",
    description:
      "Dedicated to preserving Bengal's centuries-old weaving, brass craft, and terracotta heritage through climate-controlled archive vaults and public artisan workshops.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=85",
        caption: "Handmade brick vaults providing natural insulation to archive halls",
        aspectRatio: "16 / 9",
      },
    ],
    credits: [
      {
        role: "Lead Architects",
        people: ["Plane Architect Studio"],
      },
    ],
  },
  {
    id: "8",
    slug: "bengal-maritime-hub",
    title: "Bengal Maritime Innovation Hub",
    location: "Chittagong, Bangladesh",
    year: "2025",
    client: "Port Authority & Oceanographic Council",
    typology: "Infrastructure",
    category: "architecture",
    subcategory: "infrastructure",
    sizeM2: "38,000",
    sizeFt2: "409,000",
    status: "In Progress",
    aspectRatio: "16 / 9",
    heroImage:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=85",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 34C18 30 34 30 42 34V18L26 12L10 18V34Z" stroke="white" stroke-width="2.5"/></svg>`,
    quote:
      "The maritime history of the Bay of Bengal shaped global trade routes for millennia. The hub's hull-inspired silhouette acts as a gateway to oceanic research and sustainable port innovation.",
    quoteAuthor: "Plane Architect",
    quoteAuthorRole: "Plane Architect Studio",
    description:
      "A coastal maritime research center and vessel navigation academy engineered with corrosion-resistant marine timber and seawater cooling exchange systems.",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=85",
        caption: "Marine research facility extending into Chittagong harbor waters",
        aspectRatio: "16 / 9",
      },
    ],
    credits: [
      {
        role: "Design Lead",
        people: ["Plane Architect Studio"],
      },
    ],
  },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "n1",
    slug: "dhaka-art-center-inauguration",
    title: "Dhaka Contemporary Art Center Celebrates Grand Opening",
    date: "MARCH 2026",
    category: "Architecture",
    excerpt:
      "Plane Architect's 48,000 m² cultural complex on Dhaka's waterfront opens to the public, inaugurating new civic galleries and shaded water courtyards.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    readTime: "4 min read",
  },
  {
    id: "n2",
    slug: "brahmaputra-campus-groundbreaking",
    title: "Groundbreaking Ceremony for Brahmaputra Ecological Campus",
    date: "FEBRUARY 2026",
    category: "Education",
    excerpt:
      "Construction begins on South Asia's largest engineered bamboo research campus in Mymensingh.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
    readTime: "3 min read",
  },
  {
    id: "n3",
    slug: "gulshan-botanical-award",
    title: "Gulshan Botanical Pavilion Wins South Asian Urban Landscape Prize",
    date: "JANUARY 2026",
    category: "Landscape",
    excerpt:
      "Recognized for restoring native wetlands and introducing microclimatic thermal comfort to central Dhaka.",
    image:
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    readTime: "5 min read",
  },
  {
    id: "n4",
    slug: "sustainability-monograph-release",
    title: "Plane Architect Publishes New Monograph: 'Geometry in the Delta'",
    date: "DECEMBER 2025",
    category: "Publications",
    excerpt:
      "A comprehensive review of 10 years of architectural research, flood resilience, and low-carbon materials in Bangladesh.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    readTime: "6 min read",
  },
];

export const CATEGORIES_CONFIG = [
  {
    id: "architecture",
    label: "Architecture",
    subcategories: [
      { id: "all", label: "View all", slug: "/projects" },
      { id: "culture", label: "Culture", slug: "/projects?type=culture" },
      { id: "education", label: "Education", slug: "/projects?type=education" },
      { id: "work", label: "Work", slug: "/projects?type=work" },
      { id: "hospitality", label: "Hospitality", slug: "/projects?type=hospitality" },
      { id: "residential", label: "Residential", slug: "/projects?type=residential" },
      { id: "infrastructure", label: "Infrastructure", slug: "/projects?type=infrastructure" },
    ],
  },
  {
    id: "interiors",
    label: "Interiors",
    subcategories: [
      { id: "all", label: "View all", slug: "/projects?cat=interiors" },
      { id: "workplace", label: "Workplace", slug: "/projects?cat=interiors&type=workplace" },
      { id: "hospitality", label: "Hospitality", slug: "/projects?cat=interiors&type=hospitality" },
      { id: "exhibition", label: "Exhibition", slug: "/projects?cat=interiors&type=exhibition" },
    ],
  },
  {
    id: "landscape",
    label: "Landscape",
    subcategories: [
      { id: "all", label: "View all", slug: "/projects?cat=landscape" },
      { id: "parks", label: "Parks", slug: "/projects?cat=landscape&type=parks" },
      { id: "civic-spaces", label: "Civic Spaces", slug: "/projects?cat=landscape&type=civic-spaces" },
      { id: "gardens", label: "Gardens", slug: "/projects?cat=landscape&type=gardens" },
    ],
  },
  {
    id: "planning",
    label: "Planning",
    subcategories: [
      { id: "all", label: "View all", slug: "/projects?cat=planning" },
      { id: "campus", label: "Campus", slug: "/projects?cat=planning&type=campus" },
      { id: "city", label: "City", slug: "/projects?cat=planning&type=city" },
      { id: "delta", label: "Delta Masterplans", slug: "/projects?cat=planning&type=delta" },
    ],
  },
  {
    id: "products",
    label: "Products",
    subcategories: [
      { id: "all", label: "View all", slug: "/projects?cat=products" },
      { id: "lighting", label: "Lighting", slug: "/projects?cat=products&type=lighting" },
      { id: "furniture", label: "Furniture", slug: "/projects?cat=products&type=furniture" },
      { id: "installations", label: "Installations", slug: "/projects?cat=products&type=installations" },
    ],
  },
];
