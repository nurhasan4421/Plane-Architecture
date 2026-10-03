import fs from "fs";

// Only keep non-premium IDs since premium_photo- IDs 404 on images.unsplash.com
const allIds = JSON.parse(fs.readFileSync("./scripts/real-unsplash-ids.json", "utf8"));
const validIds = allIds.filter(id => id.startsWith("photo-"));
console.log(`Valid non-premium IDs: ${validIds.length}`);

const existingContent = fs.readFileSync("./src/lib/projects-data.ts", "utf8");
const projectsMatch = existingContent.match(/export const PROJECTS: Project\[\] = (\[[\s\S]*?\]);\s*export const NEWS_ITEMS/);

if (!projectsMatch) {
  console.error("Could not find PROJECTS array");
  process.exit(1);
}

let projects = JSON.parse(projectsMatch[1]);

const unsplash = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

// Track used valid IDs
const usedIds = new Set();
for (const p of projects) {
  const hMatch = p.heroImage?.match(/unsplash\.com\/(photo-[a-zA-Z0-9-]+)/);
  if (hMatch) usedIds.add(hMatch[1]);
  if (p.gallery) {
    for (const g of p.gallery) {
      const gMatch = g.url?.match(/unsplash\.com\/(photo-[a-zA-Z0-9-]+)/);
      if (gMatch) usedIds.add(gMatch[1]);
    }
  }
}

const availableIds = validIds.filter(id => !usedIds.has(id));
let photoIdx = 0;
let replaced = 0;

for (const p of projects) {
  const hMatch = p.heroImage?.match(/unsplash\.com\/([a-zA-Z0-9_-]+)\?/);
  if (hMatch) {
    const id = hMatch[1];
    // Replace if it's premium or a short invalid id
    if (!id.startsWith("photo-")) {
      const newId = availableIds[photoIdx++];
      if (!newId) { console.error("Ran out of valid IDs for hero!"); process.exit(1); }
      usedIds.add(newId);
      p.heroImage = unsplash(newId, 1600);
      replaced++;
    }
  }
  
  if (p.gallery) {
    for (const g of p.gallery) {
      const gMatch = g.url?.match(/unsplash\.com\/([a-zA-Z0-9_-]+)\?/);
      if (gMatch) {
        const id = gMatch[1];
        if (!id.startsWith("photo-")) {
          const newId = availableIds[photoIdx++];
          if (!newId) { console.error("Ran out of valid IDs for gallery!"); process.exit(1); }
          usedIds.add(newId);
          g.url = unsplash(newId, 1200);
          replaced++;
        }
      }
    }
  }
}

console.log(`Replaced ${replaced} premium/invalid image URLs with verified photo-XXXXX ones.`);

const newsMatch = existingContent.match(/export const NEWS_ITEMS: NewsItem\[\] = ([\s\S]*?);\s*export const CATEGORIES_CONFIG/);
const categoriesMatch = existingContent.match(/export const CATEGORIES_CONFIG = ([\s\S]*?);?\s*$/);

const newsItemsCode = newsMatch ? newsMatch[1] : "[]";
const categoriesCode = categoriesMatch ? categoriesMatch[1] : "[]";

const fileContent = `import { Project, NewsItem } from "@/types/project";

export const PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)};

export const NEWS_ITEMS: NewsItem[] = ${newsItemsCode};

export const CATEGORIES_CONFIG = ${categoriesCode};
`;

fs.writeFileSync("./src/lib/projects-data.ts", fileContent, "utf8");
console.log("Done! All images now use verified photo- URLs.");
