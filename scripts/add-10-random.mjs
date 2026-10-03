import fs from "fs";
import path from "path";

const UNSPLASH_IDS = JSON.parse(fs.readFileSync("./scripts/unsplash-ids.json", "utf8"));

// Read existing data
const existingContent = fs.readFileSync("./src/lib/projects-data.ts", "utf8");

const projectsMatch = existingContent.match(/export const PROJECTS: Project\[\] = (\[[\s\S]*?\]);\s*export const NEWS_ITEMS/);
let existingProjects = [];
if (projectsMatch) {
  existingProjects = JSON.parse(projectsMatch[1]);
} else {
  console.error("Could not find PROJECTS array");
  process.exit(1);
}

const unsplash = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

// Calculate used IDs
const usedIds = new Set();
for (const p of existingProjects) {
  const match = p.heroImage?.match(/unsplash\.com\/([a-zA-Z0-9_-]+)/);
  if (match) usedIds.add(match[1]);
  if (p.gallery) {
    for (const g of p.gallery) {
      const gMatch = g.url.match(/unsplash\.com\/([a-zA-Z0-9_-]+)/);
      if (gMatch) usedIds.add(gMatch[1]);
    }
  }
}

const availableIds = UNSPLASH_IDS.filter(id => !usedIds.has(id));
if (availableIds.length < 70) {
  console.error("Not enough available Unsplash IDs");
  process.exit(1);
}

let photoIdx = 0;

const categories = [
  { c: "architecture", s: "culture", t: "Culture" },
  { c: "architecture", s: "education", t: "Education" },
  { c: "architecture", s: "work", t: "Work" },
  { c: "architecture", s: "residential", t: "Residential" },
  { c: "interiors", s: "workplace", t: "Workplace" },
  { c: "landscape", s: "parks", t: "Parks" },
];

const locations = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Cox's Bazar"];
const adjectives = ["Modern", "Luminous", "Sustainable", "Bioclimatic", "Minimalist", "Terracotta"];
const nouns = ["Pavilion", "Tower", "Center", "Hub", "Villa", "Campus"];

let currentId = existingProjects.length > 0 ? Math.max(...existingProjects.map(p => parseInt(p.id, 10))) : 0;

const newProjects = [];
for (let i = 0; i < 10; i++) {
  currentId++;
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const loc = locations[Math.floor(Math.random() * locations.length)];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const title = `${loc} ${adj} ${noun}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const heroId = availableIds[photoIdx++];
  const gallery = [];
  for (let g = 0; g < 6; g++) {
    gallery.push({
      url: unsplash(availableIds[photoIdx++], 1200),
      caption: `Gallery image ${g + 1} for ${title}`,
      isFeature: true
    });
  }

  const p = {
    id: currentId.toString(),
    slug: slug + "-" + i,
    title,
    location: `${loc}, Bangladesh`,
    year: (2024 + Math.floor(Math.random() * 3)).toString(),
    client: "Confidential Client",
    typology: cat.t,
    category: cat.c,
    subcategory: cat.s,
    sizeM2: (1000 + Math.floor(Math.random() * 50000)).toString(),
    sizeFt2: "TBD",
    status: ["Completed", "In Progress", "Concept"][Math.floor(Math.random() * 3)],
    aspectRatio: "16 / 9",
    heroImage: unsplash(heroId, 1600),
    description: `A brand new ${cat.c} project showcasing innovative design in ${loc}.`,
    quote: `The essence of this project lies in its connection to the context.`,
    quoteAuthor: "Plane Architect",
    quoteAuthorRole: "Design Principal",
    materials: "Concrete, Steel, Glass, Timber",
    climateStrategy: "Passive cooling, cross ventilation",
    structuralSystem: "Reinforced concrete frame",
    siteArea: "Varies",
    historyContext: "Situated in a dynamic urban landscape, responding to the cultural needs of the surrounding area.",
    designConcept: "Focused on integrating natural light and sustainable materials to create a holistic environment.",
    planningStory: "A collaborative effort between engineers, architects, and the community.",
    sustainabilityStory: "Designed with a low carbon footprint and passive energy strategies.",
    credits: [
      { role: "Lead Architect", people: ["Plane Architect"] }
    ],
    collaborators: [],
    awards: [],
    gallery,
    isPublished: true,
    sortOrder: currentId - 1,
    createdAt: new Date().toISOString(),
  };

  newProjects.push(p);
}

const allProjects = [...existingProjects, ...newProjects];

const newsMatch = existingContent.match(/export const NEWS_ITEMS: NewsItem\[\] = ([\s\S]*?);\s*export const CATEGORIES_CONFIG/);
const categoriesMatch = existingContent.match(/export const CATEGORIES_CONFIG = ([\s\S]*?);?\s*$/);

const newsItemsCode = newsMatch ? newsMatch[1] : "[]";
const categoriesCode = categoriesMatch ? categoriesMatch[1] : "[]";

const fileContent = `import { Project, NewsItem } from "@/types/project";

export const PROJECTS: Project[] = ${JSON.stringify(allProjects, null, 2)};

export const NEWS_ITEMS: NewsItem[] = ${newsItemsCode};

export const CATEGORIES_CONFIG = ${categoriesCode};
`;

fs.writeFileSync("./src/lib/projects-data.ts", fileContent, "utf8");
console.log(`Added 10 new random projects! Total projects is now ${allProjects.length}.`);
