import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import crypto from "crypto";

// Read env variables manually since we are running as a bare Node script
const envLocal = fs.readFileSync(".env.local", "utf8");
const supabaseUrl = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const supabaseKey = envLocal.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const existingContent = fs.readFileSync("./src/lib/projects-data.ts", "utf8");
const projectsMatch = existingContent.match(/export const PROJECTS: Project\[\] = (\[[\s\S]*?\]);\s*export const NEWS_ITEMS/);

if (!projectsMatch) {
  console.error("Could not find PROJECTS array in projects-data.ts");
  process.exit(1);
}

const projects = JSON.parse(projectsMatch[1]);
console.log(`Found ${projects.length} projects to sync to Supabase...`);

async function sync() {
  // We can fetch existing projects from DB first to preserve their IDs if slugs match.
  const { data: existingDbProjects, error: fetchError } = await supabase.from("projects").select("id, slug");
  if (fetchError) {
    console.error("Error fetching existing projects:", fetchError);
    process.exit(1);
  }

  const slugToId = new Map(existingDbProjects.map(p => [p.slug, p.id]));

  const records = projects.map(project => {
    // If slug exists in DB, use existing UUID, otherwise generate a new one
    const uuid = slugToId.get(project.slug) || crypto.randomUUID();
    return {
      id: uuid,
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
      awards: (project.awards ?? []),
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
      },
      gallery: (project.gallery ?? []),
      credits: (project.credits ?? []),
      sort_order: project.sortOrder ?? 0,
      is_published: project.isPublished ?? false,
    };
  });

  // Use upsert now that we have UUIDs for all projects
  const { error } = await supabase.from("projects").upsert(records);
  if (error) {
    console.error("Error upserting projects to Supabase:", error);
  } else {
    console.log("Successfully synced all projects to Supabase!");
    
    // We must also update projects-data.ts so the IDs match what's in the DB!
    const updatedProjects = projects.map((p, i) => ({ ...p, id: records[i].id }));
    const allProjectsStr = JSON.stringify(updatedProjects, null, 2);
    const newContent = existingContent.replace(
      /export const PROJECTS: Project\[\] = \[[\s\S]*?\];\s*export const NEWS_ITEMS/,
      `export const PROJECTS: Project[] = ${allProjectsStr};\n\nexport const NEWS_ITEMS`
    );
    fs.writeFileSync("./src/lib/projects-data.ts", newContent, "utf8");
    console.log("Updated projects-data.ts with UUIDs.");
  }
}

sync();
