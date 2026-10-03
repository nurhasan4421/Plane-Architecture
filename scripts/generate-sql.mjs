import fs from "fs";

// Read all 64 projects from local code
const existingContent = fs.readFileSync("./src/lib/projects-data.ts", "utf8");
const projectsMatch = existingContent.match(/export const PROJECTS: Project\[\] = (\[[\s\S]*?\]);\s*export const NEWS_ITEMS/);

if (!projectsMatch) {
  console.error("Could not find PROJECTS array");
  process.exit(1);
}

const projects = JSON.parse(projectsMatch[1]);
console.log(`Generating SQL for ${projects.length} projects...`);

// Helper to escape SQL string
const esc = (val) => {
  if (val == null) return "NULL";
  return `'${String(val).replace(/'/g, "''")}'`;
};

const escJson = (val) => {
  if (val == null) return "NULL";
  return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
};

const escBool = (val) => val ? "true" : "false";

let sql = `-- Seed all projects to Supabase
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qzprubifbcenhbjvasld/sql
-- This will upsert all 64 projects by slug (safe to re-run)

`;

// First delete old rows to avoid duplicates
sql += `-- Delete existing projects first (optional - comment out if you want to keep DB projects)\nDELETE FROM projects;\n\n`;

for (const p of projects) {
  const narrative = {
    materials: p.materials,
    climateStrategy: p.climateStrategy,
    structuralSystem: p.structuralSystem,
    siteArea: p.siteArea,
    historyContext: p.historyContext,
    designConcept: p.designConcept,
    planningStory: p.planningStory,
    sustainabilityStory: p.sustainabilityStory,
  };

  const diagrams = {
    narrative,
    steps: Array.isArray(p.diagrams) ? p.diagrams : [],
  };

  sql += `INSERT INTO projects (
  slug, title, location, year, client, typology, category, subcategory,
  size_m2, size_ft2, status, aspect_ratio, hero_image, hero_media_type,
  icon_svg, quote, quote_author, quote_author_role, description,
  awards, collaborators, diagrams, gallery, credits,
  sort_order, is_published
) VALUES (
  ${esc(p.slug)},
  ${esc(p.title)},
  ${esc(p.location)},
  ${esc(p.year)},
  ${esc(p.client)},
  ${esc(p.typology)},
  ${esc(p.category)},
  ${esc(p.subcategory)},
  ${esc(p.sizeM2)},
  ${p.sizeFt2 ? esc(p.sizeFt2) : "NULL"},
  ${esc(p.status)},
  ${esc(p.aspectRatio || "16 / 9")},
  ${esc(p.heroImage)},
  ${esc(p.heroMediaType || "image")},
  ${p.iconSvg ? esc(p.iconSvg) : "NULL"},
  ${p.quote ? esc(p.quote) : "NULL"},
  ${p.quoteAuthor ? esc(p.quoteAuthor) : "NULL"},
  ${p.quoteAuthorRole ? esc(p.quoteAuthorRole) : "NULL"},
  ${esc(p.description)},
  ${escJson(p.awards || [])},
  ${escJson(p.collaborators || [])},
  ${escJson(diagrams)},
  ${escJson(p.gallery || [])},
  ${escJson(p.credits || [])},
  ${p.sortOrder ?? 0},
  ${escBool(p.isPublished !== false)}
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  year = EXCLUDED.year,
  client = EXCLUDED.client,
  typology = EXCLUDED.typology,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  size_m2 = EXCLUDED.size_m2,
  size_ft2 = EXCLUDED.size_ft2,
  status = EXCLUDED.status,
  aspect_ratio = EXCLUDED.aspect_ratio,
  hero_image = EXCLUDED.hero_image,
  hero_media_type = EXCLUDED.hero_media_type,
  quote = EXCLUDED.quote,
  quote_author = EXCLUDED.quote_author,
  quote_author_role = EXCLUDED.quote_author_role,
  description = EXCLUDED.description,
  awards = EXCLUDED.awards,
  collaborators = EXCLUDED.collaborators,
  diagrams = EXCLUDED.diagrams,
  gallery = EXCLUDED.gallery,
  credits = EXCLUDED.credits,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published;

`;
}

fs.writeFileSync("./scripts/seed-projects.sql", sql, "utf8");
console.log(`Generated SQL file: scripts/seed-projects.sql`);
console.log(`File size: ${(Buffer.byteLength(sql) / 1024).toFixed(1)} KB`);
console.log("\nTo apply:");
console.log("1. Open https://supabase.com/dashboard/project/qzprubifbcenhbjvasld/sql");
console.log("2. Paste the contents of scripts/seed-projects.sql");
console.log("3. Click Run");
