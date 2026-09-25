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
  category: ProjectCategory;
  subcategory: string;
  sizeM2: string;
  sizeFt2?: string;
  status: "Completed" | "In Progress" | "Competition Win" | "Concept";
  aspectRatio: string;
  heroImage: string;
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
  }[];
  credits?: ProjectCredit[];
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
}
