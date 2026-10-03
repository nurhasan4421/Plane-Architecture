export type ProjectCategory =
  | "architecture"
  | "interiors"
  | "landscape"
  | "planning"
  | "products";

export type ProjectTypology =
  | "culture"
  | "education"
  | "work"
  | "hospitality"
  | "residential"
  | "infrastructure"
  | "space"
  | "sports"
  | "health"
  | "civic-spaces"
  | "parks"
  | "gardens"
  | "balconies-and-terraces"
  | "campus"
  | "city"
  | "region"
  | "lighting"
  | "furniture"
  | "consumer-products"
  | "mobility"
  | "installations";

export interface ConceptDiagram {
  step: string;
  title: string;
  description: string;
  image: string;
}

export interface ProjectCredit {
  role: string;
  people: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  year: string;
  client: string;
  typology: string;
  category: string;
  subcategory: string;
  sizeM2: string;
  sizeFt2?: string;
  status: "Completed" | "In Progress" | "Competition Win" | "Concept";
  aspectRatio: string;
  heroImage: string;
  heroMediaType?: "image" | "video";
  iconSvg?: string;
  quote?: string;
  quoteAuthor?: string;
  quoteAuthorRole?: string;
  description: string;
  awards?: string[];
  collaborators?: string[];
  diagrams?: ConceptDiagram[];
  gallery?: {
    url: string;
    caption?: string;
    aspectRatio?: string;
    mediaType?: "image" | "video";
  }[];
  credits?: ProjectCredit[];
  sortOrder?: number;
  isPublished?: boolean;
  createdAt?: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  author?: string;
  sourceUrl?: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  body?: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface ProjectTestimonial {
  id: string;
  projectSlug: string | null;
  author: string;
  role: string;
  quote: string;
  image?: string;
  rating: number;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}
