import fs from "fs";
import https from "https";

const envLocal = fs.readFileSync(".env.local", "utf8");
const supabaseUrl = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const supabaseKey = envLocal.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

// Read projects
const existingContent = fs.readFileSync("./src/lib/projects-data.ts", "utf8");
const projectsMatch = existingContent.match(/export const PROJECTS: Project\[\] = (\[[\s\S]*?\]);\s*export const NEWS_ITEMS/);
const projects = JSON.parse(projectsMatch[1]);
console.log(`Uploading ${projects.length} projects...`);

const records = projects.map((p, i) => ({
  slug: p.slug,
  title: p.title,
  location: p.location,
  year: p.year,
  client: p.client,
  typology: p.typology,
  category: p.category,
  subcategory: p.subcategory,
  size_m2: p.sizeM2,
  size_ft2: p.sizeFt2 ?? null,
  status: p.status,
  aspect_ratio: p.aspectRatio || "16 / 9",
  hero_image: p.heroImage,
  hero_media_type: p.heroMediaType ?? "image",
  icon_svg: p.iconSvg ?? null,
  quote: p.quote ?? null,
  quote_author: p.quoteAuthor ?? null,
  quote_author_role: p.quoteAuthorRole ?? null,
  description: p.description,
  awards: p.awards ?? [],
  collaborators: p.collaborators ?? [],
  diagrams: {
    narrative: {
      materials: p.materials,
      climateStrategy: p.climateStrategy,
      structuralSystem: p.structuralSystem,
      siteArea: p.siteArea,
      historyContext: p.historyContext,
      designConcept: p.designConcept,
      planningStory: p.planningStory,
      sustainabilityStory: p.sustainabilityStory,
    },
    steps: Array.isArray(p.diagrams) ? p.diagrams : [],
  },
  gallery: p.gallery ?? [],
  credits: p.credits ?? [],
  sort_order: i,
  is_published: true,
}));

// Try upsert via Supabase REST API
async function upsert(batch) {
  const body = JSON.stringify(batch);
  const url = new URL(`/rest/v1/projects`, supabaseUrl);
  
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + "?on_conflict=slug",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "resolution=merge-duplicates",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ ok: true, status: res.statusCode });
          } else {
            resolve({ ok: false, status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// Upsert in batches of 10
const BATCH = 10;
for (let i = 0; i < records.length; i += BATCH) {
  const batch = records.slice(i, i + BATCH);
  const result = await upsert(batch);
  if (result.ok) {
    console.log(`✅ Batch ${Math.floor(i/BATCH)+1}: projects ${i+1}-${Math.min(i+BATCH, records.length)} uploaded`);
  } else {
    console.log(`❌ Batch ${Math.floor(i/BATCH)+1} failed (${result.status}): ${result.body.slice(0, 200)}`);
  }
}
console.log("Done!");
