"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight as ArrowRightIcon,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  FileImage,
  FolderKanban,
  GitCommit,
  History,
  LayoutDashboard,
  ListTree,
  Lock,
  LogOut,
  Plus,
  Redo2,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Save,
  Star,
  Trash2,
  Undo2,
  Upload,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";
import PlaneLogo from "@/components/PlaneLogo";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { getAdminCmsContent, saveAdminCmsContent } from "@/lib/site-content";
import type { CmsDeletedContent, SiteCategory } from "@/lib/site-content";
import { NewsItem, Project, ProjectTestimonial } from "@/types/project";
import { formatImageUrl, formatImageCaption } from "@/lib/image-utils";

const DEFAULT_COLLAGE_CAPTIONS = [
  "Contextual massing & urban threshold",
  "Material tectonics & surface texture",
  "Interior spatial canopy & light wells",
  "Circulation flows & courtyard continuity",
  "Elevated skyline profile & sun shading",
  "Oculus & integrated natural landscape",
];

const emptyProject = (): Project => ({
  id: crypto.randomUUID(),
  slug: "new-project",
  title: "New Project",
  location: "Dhaka, Bangladesh",
  year: String(new Date().getFullYear()),
  client: "Plane Architect",
  typology: "Culture",
  category: "architecture",
  subcategory: "culture",
  sizeM2: "5,000",
  sizeFt2: "53,800",
  status: "Concept",
  aspectRatio: "16 / 9",
  heroImage: "",
  description: "A flagship architectural commission negotiating daylight, climate, and materiality.",
  quote: "Architecture in the Bengal delta must breathe with water, light, and monsoon rhythm.",
  quoteAuthor: "Plane Architect",
  quoteAuthorRole: "Design Principal",
  materials: "Board-formed concrete, local terracotta jali, low-E insulated glazing",
  climateStrategy: "Deep perimeter porticos, natural stack cross-ventilation, shaded courtyards",
  structuralSystem: "Cast-in-place reinforced concrete & post-tensioned slabs",
  siteArea: "12,000 m² urban waterfront parcel",
  historyContext: "Situated in Dhaka, Bangladesh, the project responds to the rich cultural, alluvial, and urban evolution of its setting.",
  designConcept: "Conceived as an expressive interplay of solid stereotomic mass and porous transitional voids, the architecture choreographs natural light.",
  planningStory: "Constructed through close collaboration with regional master artisans and structural engineers to achieve crisp tectonic tolerances.",
  sustainabilityStory: "Rooted in passive bioclimatic resilience, deep overhangs and cross-ventilation mitigate operational cooling energy.",
  credits: [
    { role: "Lead Architect", people: ["Plane Architect"] },
    { role: "Design Director", people: ["Design Principal"] },
    { role: "Structural Engineering", people: ["Delta Structural Engineering Atelier"] },
    { role: "Climate & Environmental Systems", people: ["Atelier Bioclimatic Systems"] },
    { role: "Landscape Architecture", people: ["Studio Alluvial Landscapes"] },
    { role: "General Contractor", people: ["Apex Construction & Infrastructure Consortium"] },
  ],
  collaborators: ["Delta Structural Engineering Atelier", "Atelier Bioclimatic Systems", "Studio Alluvial Landscapes"],
  awards: ["Design Excellence Citation", "Regional Sustainable Building Honor"],
  isPublished: false,
  sortOrder: 0,
  gallery: DEFAULT_COLLAGE_CAPTIONS.map((caption) => ({ url: "", caption })),
});

const emptyNews = (): NewsItem => ({
  id: crypto.randomUUID(),
  slug: `news-${Date.now().toString(36)}`,
  title: "New Article Title",
  date: new Date().toLocaleDateString("en", { month: "short", year: "numeric" }).toUpperCase(),
  author: "Plane Architect Studio",
  category: "Architecture",
  excerpt: "Brief summary or lead paragraph for this news item.",
  image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  readTime: "4 min read",
  body: "Detailed article body content goes here. Use empty lines between paragraphs to format the article.",
  isPublished: true,
  sortOrder: 0,
});

const emptyTestimonial = (): ProjectTestimonial => ({
  id: crypto.randomUUID(),
  projectSlug: null,
  author: "Client Name",
  role: "Project Lead",
  quote: "Add a client testimonial.",
  image: "",
  rating: 5,
  isPublished: false,
  sortOrder: 0,
  createdAt: new Date().toISOString(),
});

type AdminSection = "overview" | "projects" | "carousel" | "news" | "testimonials" | "categories" | "cta" | "settings";
type ProjectTreeSelection = { categoryId: string; subcategoryId: string };

const inputClass = "mt-1.5 w-full border border-black/15 bg-white px-3.5 py-2.5 text-sm text-[#171717] outline-none transition placeholder:text-neutral-400 focus:border-black";
const labelClass = "block text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500";

const navItems: { key: AdminSection; label: string; icon: LucideIcon }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "carousel", label: "Carousel", icon: SlidersHorizontal },
  { key: "news", label: "News & Journal", icon: BookOpen },
  { key: "testimonials", label: "Testimonials", icon: UsersRound },
  { key: "categories", label: "Categories", icon: ListTree },
  { key: "cta", label: "Start Project", icon: ArrowRightIcon },
  { key: "settings", label: "Site settings", icon: Settings2 },
];

const AdminTaxonomyContext = createContext<{
  enabled: boolean;
  categories: SiteCategory[];
  category: string;
  subcategory: string;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
}>({
  enabled: false,
  categories: [],
  category: "",
  subcategory: "",
  onCategoryChange: () => undefined,
  onSubcategoryChange: () => undefined,
});

function uniqueSlug(label: string, existingIds: string[]) {
  const base = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "category";
  let candidate = base;
  let suffix = 2;
  while (existingIds.includes(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function AdminField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  rows,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  rows?: number;
  className?: string;
}) {
  const taxonomy = useContext(AdminTaxonomyContext);

  if (taxonomy.enabled && label === "Category") {
    return (
      <label className={`${labelClass} ${className}`}>
        Category
        <select value={taxonomy.category} onChange={(event) => taxonomy.onCategoryChange(event.target.value)} className={inputClass} required>
          {taxonomy.categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
        </select>
      </label>
    );
  }

  if (taxonomy.enabled && label === "Subcategory") {
    const subcategories = taxonomy.categories.find((category) => category.id === taxonomy.category)?.subcategories.filter((subcategory) => subcategory.id !== "all") ?? [];
    return (
      <label className={`${labelClass} ${className}`}>
        Subcategory
        <select value={taxonomy.subcategory} onChange={(event) => taxonomy.onSubcategoryChange(event.target.value)} className={inputClass} required>
          <option value="" disabled>Select a subcategory</option>
          {subcategories.map((subcategory) => <option key={subcategory.id} value={subcategory.id}>{subcategory.label}</option>)}
        </select>
      </label>
    );
  }

  return (
    <label className={`${labelClass} ${className}`}>
      {label}
      {rows ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </label>
  );
}

function SupabaseMediaField({
  label,
  value,
  onChange,
  allowVideo = false,
}: {
  label: string;
  value: string;
  onChange: (url: string, mediaType?: "image" | "video") => void;
  allowVideo?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const acceptedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/heic",
    "image/heif",
    "image/gif",
    ...(allowVideo ? ["video/mp4", "video/webm", "video/quicktime"] : []),
  ]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploaded(false);

    if (!supabase) {
      setUploadError("Supabase is not configured.");
      input.value = "";
      return;
    }
    if (!acceptedTypes.has(file.type)) {
      setUploadError("Choose a supported image file" + (allowVideo ? " or MP4, WebM, or MOV video." : "."));
      input.value = "";
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("Files must be 50 MB or smaller.");
      input.value = "";
      return;
    }

    setUploading(true);
    try {
      const mediaFolder = file.type.startsWith("video/") ? "videos" : "images";
      const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
      const objectPath = `${mediaFolder}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("site-media").upload(objectPath, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;

      const { data } = supabase.storage.from("site-media").getPublicUrl(objectPath);
      onChange(data.publicUrl, file.type.startsWith("video/") ? "video" : "image");
      setUploaded(true);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed. Check the Supabase Storage bucket and admin policy.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  return (
    <div>
      <AdminField
        label={label}
        value={value}
        onChange={(url) => {
          setUploaded(false);
          onChange(formatImageUrl(url));
        }}
        placeholder="https://... or Google Drive share link"
      />
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <input ref={inputRef} type="file" accept={allowVideo ? "image/*,video/mp4,video/webm,video/quicktime" : "image/*"} onChange={handleUpload} className="sr-only" aria-label={`Upload ${label.toLowerCase()}`} />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex h-8 items-center gap-2 rounded-[4px] border border-black/15 px-3 text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-700 transition hover:border-black disabled:cursor-wait disabled:opacity-50">
          <Upload className="h-3.5 w-3.5" />{uploading ? "Uploading..." : "Upload from device"}
        </button>
        <span className="text-[10px] text-neutral-400">Supabase Storage · 50 MB max · Google Drive links supported</span>
      </div>
      {uploaded && <p role="status" className="mt-2 text-xs text-[#426454]">Uploaded to Supabase Storage.</p>}
      {uploadError && <p role="alert" className="mt-2 text-xs text-red-600">{uploadError}</p>}
    </div>
  );
}

function ProjectCollageAdminSlot({
  slotNumber,
  slotTitle,
  aspectClass,
  badgePosition,
  item,
  onChange,
}: {
  slotNumber: number;
  slotTitle: string;
  aspectClass: string;
  badgePosition: "top" | "bottom";
  item: { url: string; caption?: string };
  onChange: (updated: { url: string; caption?: string }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setUploadError("");
    if (!supabase) {
      setUploadError("Supabase is not configured.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const objectPath = `images/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("site-media").upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("site-media").getPublicUrl(objectPath);
      onChange({ ...item, url: data.publicUrl });
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-[6px] border border-black/10 bg-white p-2.5 shadow-xs">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
        <span>Slot {slotNumber}: {slotTitle}</span>
        {uploading && <span className="text-amber-600">Uploading...</span>}
      </div>

      {/* Visual aspect preview matching the website collage */}
      <div className={`relative w-full ${aspectClass} overflow-hidden rounded-[4px] bg-[#ebeae6]`}>
        {item.url ? (
          <img src={formatImageUrl(item.url)} alt={item.caption || `Slot ${slotNumber}`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-3 text-neutral-400">
            <FileImage className="h-5 w-5 mb-1 text-neutral-300" />
            <span className="text-[9px] uppercase tracking-wider text-neutral-400">Empty Photo</span>
          </div>
        )}

        {/* Live caption badge matching the website overlay */}
        {formatImageCaption(item.caption) && (
          <span
            className={`absolute ${
              badgePosition === "top" ? "top-2 left-2" : "bottom-2 left-2"
            } max-w-[90%] truncate bg-black/85 px-2 py-0.5 text-[8px] sm:text-[9px] font-medium uppercase tracking-wider text-white shadow-sm`}
          >
            {formatImageCaption(item.caption)}
          </span>
        )}
      </div>

      {/* URL & Upload button */}
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={item.url || ""}
          onChange={(e) => onChange({ ...item, url: formatImageUrl(e.target.value) })}
          placeholder="Image URL or Google Drive link..."
          className="h-7 min-w-0 flex-1 rounded-[3px] border border-black/10 bg-white px-2 text-[11px] text-black outline-none focus:border-black placeholder:text-neutral-400"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          title="Upload image file"
          className="inline-flex h-7 items-center justify-center rounded-[3px] border border-black/15 bg-neutral-50 px-2 text-[9px] font-medium uppercase tracking-wider text-neutral-700 hover:border-black disabled:opacity-50 shrink-0 cursor-pointer"
        >
          <Upload className="h-3 w-3 mr-1" /> Upload
        </button>
      </div>

      {/* Caption text */}
      <div>
        <input
          type="text"
          value={item.caption || ""}
          onChange={(e) => onChange({ ...item, caption: e.target.value })}
          placeholder="Caption (e.g. Contextual massing & urban threshold)..."
          className="h-7 w-full rounded-[3px] border border-black/10 bg-white px-2 text-[10px] uppercase tracking-wide text-neutral-700 outline-none focus:border-black placeholder:text-neutral-400"
        />
      </div>

      {uploadError && <p className="text-[10px] text-red-600">{uploadError}</p>}
    </div>
  );
}

function AdminCollageGrid({
  gallery,
  onChange,
}: {
  gallery?: { url: string; caption?: string }[];
  onChange: (gallery: { url: string; caption?: string }[]) => void;
}) {
  const slots = useMemo(() => {
    const list = [...(gallery || [])];
    while (list.length < 6) {
      const idx = list.length;
      list.push({ url: "", caption: DEFAULT_COLLAGE_CAPTIONS[idx] || "" });
    }
    return list.slice(0, 6);
  }, [gallery]);

  const updateSlot = (index: number, updated: { url: string; caption?: string }) => {
    const next = [...slots];
    next[index] = {
      ...updated,
      url: formatImageUrl(updated.url),
    };
    // Preserve any extended gallery items beyond index 5
    const existingExtended = (gallery || []).slice(6);
    onChange([...next, ...existingExtended]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            6-Photo Featured Collage (Aligned Website UI Match)
          </p>
          <p className="text-xs text-neutral-500">
            All 3 columns are mathematically aligned on all sides and bottom. Direct Google Drive links & uploaded photos supported.
          </p>
        </div>
      </div>

      {/* Live Synced Collage Preview - 100% Flush Aligned On All Sides */}
      <div className="rounded-[6px] border border-black/15 bg-[#171717] p-3 shadow-inner">
        <p className="mb-2 text-[9px] uppercase tracking-[0.14em] text-neutral-400 font-medium">
          Live Website Collage Silhouette (Side & Bottom Aligned)
        </p>
        <div className="grid grid-cols-3 gap-2 w-full h-[260px] sm:h-[320px]">
          {/* Col 1 */}
          <div className="flex flex-col gap-2 h-full min-h-0">
            <div className="relative w-full flex-[0.38] min-h-0 overflow-hidden rounded-[2px] bg-neutral-800">
              {slots[0].url ? <img src={formatImageUrl(slots[0].url)} alt={formatImageCaption(slots[0].caption) || "Slot 1"} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[9px] text-neutral-500">Slot 1</div>}
              {formatImageCaption(slots[0].caption) && (
                <span className="absolute left-1.5 top-1.5 max-w-[85%] truncate bg-black/85 px-1.5 py-0.5 text-[7px] uppercase tracking-wider text-white">{formatImageCaption(slots[0].caption)}</span>
              )}
            </div>
            <div className="relative w-full flex-[0.62] min-h-0 overflow-hidden rounded-[2px] bg-neutral-800">
              {slots[1].url ? <img src={formatImageUrl(slots[1].url)} alt={formatImageCaption(slots[1].caption) || "Slot 2"} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[9px] text-neutral-500">Slot 2</div>}
              {formatImageCaption(slots[1].caption) && (
                <span className="absolute bottom-1.5 left-1.5 max-w-[85%] truncate bg-black/85 px-1.5 py-0.5 text-[7px] uppercase tracking-wider text-white">{formatImageCaption(slots[1].caption)}</span>
              )}
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-2 h-full min-h-0">
            <div className="relative w-full flex-[0.45] min-h-0 overflow-hidden rounded-[2px] bg-neutral-800">
              {slots[2].url ? <img src={formatImageUrl(slots[2].url)} alt={formatImageCaption(slots[2].caption) || "Slot 3"} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[9px] text-neutral-500">Slot 3</div>}
              {formatImageCaption(slots[2].caption) && (
                <span className="absolute left-1.5 top-1.5 max-w-[85%] truncate bg-black/85 px-1.5 py-0.5 text-[7px] uppercase tracking-wider text-white">{formatImageCaption(slots[2].caption)}</span>
              )}
            </div>
            <div className="relative w-full flex-[0.55] min-h-0 overflow-hidden rounded-[2px] bg-neutral-800">
              {slots[3].url ? <img src={formatImageUrl(slots[3].url)} alt={formatImageCaption(slots[3].caption) || "Slot 4"} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[9px] text-neutral-500">Slot 4</div>}
              {formatImageCaption(slots[3].caption) && (
                <span className="absolute bottom-1.5 left-1.5 max-w-[85%] truncate bg-black/85 px-1.5 py-0.5 text-[7px] uppercase tracking-wider text-white">{formatImageCaption(slots[3].caption)}</span>
              )}
            </div>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-2 h-full min-h-0">
            <div className="relative w-full flex-[0.65] min-h-0 overflow-hidden rounded-[2px] bg-neutral-800">
              {slots[4].url ? <img src={formatImageUrl(slots[4].url)} alt={formatImageCaption(slots[4].caption) || "Slot 5"} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[9px] text-neutral-500">Slot 5</div>}
              {formatImageCaption(slots[4].caption) && (
                <span className="absolute left-1.5 top-1.5 max-w-[85%] truncate bg-black/85 px-1.5 py-0.5 text-[7px] uppercase tracking-wider text-white">{formatImageCaption(slots[4].caption)}</span>
              )}
            </div>
            <div className="relative w-full flex-[0.35] min-h-0 overflow-hidden rounded-[2px] bg-neutral-800">
              {slots[5].url ? <img src={formatImageUrl(slots[5].url)} alt={formatImageCaption(slots[5].caption) || "Slot 6"} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[9px] text-neutral-500">Slot 6</div>}
              {formatImageCaption(slots[5].caption) && (
                <span className="absolute bottom-1.5 left-1.5 max-w-[85%] truncate bg-black/85 px-1.5 py-0.5 text-[7px] uppercase tracking-wider text-white">{formatImageCaption(slots[5].caption)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-[8px] border border-black/10 bg-[#f4f3ef] p-3 sm:p-4">
        {/* Column 1 */}
        <div className="flex flex-col gap-3">
          <ProjectCollageAdminSlot
            slotNumber={1}
            slotTitle="Top Landscape (38% H)"
            aspectClass="aspect-[16/9]"
            badgePosition="top"
            item={slots[0]}
            onChange={(updated) => updateSlot(0, updated)}
          />
          <ProjectCollageAdminSlot
            slotNumber={2}
            slotTitle="Bottom Tall (62% H)"
            aspectClass="aspect-[3/4]"
            badgePosition="bottom"
            item={slots[1]}
            onChange={(updated) => updateSlot(1, updated)}
          />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-3">
          <ProjectCollageAdminSlot
            slotNumber={3}
            slotTitle="Top Square (45% H)"
            aspectClass="aspect-[1/1]"
            badgePosition="top"
            item={slots[2]}
            onChange={(updated) => updateSlot(2, updated)}
          />
          <ProjectCollageAdminSlot
            slotNumber={4}
            slotTitle="Bottom Tall (55% H)"
            aspectClass="aspect-[3/4]"
            badgePosition="bottom"
            item={slots[3]}
            onChange={(updated) => updateSlot(3, updated)}
          />
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-3">
          <ProjectCollageAdminSlot
            slotNumber={5}
            slotTitle="Top Spire (65% H)"
            aspectClass="aspect-[2/3]"
            badgePosition="top"
            item={slots[4]}
            onChange={(updated) => updateSlot(4, updated)}
          />
          <ProjectCollageAdminSlot
            slotNumber={6}
            slotTitle="Bottom Landscape (35% H)"
            aspectClass="aspect-[4/3]"
            badgePosition="bottom"
            item={slots[5]}
            onChange={(updated) => updateSlot(5, updated)}
          />
        </div>
      </div>
    </div>
  );
}

function AdminExtendedGallery({
  gallery,
  onChange,
}: {
  gallery?: { url: string; caption?: string }[];
  onChange: (gallery: { url: string; caption?: string }[]) => void;
}) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");

  const additionalImages = useMemo(() => {
    return (gallery || []).slice(6);
  }, [gallery]);

  const updateAdditionalImage = (index: number, updated: { url: string; caption?: string }) => {
    const full = [...(gallery || [])];
    while (full.length < 6) full.push({ url: "", caption: "" });
    full[6 + index] = {
      ...updated,
      url: formatImageUrl(updated.url),
    };
    onChange(full);
  };

  const addImage = () => {
    const full = [...(gallery || [])];
    while (full.length < 6) full.push({ url: "", caption: "" });
    full.push({
      url: "",
      caption: "",
    });
    onChange(full);
  };

  const removeImage = (index: number) => {
    const full = [...(gallery || [])];
    full.splice(6 + index, 1);
    onChange(full);
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const full = [...(gallery || [])];
    const targetIdx = 6 + index + direction;
    if (targetIdx < 6 || targetIdx >= full.length) return;
    const temp = full[6 + index];
    full[6 + index] = full[targetIdx];
    full[targetIdx] = temp;
    onChange(full);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setUploadError("");
    if (!supabase) {
      setUploadError("Supabase is not configured.");
      return;
    }
    setUploadingIndex(index);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const objectPath = `images/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("site-media").upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("site-media").getPublicUrl(objectPath);
      updateAdditionalImage(index, { ...additionalImages[index], url: data.publicUrl });
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingIndex(null);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-black/10 pb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            Additional Views & Extended Gallery (Images 7+)
          </p>
          <p className="text-xs text-neutral-500">
            Photographs added here appear in the &ldquo;Additional Views&rdquo; section and in the full-screen photo lightbox on the project page. Supports Google Drive links & uploads.
          </p>
        </div>
        <button
          type="button"
          onClick={addImage}
          className="inline-flex h-8 items-center gap-1.5 self-start sm:self-auto rounded-[4px] bg-[#171717] px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-white transition hover:bg-neutral-700 cursor-pointer shrink-0 shadow-2xs"
        >
          <Plus className="h-3.5 w-3.5" /> Add Photograph
        </button>
      </div>

      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}

      {additionalImages.length === 0 ? (
        <div className="rounded-[6px] border border-dashed border-black/15 bg-[#faf9f6] p-6 text-center">
          <FileImage className="mx-auto h-7 w-7 text-neutral-300 mb-2" />
          <p className="text-xs font-medium text-neutral-700">No additional gallery photos yet</p>
          <p className="text-[11px] text-neutral-500 mt-1 max-w-sm mx-auto">
            The first 6 photos form the core architectural feature collage. Any extra photos you add here will display in the Additional Views grid.
          </p>
          <button
            type="button"
            onClick={addImage}
            className="mt-3 inline-flex items-center gap-1 rounded-[3px] border border-black/15 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-black hover:border-black cursor-pointer shadow-2xs"
          >
            <Plus className="h-3 w-3" /> Add Image
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {additionalImages.map((img, idx) => (
            <div key={idx} className="flex flex-col gap-2 rounded-[6px] border border-black/10 bg-white p-3 shadow-2xs">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                <span>Image {idx + 7}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(idx, -1)}
                    disabled={idx === 0}
                    title="Move earlier"
                    className="p-1 text-neutral-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 1)}
                    disabled={idx === additionalImages.length - 1}
                    title="Move later"
                    className="p-1 text-neutral-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    title="Delete image"
                    className="p-1 text-neutral-400 hover:text-red-600 transition cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[3px] bg-neutral-100 border border-black/10">
                {img.url ? (
                  <img src={formatImageUrl(img.url)} alt={formatImageCaption(img.caption) || `Image ${idx + 7}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-2 text-neutral-400">
                    <FileImage className="h-5 w-5 mb-1 text-neutral-300" />
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400">No Image</span>
                  </div>
                )}
                {uploadingIndex === idx && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] font-medium text-white">
                    Uploading...
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={img.url || ""}
                  onChange={(e) => updateAdditionalImage(idx, { ...img, url: e.target.value })}
                  placeholder="URL or Google Drive link..."
                  className="h-7 min-w-0 flex-1 rounded-[3px] border border-black/10 bg-white px-2 text-[11px] text-black outline-none focus:border-black placeholder:text-neutral-400"
                />
                <label className="inline-flex h-7 items-center justify-center rounded-[3px] border border-black/15 bg-neutral-50 px-2 text-[9px] font-medium uppercase tracking-wider text-neutral-700 hover:border-black cursor-pointer shrink-0">
                  <Upload className="h-3 w-3 mr-1" /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, idx)}
                    className="sr-only"
                  />
                </label>
              </div>

              <input
                type="text"
                value={img.caption || ""}
                onChange={(e) => updateAdditionalImage(idx, { ...img, caption: e.target.value })}
                placeholder="Caption (e.g. Courtyard details, spatial study)..."
                className="h-7 w-full rounded-[3px] border border-black/10 bg-white px-2 text-[10px] uppercase tracking-wide text-neutral-700 outline-none focus:border-black placeholder:text-neutral-400"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminCreditsEditor({
  credits,
  onChange,
}: {
  credits?: { role: string; people: string[] }[];
  onChange: (credits: { role: string; people: string[] }[]) => void;
}) {
  const list = credits && credits.length > 0 ? credits : [
    { role: "Lead Architect", people: ["Plane Architect"] },
    { role: "Design Director", people: ["Principal Architect"] },
    { role: "Structural Engineering", people: ["Delta Structural Engineering Atelier"] },
    { role: "Climate & Environmental Systems", people: ["Atelier Bioclimatic Systems"] },
  ];

  const updateRole = (index: number, newRole: string) => {
    const next = [...list];
    next[index] = { ...next[index], role: newRole };
    onChange(next);
  };

  const updatePeople = (index: number, peopleStr: string) => {
    const next = [...list];
    next[index] = {
      ...next[index],
      people: peopleStr.split(",").map((s) => s.trim()).filter(Boolean),
    };
    onChange(next);
  };

  const addCredit = () => {
    onChange([...list, { role: "Engineering / Consulting Partner", people: ["Consultant / Firm Name"] }]);
  };

  const removeCredit = (index: number) => {
    onChange(list.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Project Credits & Team Roles</p>
          <p className="text-xs text-neutral-500">Define roles and architects, engineers, or firms who designed the project.</p>
        </div>
        <button
          type="button"
          onClick={addCredit}
          className="inline-flex items-center gap-1 rounded-[3px] border border-black/15 bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-black hover:border-black cursor-pointer shadow-2xs"
        >
          <Plus className="h-3 w-3" /> Add Credit Role
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((credit, idx) => (
          <div key={idx} className="flex flex-col gap-2 rounded-[6px] border border-black/10 bg-white p-3 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                value={credit.role}
                onChange={(e) => updateRole(idx, e.target.value)}
                placeholder="Role (e.g. Lead Architect, Structural Engineer)"
                className="h-7 flex-1 rounded-[3px] border border-black/10 px-2 text-xs font-semibold text-black outline-none focus:border-black placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={() => removeCredit(idx)}
                title="Remove credit role"
                className="flex h-7 w-7 items-center justify-center rounded-[3px] text-neutral-400 hover:text-red-600 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={credit.people.join(", ")}
              onChange={(e) => updatePeople(idx, e.target.value)}
              placeholder="Names / Firms (comma-separated, e.g. Plane Architect, Jane Doe)"
              className="h-7 w-full rounded-[3px] border border-black/10 px-2 text-xs text-neutral-700 outline-none focus:border-black placeholder:text-neutral-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PublishStatus({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] ${published ? "text-[#426454]" : "text-neutral-500"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${published ? "bg-[#668b72]" : "bg-neutral-400"}`} />
      {published ? "Published" : "Draft"}
    </span>
  );
}

function CollectionRow({
  title,
  subtitle,
  published,
  selected,
  onClick,
  image,
}: {
  title: string;
  subtitle: string;
  published: boolean;
  selected: boolean;
  onClick: () => void;
  image?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex w-full items-center gap-3 px-4 py-3 text-left transition ${
        selected ? "bg-[#f2f1ed]" : "bg-white hover:bg-[#faf9f6]"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[3px] border ${
          selected
            ? "border-black bg-black text-white"
            : "border-black/10 bg-[#f8f7f4] text-neutral-500"
        }`}
      >
        {image ? (
          <img
            src={formatImageUrl(image)}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <FileImage className="h-4 w-4" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-[#171717]">
          {title || "Untitled"}
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-neutral-500">
          {subtitle}
        </span>
      </span>
      <span className="hidden sm:block">
        <PublishStatus published={published} />
      </span>
      <ChevronRight
        className={`h-4 w-4 shrink-0 transition ${
          selected ? "text-black" : "text-neutral-300 group-hover:text-neutral-600"
        }`}
      />
    </button>
  );
}

/* ──────── Start Project (CTA) Admin Section ──────── */
interface CTAStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

interface CTAFaq {
  question: string;
  answer: string;
}

function StartProjectAdmin() {
  const [steps, setSteps] = useState<CTAStep[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("admin_cta_steps");
      return saved ? JSON.parse(saved) : [
        { number: "01", title: "Project Scope & Vision", subtitle: "Tell us about your dream", description: "Every great building starts with a conversation." },
        { number: "02", title: "Budget & Investment", subtitle: "Financial planning from day one", description: "Transparent budgeting is central to our practice." },
        { number: "03", title: "Timeline & Milestones", subtitle: "When do you want to begin?", description: "Architecture has rhythm — from concept sketches to construction." },
        { number: "04", title: "Your Details", subtitle: "Let's get in touch", description: "Share your contact details and we will schedule an initial consultation." },
      ];
    } catch { return []; }
  });

  const [faqs, setFaqs] = useState<CTAFaq[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("admin_cta_faqs");
      return saved ? JSON.parse(saved) : [
        { question: "How long does the design phase typically take?", answer: "Design timelines vary by project scale. A residential project typically takes 3-5 months." },
        { question: "What is included in your architectural fee?", answer: "Our fee covers the complete design journey from concept to construction supervision." },
        { question: "Do you work outside Dhaka?", answer: "Yes. While our studio is based in Dhaka, we undertake projects across Bangladesh and internationally." },
        { question: "Can I make changes during the design process?", answer: "Absolutely. Our design process is iterative and collaborative." },
        { question: "What happens after the design is approved?", answer: "We prepare detailed construction tender documents and provide construction supervision." },
        { question: "Is the initial consultation free?", answer: "Yes. The first consultation is complimentary." },
      ];
    } catch { return []; }
  });

  const [editingStepIdx, setEditingStepIdx] = useState<number | null>(null);
  const [editingFaqIdx, setEditingFaqIdx] = useState<number | null>(null);

  useEffect(() => {
    try { localStorage.setItem("admin_cta_steps", JSON.stringify(steps)); } catch {}
  }, [steps]);

  useEffect(() => {
    try { localStorage.setItem("admin_cta_faqs", JSON.stringify(faqs)); } catch {}
  }, [faqs]);

  const updateStep = (idx: number, field: keyof CTAStep, value: string) => {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const addStep = () => {
    const num = String(steps.length + 1).padStart(2, "0");
    setSteps([...steps, { number: num, title: "New Step", subtitle: "", description: "" }]);
    setEditingStepIdx(steps.length);
  };

  const removeStep = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, number: String(i + 1).padStart(2, "0") })));
    setEditingStepIdx(null);
  };

  const updateFaq = (idx: number, field: keyof CTAFaq, value: string) => {
    setFaqs(prev => prev.map((f, i) => i === idx ? { ...f, [field]: value } : f));
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "New question?", answer: "Answer here." }]);
    setEditingFaqIdx(faqs.length);
  };

  const removeFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
    setEditingFaqIdx(null);
  };

  return (
    <div className="max-w-4xl space-y-7">
      {/* Header */}
      <section className="border-b border-black/10 pb-6">
        <p className={labelClass}>Onboarding flow</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">Start Project page</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
          Manage the 4-step client onboarding flow and FAQ items shown on the &ldquo;Start Project&rdquo; page.
        </p>
      </section>

      {/* Steps */}
      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
        <div className="border-b border-black/10 px-5 py-4 sm:px-7 flex items-center justify-between">
          <div>
            <p className={labelClass}>Project initiation</p>
            <h3 className="mt-1 font-display text-xl">Onboarding steps</h3>
          </div>
          <button type="button" onClick={addStep} className="inline-flex h-8 items-center gap-1.5 bg-[#171717] px-3 text-[10px] font-medium uppercase tracking-[0.13em] text-white transition hover:bg-neutral-700">
            <Plus className="h-3.5 w-3.5" /> Add step
          </button>
        </div>
        <div className="divide-y divide-black/5">
          {steps.map((step, idx) => (
            <div key={idx} className="p-5 sm:px-7">
              <button
                type="button"
                onClick={() => setEditingStepIdx(editingStepIdx === idx ? null : idx)}
                className="flex w-full items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center bg-neutral-100 text-xs font-semibold text-neutral-600">{step.number}</span>
                  <div>
                    <p className="text-sm font-medium text-[#171717]">{step.title}</p>
                    <p className="text-xs text-neutral-400">{step.subtitle}</p>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform duration-300 ${editingStepIdx === idx ? "rotate-180" : ""}`} />
              </button>
              {editingStepIdx === idx && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 animate-[fadeIn_300ms_ease]">
                  <AdminField label="Title" value={step.title} onChange={(v) => updateStep(idx, "title", v)} />
                  <AdminField label="Subtitle" value={step.subtitle} onChange={(v) => updateStep(idx, "subtitle", v)} />
                  <AdminField label="Description" value={step.description} onChange={(v) => updateStep(idx, "description", v)} rows={3} className="sm:col-span-2" />
                  <div className="sm:col-span-2 flex justify-end">
                    <button type="button" onClick={() => removeStep(idx)} className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 transition cursor-pointer">
                      <Trash2 className="h-3.5 w-3.5" /> Remove step
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {steps.length === 0 && (
            <div className="p-8 text-center text-sm text-neutral-400">No steps yet. Click &ldquo;Add step&rdquo; to create one.</div>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
        <div className="border-b border-black/10 px-5 py-4 sm:px-7 flex items-center justify-between">
          <div>
            <p className={labelClass}>Knowledge base</p>
            <h3 className="mt-1 font-display text-xl">Start Project FAQs</h3>
          </div>
          <button type="button" onClick={addFaq} className="inline-flex h-8 items-center gap-1.5 bg-[#171717] px-3 text-[10px] font-medium uppercase tracking-[0.13em] text-white transition hover:bg-neutral-700">
            <Plus className="h-3.5 w-3.5" /> Add FAQ
          </button>
        </div>
        <div className="divide-y divide-black/5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 sm:px-7">
              <button
                type="button"
                onClick={() => setEditingFaqIdx(editingFaqIdx === idx ? null : idx)}
                className="flex w-full items-center justify-between text-left cursor-pointer"
              >
                <p className="text-sm font-medium text-[#171717] pr-4">{faq.question}</p>
                <ChevronDown className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-300 ${editingFaqIdx === idx ? "rotate-180" : ""}`} />
              </button>
              {editingFaqIdx === idx && (
                <div className="mt-4 grid gap-4 animate-[fadeIn_300ms_ease]">
                  <AdminField label="Question" value={faq.question} onChange={(v) => updateFaq(idx, "question", v)} />
                  <AdminField label="Answer" value={faq.answer} onChange={(v) => updateFaq(idx, "answer", v)} rows={4} />
                  <div className="flex justify-end">
                    <button type="button" onClick={() => removeFaq(idx)} className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 transition cursor-pointer">
                      <Trash2 className="h-3.5 w-3.5" /> Remove FAQ
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {faqs.length === 0 && (
            <div className="p-8 text-center text-sm text-neutral-400">No FAQs yet. Click &ldquo;Add FAQ&rdquo; to create one.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function AdminPage() {
  const { settings, projects, newsItems, testimonials, refreshSettings } = useSiteContent();
  const [settingsDraft, setSettingsDraft] = useState(settings);
  const [projectDrafts, setProjectDrafts] = useState(projects);
  const [newsDrafts, setNewsDrafts] = useState(newsItems);
  const [testimonialDrafts, setTestimonialDrafts] = useState(testimonials);
  const [deletedContent, setDeletedContent] = useState<CmsDeletedContent>({ projects: [], news: [], testimonials: [] });
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? "");
  const [selectedNewsId, setSelectedNewsId] = useState(newsItems[0]?.id ?? "");
  const [selectedTestimonialId, setSelectedTestimonialId] = useState(testimonials[0]?.id ?? "");
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [collectionSearch, setCollectionSearch] = useState("");
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [selectedCategoryBranch, setSelectedCategoryBranch] = useState<ProjectTreeSelection | null>(null);
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<ProjectTreeSelection | null>(null);
  const [saveState, setSaveState] = useState("Ready");
  const [saveError, setSaveError] = useState("");
  const [contentLoaded, setContentLoaded] = useState(false);
  const [contentError, setContentError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const verifiedUserIdRef = useRef<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authSession, setAuthSession] = useState<{ user?: { id?: string } } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Version Control & Auto-save State
  const [commitMessage, setCommitMessage] = useState("");
  const [versionHistory, setVersionHistory] = useState<{
    id: string;
    timestamp: string;
    message: string;
    summary: string[];
    snapshot: {
      projects: Project[];
      settings: typeof settings;
      news: NewsItem[];
      testimonials: ProjectTestimonial[];
    };
  }[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [undoStack, setUndoStack] = useState<{
    projects: Project[];
    settings: typeof settings;
    news: NewsItem[];
    testimonials: ProjectTestimonial[];
  }[]>([]);
  const [redoStack, setRedoStack] = useState<{
    projects: Project[];
    settings: typeof settings;
    news: NewsItem[];
    testimonials: ProjectTestimonial[];
  }[]>([]);

  // Load version history and persistent drafts on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("plane_admin_version_history_v3");
      if (storedHistory) {
        setVersionHistory(JSON.parse(storedHistory));
      }
      const storedDrafts = localStorage.getItem("plane_admin_drafts_v3");
      if (storedDrafts) {
        const parsed = JSON.parse(storedDrafts);
        if (parsed.projects && parsed.projects.length > 0) {
          setProjectDrafts(parsed.projects);
          if (parsed.settings) setSettingsDraft(parsed.settings);
          if (parsed.news) setNewsDrafts(parsed.news);
          if (parsed.testimonials) setTestimonialDrafts(parsed.testimonials);
          if (parsed.selectedProjectId) setSelectedProjectId(parsed.selectedProjectId);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Auto-save every single input change to localStorage immediately
  useEffect(() => {
    if (!contentLoaded) return;
    try {
      localStorage.setItem("plane_admin_drafts_v3", JSON.stringify({
        projects: projectDrafts,
        settings: settingsDraft,
        news: newsDrafts,
        testimonials: testimonialDrafts,
        selectedProjectId,
      }));
    } catch {
      // ignore
    }
  }, [projectDrafts, settingsDraft, newsDrafts, testimonialDrafts, selectedProjectId, contentLoaded]);

  useEffect(() => {
    let ignore = false;

    const initAuth = async () => {
      if (!supabase) {
        if (!ignore) {
          setAuthReady(true);
          setIsAdmin(true);
        }
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!ignore) {
        setAuthSession(session);
        setAuthReady(true);
      }
    };

    void initAuth();

    const { data: { subscription } } = supabase
      ? supabase.auth.onAuthStateChange((_event, session) => {
          if (!ignore) {
            setAuthSession(session);
          }
        })
      : { data: { subscription: null } };

    return () => {
      ignore = true;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const verifyAdminAccess = async () => {
      if (!supabase) {
        setIsAdmin(true);
        return;
      }

      const currentUserId = authSession?.user?.id;
      if (!currentUserId) {
        setIsAdmin(false);
        verifiedUserIdRef.current = null;
        return;
      }

      // If this user was already verified as admin, NEVER set isAdmin(null) or reload on tab switches / focus!
      if (isAdmin === true && verifiedUserIdRef.current === currentUserId) {
        return;
      }

      if (isAdmin !== true) {
        setIsAdmin(null);
      }

      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", currentUserId)
        .maybeSingle();

      if (cancelled) return;

      const ok = !error && Boolean(data);
      if (ok) {
        verifiedUserIdRef.current = currentUserId;
      }
      setIsAdmin(ok);
    };

    void verifyAdminAccess();

    return () => {
      cancelled = true;
    };
  }, [authSession?.user?.id]);

  useEffect(() => {
    if (isAdmin !== true) return;
    if (contentLoaded && loadAttempt === 0) return;
    let cancelled = false;

    void getAdminCmsContent()
      .then((content) => {
        if (cancelled) return;
        // Check if user has active unsaved edits in localStorage
        const localDraftsRaw = typeof window !== "undefined" ? localStorage.getItem("plane_admin_drafts_v3") : null;
        if (localDraftsRaw) {
          try {
            const parsed = JSON.parse(localDraftsRaw);
            if (parsed.projects && parsed.projects.length > 0) {
              setProjectDrafts(parsed.projects);
              if (parsed.settings) setSettingsDraft(parsed.settings);
              if (parsed.news) setNewsDrafts(parsed.news);
              if (parsed.testimonials) setTestimonialDrafts(parsed.testimonials);
              if (parsed.selectedProjectId) setSelectedProjectId(parsed.selectedProjectId);
              setDeletedContent({ projects: [], news: [], testimonials: [] });
              setContentLoaded(true);
              return;
            }
          } catch {}
        }
        setSettingsDraft(content.settings);
        setProjectDrafts(content.projects);
        setNewsDrafts(content.news);
        setTestimonialDrafts(content.testimonials);
        setSelectedProjectId(content.projects[0]?.id ?? "");
        setSelectedNewsId(content.news[0]?.id ?? "");
        setSelectedTestimonialId(content.testimonials[0]?.id ?? "");
        setDeletedContent({ projects: [], news: [], testimonials: [] });
        setContentLoaded(true);
      })
      .catch((error: unknown) => {
        if (!cancelled) setContentError(error instanceof Error ? error.message : "Unable to load Supabase content.");
      })
      .finally(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [isAdmin, loadAttempt, contentLoaded]);

  const filteredProjects = useMemo(() => projectDrafts.filter((item) => {
    const matchesSearch = `${item.title} ${item.slug} ${item.category}`.toLowerCase().includes(collectionSearch.toLowerCase());
    if (!matchesSearch || !projectCategoryFilter || item.category !== projectCategoryFilter.categoryId) return matchesSearch && !projectCategoryFilter;
    const matchesSubcategory = projectCategoryFilter.subcategoryId === "all" ||
      item.subcategory.toLowerCase().includes(projectCategoryFilter.subcategoryId.toLowerCase()) ||
      item.typology.toLowerCase().includes(projectCategoryFilter.subcategoryId.toLowerCase());
    return matchesSubcategory;
  }), [projectDrafts, collectionSearch, projectCategoryFilter]);
  const selectedProject = useMemo(
    () => filteredProjects.find((project) => project.id === selectedProjectId) ?? filteredProjects[0],
    [filteredProjects, selectedProjectId],
  );
  const selectedNews = useMemo(
    () => newsDrafts.find((item) => item.id === selectedNewsId) ?? newsDrafts[0],
    [newsDrafts, selectedNewsId],
  );
  const selectedTestimonial = useMemo(
    () => testimonialDrafts.find((item) => item.id === selectedTestimonialId) ?? testimonialDrafts[0],
    [testimonialDrafts, selectedTestimonialId],
  );
  const filteredNews = useMemo(() => newsDrafts.filter((item) =>
    `${item.title} ${item.slug} ${item.category}`.toLowerCase().includes(collectionSearch.toLowerCase()),
  ), [newsDrafts, collectionSearch]);
  const filteredTestimonials = useMemo(() => testimonialDrafts.filter((item) =>
    `${item.author} ${item.role} ${item.quote}`.toLowerCase().includes(collectionSearch.toLowerCase()),
  ), [testimonialDrafts, collectionSearch]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");

    if (!supabase) {
      setLoginError("Supabase is not configured yet. Add the project URL and public anon key to the environment.");
      return;
    }

    setLoginLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });

    if (error) {
      setLoginError(error.message);
      setLoginLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setLoginError("No authenticated user was returned by Supabase.");
      setLoginLoading(false);
      return;
    }

    const { data: adminRow, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (adminError || !adminRow) {
      await supabase.auth.signOut();
      setLoginError("This account is not allowed in the admin dashboard. Add its user ID to public.admin_users.");
      setLoginLoading(false);
      return;
    }

    setAuthSession({ user: { id: userId } });
    setIsAdmin(true);
    setLoginLoading(false);
  };

  const pushToUndoStack = () => {
    setUndoStack((prev) => [
      ...prev.slice(-39),
      {
        projects: projectDrafts,
        settings: settingsDraft,
        news: newsDrafts,
        testimonials: testimonialDrafts,
      },
    ]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const current = {
      projects: projectDrafts,
      settings: settingsDraft,
      news: newsDrafts,
      testimonials: testimonialDrafts,
    };
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, current]);

    setProjectDrafts(previous.projects);
    setSettingsDraft(previous.settings);
    setNewsDrafts(previous.news);
    setTestimonialDrafts(previous.testimonials);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const current = {
      projects: projectDrafts,
      settings: settingsDraft,
      news: newsDrafts,
      testimonials: testimonialDrafts,
    };
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, current]);

    setProjectDrafts(next.projects);
    setSettingsDraft(next.settings);
    setNewsDrafts(next.news);
    setTestimonialDrafts(next.testimonials);
  };

  const revertToVersion = (version: (typeof versionHistory)[0]) => {
    pushToUndoStack();
    setProjectDrafts(version.snapshot.projects);
    setSettingsDraft(version.snapshot.settings);
    setNewsDrafts(version.snapshot.news);
    setTestimonialDrafts(version.snapshot.testimonials);
    setIsHistoryOpen(false);
    setSaveState(`Restored version: "${version.message}"`);
  };

  const discardDraft = () => {
    if (!confirm("Are you sure you want to discard unsaved local changes and reload from the server?")) return;
    try {
      localStorage.removeItem("plane_admin_drafts_v3");
    } catch {}
    setLoadAttempt((c) => c + 1);
    setUndoStack([]);
    setRedoStack([]);
    setSaveState("Local draft discarded");
  };

  const handleSave = async () => {
    if (!contentLoaded || saveState === "Saving...") return;
    setSaveError("");
    setSaveState("Saving...");
    try {
      await saveAdminCmsContent({
        settings: settingsDraft,
        projects: projectDrafts,
        news: newsDrafts,
        testimonials: testimonialDrafts,
      }, deletedContent);
      setDeletedContent({ projects: [], news: [], testimonials: [] });
      await refreshSettings();
      setSaveState("Saved to Supabase");

      const timestamp = new Date().toISOString();
      const message = commitMessage.trim() || `Update • ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      const summary: string[] = [];
      if (selectedProject) summary.push(`Saved "${selectedProject.title}"`);
      summary.push(`${projectDrafts.length} total projects in studio`);

      const newVersion = {
        id: `v-${Date.now()}`,
        timestamp,
        message,
        summary,
        snapshot: {
          projects: projectDrafts,
          settings: settingsDraft,
          news: newsDrafts,
          testimonials: testimonialDrafts,
        },
      };

      const nextHistory = [newVersion, ...versionHistory.slice(0, 29)];
      setVersionHistory(nextHistory);
      try {
        localStorage.setItem("plane_admin_version_history_v3", JSON.stringify(nextHistory));
      } catch {}
      setCommitMessage("");
    } catch (error) {
      setSaveState("Ready");
      setSaveError(error instanceof Error ? error.message : "Unable to save changes to Supabase.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void handleSave();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handleUndo, handleRedo]);

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    setAuthSession(null);
    setIsAdmin(false);
  };

  const openSection = (section: AdminSection) => {
    setActiveSection(section);
    setCollectionSearch("");
    if (section === "projects") setProjectCategoryFilter(null);
  };

  const toggleCategoryTree = (categoryId: string) => {
    setExpandedCategoryId((current) => current === categoryId ? null : categoryId);
    setSelectedCategoryBranch(null);
  };

  const showCategoryBranchProjects = (categoryId: string, subcategoryId: string) => {
    const branch = { categoryId, subcategoryId };
    const firstProject = projectDrafts.find((project) => project.category === categoryId && (
      subcategoryId === "all" || project.subcategory.toLowerCase().includes(subcategoryId.toLowerCase()) || project.typology.toLowerCase().includes(subcategoryId.toLowerCase())
    ));
    setSelectedCategoryBranch(branch);
    setProjectCategoryFilter(branch);
    setCollectionSearch("");
    setSelectedProjectId(firstProject?.id ?? "");
    setActiveSection("categories");
  };

  const editProjectFromCategory = (projectId: string, branch: ProjectTreeSelection) => {
    setProjectCategoryFilter(branch);
    setCollectionSearch("");
    setSelectedProjectId(projectId);
    setActiveSection("projects");
  };

  const addProject = () => {
    const firstAssignableSubcategory = projectCategoryFilter
      ? settingsDraft.categories.find((category) => category.id === projectCategoryFilter.categoryId)?.subcategories.find((subcategory) => subcategory.id !== "all")?.id ?? ""
      : "";
    const item = {
      ...emptyProject(),
      ...(projectCategoryFilter ? {
        category: projectCategoryFilter.categoryId,
        subcategory: projectCategoryFilter.subcategoryId === "all" ? firstAssignableSubcategory : projectCategoryFilter.subcategoryId,
      } : {}),
    };
    setProjectDrafts((current) => [...current, item]);
    setSelectedProjectId(item.id);
  };
  const addNews = () => {
    pushToUndoStack();
    const item = emptyNews();
    setNewsDrafts((current) => [item, ...current]);
    setSelectedNewsId(item.id);
  };
  const duplicateNews = (news: NewsItem) => {
    pushToUndoStack();
    const copy: NewsItem = {
      ...news,
      id: crypto.randomUUID(),
      slug: `${news.slug}-copy`,
      title: `${news.title} (Copy)`,
      date: new Date().toLocaleDateString("en", { month: "short", year: "numeric" }).toUpperCase(),
      sortOrder: newsDrafts.length,
      isPublished: false,
    };
    setNewsDrafts((current) => [copy, ...current]);
    setSelectedNewsId(copy.id);
  };
  const addTestimonial = () => {
    const item = emptyTestimonial();
    setTestimonialDrafts((current) => [...current, item]);
    setSelectedTestimonialId(item.id);
  };
  const addCategory = () => {
    if (settingsDraft.categories.length >= 5) return;
    setSettingsDraft((current) => {
      const id = uniqueSlug("new-category", current.categories.map((category) => category.id));
      return { ...current, categories: [...current.categories, { id, label: "New Category", subcategories: [] }] };
    });
  };
  const updateCategory = (categoryId: string, update: Partial<SiteCategory>) => {
    setSettingsDraft((current) => ({
      ...current,
      categories: current.categories.map((category) => category.id === categoryId ? { ...category, ...update } : category),
    }));
  };
  const removeCategory = (categoryId: string) => {
    if (settingsDraft.categories.length <= 1) return;
    if (projectDrafts.some((project) => project.category === categoryId)) return;
    setSettingsDraft((current) => ({ ...current, categories: current.categories.filter((category) => category.id !== categoryId) }));
  };
  const addSubcategory = (categoryId: string) => {
    setSettingsDraft((current) => ({
      ...current,
      categories: current.categories.map((category) => {
        if (category.id !== categoryId) return category;
        const id = uniqueSlug("new-subcategory", category.subcategories.map((subcategory) => subcategory.id));
        return { ...category, subcategories: [...category.subcategories, { id, label: "New Subcategory" }] };
      }),
    }));
  };
  const updateSubcategory = (categoryId: string, subcategoryId: string, update: { id?: string; label?: string }) => {
    setSettingsDraft((current) => ({
      ...current,
      categories: current.categories.map((category) => category.id !== categoryId ? category : {
        ...category,
        subcategories: category.subcategories.map((subcategory) => subcategory.id === subcategoryId ? { ...subcategory, ...update } : subcategory),
      }),
    }));
  };
  const removeSubcategory = (categoryId: string, subcategoryId: string) => {
    if (projectDrafts.some((project) => project.category === categoryId && project.subcategory === subcategoryId)) return;
    setSettingsDraft((current) => ({
      ...current,
      categories: current.categories.map((category) => category.id !== categoryId ? category : {
        ...category,
        subcategories: category.subcategories.filter((subcategory) => subcategory.id !== subcategoryId),
      }),
    }));
  };
  const selectProjectCategory = (categoryId: string) => {
    const firstSubcategory = settingsDraft.categories.find((category) => category.id === categoryId)?.subcategories.find((subcategory) => subcategory.id !== "all")?.id ?? "";
    updateProject("category", categoryId);
    updateProject("subcategory", firstSubcategory);
  };
  const deleteProject = () => {
    if (!selectedProject) return;
    pushToUndoStack();
    setDeletedContent((current) => ({ ...current, projects: [...current.projects, selectedProject.id] }));
    setProjectDrafts((current) => current.filter((item) => item.id !== selectedProject.id));
    setSelectedProjectId(projectDrafts.find((item) => item.id !== selectedProject.id)?.id ?? "");
  };
  const deleteNews = () => {
    if (!selectedNews) return;
    pushToUndoStack();
    setDeletedContent((current) => ({ ...current, news: [...current.news, selectedNews.id] }));
    setNewsDrafts((current) => current.filter((item) => item.id !== selectedNews.id));
    setSelectedNewsId(newsDrafts.find((item) => item.id !== selectedNews.id)?.id ?? "");
  };
  const deleteTestimonial = () => {
    if (!selectedTestimonial) return;
    pushToUndoStack();
    setDeletedContent((current) => ({ ...current, testimonials: [...current.testimonials, selectedTestimonial.id] }));
    setTestimonialDrafts((current) => current.filter((item) => item.id !== selectedTestimonial.id));
    setSelectedTestimonialId(testimonialDrafts.find((item) => item.id !== selectedTestimonial.id)?.id ?? "");
  };
  const duplicateTestimonial = (testimonial: ProjectTestimonial) => {
    pushToUndoStack();
    const copy: ProjectTestimonial = {
      ...testimonial,
      id: crypto.randomUUID(),
      author: `${testimonial.author} (Copy)`,
      createdAt: new Date().toISOString(),
      sortOrder: testimonialDrafts.length,
    };
    setTestimonialDrafts((current) => [...current, copy]);
    setSelectedTestimonialId(copy.id);
  };
  const updateProject = (field: keyof Project, value: unknown) => {
    if (!selectedProject) return;
    pushToUndoStack();
    if (field === "category" || field === "subcategory") setProjectCategoryFilter(null);
    setProjectDrafts((current) => current.map((item) => item.id === selectedProject.id ? { ...item, [field]: value } : item));
  };
  const updateNews = (field: keyof NewsItem, value: string | boolean | number | null) => {
    if (!selectedNews) return;
    pushToUndoStack();
    setNewsDrafts((current) => current.map((item) => item.id === selectedNews.id ? { ...item, [field]: value } : item));
  };
  const updateTestimonial = (id: string, field: keyof ProjectTestimonial, value: string | boolean | number | null) => {
    pushToUndoStack();
    setTestimonialDrafts((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  if (!authReady || (authSession?.user && isAdmin === null)) {
    return (
      <div className="admin-container flex min-h-screen items-center justify-center bg-[#f6f5f1] text-[#171717]">
        <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-neutral-500">
          <span className="h-4 w-4 animate-spin border border-black/20 border-t-black" />
          {authReady ? "Verifying administrator access" : "Loading admin access"}
        </p>
      </div>
    );
  }

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="admin-container flex min-h-screen items-center justify-center bg-[#f6f5f1] px-6 text-[#171717]">
        <div className="w-full max-w-lg border border-black/10 bg-white p-8">
          <p className={labelClass}>Supabase setup required</p>
          <h1 className="mt-3 font-display text-3xl">Connect the live project</h1>
          <p className="mt-4 text-sm leading-6 text-neutral-600">Add the Supabase project URL and public anon key to the environment to enable the live site and admin login.</p>
        </div>
      </div>
    );
  }

  if (!authSession?.user || isAdmin !== true) {
    return (
      <div className="admin-container grid min-h-screen bg-[#f6f5f1] text-[#171717] lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.82fr)]">
        <div className="relative hidden min-h-screen overflow-hidden bg-[#171717] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
          <div className="relative inline-flex w-fit items-center bg-white px-2 py-1"><PlaneLogo imageClassName="h-9 max-w-[170px]" /></div>
          <div className="relative max-w-xl pb-14"><p className="text-[10px] uppercase tracking-[0.24em] text-white/55">Studio content system</p><h1 className="mt-5 font-display text-5xl leading-[1.08]">A considered space for the work behind the spaces.</h1><p className="mt-6 max-w-md text-sm leading-7 text-white/65">Manage projects, studio news, client voices, and the details that shape the Plane Architect website.</p></div>
          <p className="relative text-[10px] uppercase tracking-[0.18em] text-white/40">Dhaka, Bangladesh · {new Date().getFullYear()}</p>
        </div>
        <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
          <div className="w-full max-w-[390px]">
            <div className="mb-12 lg:hidden"><PlaneLogo imageClassName="h-9 max-w-[160px]" /></div>
            <div className="mb-8 flex h-11 w-11 items-center justify-center border border-black/15 bg-white"><Lock className="h-4 w-4" strokeWidth={1.6} /></div>
            <p className={labelClass}>Administrator access</p>
            <h2 className="mt-2 font-display text-4xl">Welcome back.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">Sign in with the administrator account for this studio.</p>
            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <AdminField label="Email address" type="email" value={loginEmail} onChange={setLoginEmail} placeholder="you@studio.com" />
              <AdminField label="Password" type="password" value={loginPassword} onChange={setLoginPassword} placeholder="Enter your password" />
              {loginError && <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-3 py-2.5 text-sm text-red-700">{loginError}</p>}
              <button type="submit" disabled={loginLoading} className="flex w-full items-center justify-between bg-[#171717] px-4 py-3.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60">{loginLoading ? "Signing in..." : "Sign in to the studio"}<ArrowUpRight className="h-4 w-4" /></button>
            </form>
            <p className="mt-8 border-t border-black/10 pt-5 text-xs leading-5 text-neutral-500">Access is limited to users listed in this project&apos;s Supabase administrator table.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!contentLoaded && !contentError) {
    return (
      <div className="admin-container flex min-h-screen items-center justify-center bg-[#f6f5f1] text-[#171717]">
        <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-neutral-500">
          <span className="h-4 w-4 animate-spin border border-black/20 border-t-black" />
          Loading studio content
        </p>
      </div>
    );
  }

  if (contentError) {
    return (
      <div className="admin-container flex min-h-screen items-center justify-center bg-[#f6f5f1] px-5 text-[#171717]">
        <div className="w-full max-w-lg rounded-[8px] border border-black/10 bg-white p-7 sm:p-9">
          <p className={labelClass}>Content could not be loaded</p>
          <h1 className="mt-2 font-display text-3xl">Check your Supabase setup</h1>
          <p role="alert" className="mt-4 border-l-2 border-red-600 bg-red-50 px-3 py-2.5 text-sm text-red-700">{contentError}</p>
          <div className="mt-6 flex items-center gap-3">
            <button type="button" onClick={() => { setContentError(""); setLoadAttempt((attempt) => attempt + 1); }} className="bg-[#171717] px-4 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-white transition hover:bg-neutral-700">Try again</button>
            <button type="button" onClick={handleLogout} className="border border-black/15 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.14em] transition hover:border-black">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  const sectionTitle: Record<AdminSection, string> = {
    overview: "Overview",
    projects: "Projects",
    carousel: "Carousel",
    news: "Journal",
    testimonials: "Testimonials",
    categories: "Categories",
    cta: "Start Project",
    settings: "Site settings",
  };
  const publishedCount = [...projectDrafts, ...newsDrafts, ...testimonialDrafts].filter((item) => item.isPublished).length;

  return (
    <div className="admin-container min-h-screen bg-[#f6f5f1] text-[#171717]">
      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-black/10 bg-white lg:flex">
          <div className="flex h-[76px] items-center border-b border-black/10 px-5"><PlaneLogo imageClassName="h-9 max-w-[170px]" /></div>
          <p className="px-6 pb-2 pt-8 text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-400">Workspace</p>
          <nav aria-label="Admin sections" className="space-y-1 px-3">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button key={key} type="button" onClick={() => openSection(key)} aria-current={activeSection === key ? "page" : undefined} className={`flex w-full items-center gap-3 border-l-2 px-3.5 py-2.5 text-left text-sm transition ${activeSection === key ? "border-black bg-[#f4f3ef] font-medium text-black" : "border-transparent text-neutral-500 hover:bg-[#faf9f6] hover:text-black"}`}>
                <Icon className="h-4 w-4" strokeWidth={1.6} />{label}
                {key === "projects" && <span className="ml-auto text-[10px] text-neutral-400">{projectDrafts.length}</span>}
                {key === "carousel" && <span className="ml-auto text-[10px] text-neutral-400">{settingsDraft.carouselEnabled ? `${settingsDraft.featuredProjectSlugs.length}/5` : "Off"}</span>}
                {key === "news" && <span className="ml-auto text-[10px] text-neutral-400">{newsDrafts.length}</span>}
                {key === "testimonials" && <span className="ml-auto text-[10px] text-neutral-400">{testimonialDrafts.length}</span>}
                {key === "categories" && <span className="ml-auto text-[10px] text-neutral-400">{settingsDraft.categories.length}/5</span>}
              </button>
            ))}
          </nav>
          <div className="mt-auto border-t border-black/10 p-4"><div className="flex items-center gap-3 px-2 py-2"><span className="flex h-8 w-8 items-center justify-center bg-[#171717] text-white"><ShieldCheck className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">Administrator</span><span className="mt-0.5 block text-[10px] text-neutral-500">Secure session</span></span><button type="button" onClick={handleLogout} title="Sign out" aria-label="Sign out" className="flex h-8 w-8 items-center justify-center text-neutral-500 transition hover:bg-neutral-100 hover:text-black"><LogOut className="h-4 w-4" /></button></div></div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f6f5f1]/95 backdrop-blur">
            <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 sm:px-6 xl:px-8">
              {/* Left: Branding & Section Title */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="lg:hidden">
                  <PlaneLogo imageClassName="h-7 max-w-[110px]" />
                </div>
                <div className="min-w-0">
                  <p className="hidden text-[9px] uppercase tracking-[0.18em] text-neutral-400 sm:block">Plane Architect / Studio CMS</p>
                  <h1 className="mt-0.5 truncate font-display text-lg sm:text-xl">{sectionTitle[activeSection]}</h1>
                </div>
              </div>

              {/* Center / Version Control: Undo (just icon), Redo (just icon), Mini Commit Input, History */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  title="Undo (Ctrl+Z / Cmd+Z)"
                  aria-label="Undo"
                  className="flex h-8 w-8 items-center justify-center rounded-[3px] border border-black/15 bg-white text-neutral-700 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer shadow-2xs"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  title="Redo (Ctrl+Y / Cmd+Shift+Z)"
                  aria-label="Redo"
                  className="flex h-8 w-8 items-center justify-center rounded-[3px] border border-black/15 bg-white text-neutral-700 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer shadow-2xs"
                >
                  <Redo2 className="h-4 w-4" />
                </button>

                <div className="relative">
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void handleSave();
                    }}
                    placeholder="Commit note..."
                    className="h-8 w-28 sm:w-44 md:w-56 lg:w-72 rounded-[3px] border border-black/15 bg-white px-2.5 text-xs text-[#171717] outline-none transition placeholder:text-neutral-400 focus:border-black shadow-2xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(true)}
                  title="View version history timeline"
                  className="inline-flex h-8 items-center gap-1.5 rounded-[3px] border border-black/15 bg-white px-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-700 transition hover:border-black hover:text-black cursor-pointer shadow-2xs"
                >
                  <History className="h-3.5 w-3.5 text-blue-600" />
                  <span className="hidden md:inline">History</span>
                  <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[9px] font-semibold text-neutral-600">{versionHistory.length}</span>
                </button>
              </div>

              {/* Right: Site link & Save Button */}
              <div className="flex shrink-0 items-center gap-2">
                <Link href="/" className="hidden items-center gap-1.5 rounded-[3px] border border-black/15 bg-white px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] transition hover:border-black sm:inline-flex">
                  View site <ArrowUpRight className="h-3 w-3" />
                </Link>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!contentLoaded || saveState === "Saving..."}
                  className="inline-flex h-8 items-center gap-1.5 rounded-[3px] bg-[#171717] px-3.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-2xs"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{saveState === "Saving..." ? "Saving..." : "Save changes"}</span>
                  <span className="sm:hidden">Save</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out"
                  aria-label="Sign out"
                  className="flex h-8 w-8 items-center justify-center rounded-[3px] border border-black/15 bg-white text-neutral-600 transition hover:border-black hover:text-black lg:hidden"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto border-t border-black/8 px-3 py-2 no-scrollbar lg:hidden">
              {navItems.map(({ key, label, icon: Icon }) => <button key={key} type="button" onClick={() => openSection(key)} aria-current={activeSection === key ? "page" : undefined} className={`inline-flex shrink-0 items-center gap-2 border px-3 py-2 text-xs transition ${activeSection === key ? "border-black bg-black text-white" : "border-transparent text-neutral-500 hover:bg-white"}`}><Icon className="h-3.5 w-3.5" />{label}</button>)}
            </nav>
          </header>

          <AdminTaxonomyContext.Provider value={{
            enabled: activeSection === "projects",
            categories: settingsDraft.categories,
            category: selectedProject?.category ?? settingsDraft.categories[0]?.id ?? "",
            subcategory: selectedProject?.subcategory ?? "",
            onCategoryChange: selectProjectCategory,
            onSubcategoryChange: (value) => updateProject("subcategory", value),
          }}>
          <main className="mx-auto max-w-[1440px] px-4 pb-32 pt-7 sm:px-7 sm:pt-9 xl:px-10">
            {saveError && <p role="alert" className="mb-5 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">Supabase save failed: {saveError}</p>}
            {saveState !== "Ready" && <div role="status" className="mb-5 flex items-center gap-2 rounded-[8px] border-l-2 border-[#668b72] bg-white px-4 py-3 text-xs text-neutral-600"><Check className="h-4 w-4 text-[#426454]" />{saveState === "Saving..." ? "Saving changes to Supabase..." : "Changes saved to Supabase. Published content has been refreshed."}</div>}

            {activeSection === "overview" && <div className="space-y-10">
              <section className="grid gap-8 border-b border-black/10 pb-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-end"><div><p className={labelClass}>Studio content</p><h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">Good morning.<br className="hidden sm:block" /> What are we shaping today?</h2><p className="mt-4 max-w-xl text-sm leading-6 text-neutral-600">Choose a collection to update the projects, stories, and details on your website.</p></div><div className="border-l border-black/15 pl-5"><p className={labelClass}>Current workspace</p><p className="mt-2 text-sm font-medium">Plane Architect · Dhaka</p><p className="mt-1 text-xs text-neutral-500">{new Date().toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}</p></div></section>
              <section aria-label="Content summary" className="grid grid-cols-2 border-y border-black/10 md:grid-cols-4">
                {[
                  { label: "Projects", count: projectDrafts.length, key: "projects" as AdminSection },
                  { label: "Journal stories", count: newsDrafts.length, key: "news" as AdminSection },
                  { label: "Testimonials", count: testimonialDrafts.length, key: "testimonials" as AdminSection },
                  { label: "Published items", count: publishedCount, key: "overview" as AdminSection },
                ].map((item, index) => (
                  <button key={item.label} type="button" aria-label={`Open ${item.label}, ${item.count} items`} onClick={() => openSection(item.key)} className={`group relative py-5 text-left transition hover:bg-white ${index % 2 ? "pl-4 md:pl-6" : ""} ${index < 2 ? "border-b border-black/10 md:border-b-0" : ""} ${index > 0 ? "md:border-l md:border-black/10 md:pl-6" : ""}`}>
                    <span className="block text-[9px] uppercase tracking-[0.16em] text-neutral-500">{item.label}</span>
                    <span className="mt-2 block font-display text-3xl">{item.count}</span>
                    <ArrowUpRight className="absolute right-3 top-4 h-4 w-4 text-neutral-400 transition group-hover:text-black md:right-4" aria-hidden="true" />
                  </button>
                ))}
              </section>
              <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
                <div>
                  <div className="mb-4 border-b border-black/10 pb-3"><p className={labelClass}>Quick access</p><h3 className="mt-1.5 font-display text-2xl">Your collections</h3></div>
                  {navItems.slice(1).map(({ key, label, icon: Icon }) => {
                    const count = key === "projects" ? projectDrafts.length
                      : key === "carousel" ? (settingsDraft.carouselEnabled ? `${settingsDraft.featuredProjectSlugs.length}/5` : "Disabled")
                      : key === "news" ? newsDrafts.length
                      : key === "testimonials" ? testimonialDrafts.length
                      : key === "categories" ? settingsDraft.categories.length
                      : null;
                    const description = key === "projects" ? "Portfolio entries and project imagery"
                      : key === "carousel" ? "Homepage 5-slide showcase & on/off toggle"
                      : key === "news" ? "Studio news and journal stories"
                      : key === "testimonials" ? "Client voices and project references"
                      : key === "categories" ? "Navbar categories and project submenus"
                      : "Studio details and profile options";
                    return (
                      <button key={key} type="button" aria-label={`Open ${label}`} onClick={() => openSection(key)} className="group flex w-full items-center gap-4 py-4 text-left transition hover:bg-white">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-black/10 bg-white text-neutral-600"><Icon className="h-4 w-4" strokeWidth={1.6} /></span>
                        <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{label}</span><span className="mt-1 block text-xs text-neutral-500">{description}</span></span>
                        {count !== null && <span className="text-sm tabular-nums text-neutral-500">{count}</span>}
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-400 transition group-hover:text-black" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-black/10 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <p className={labelClass}>Publishing</p>
                  <h3 className="mt-2 font-display text-2xl">Changes go to Supabase</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">Save to update the live content source. Published projects and stories appear on the website; drafts stay hidden.</p>
                  <div className="mt-5 flex items-start gap-3 rounded-[8px] border border-black/10 bg-white p-4"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" /><p className="text-xs leading-5 text-neutral-600">The public site refreshes its content after each successful save.</p></div>
                </div>
              </section>
            </div>}

            {activeSection === "projects" && projectCategoryFilter && <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[8px] border border-black/10 bg-white px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] uppercase tracking-[0.14em] text-neutral-500">Filtered project branch</span>
                <span className="mt-1 block truncate text-sm font-medium">{settingsDraft.categories.find((category) => category.id === projectCategoryFilter.categoryId)?.label} / {settingsDraft.categories.find((category) => category.id === projectCategoryFilter.categoryId)?.subcategories.find((subcategory) => subcategory.id === projectCategoryFilter.subcategoryId)?.label}</span>
              </span>
              <span className="text-xs text-neutral-500">{filteredProjects.length} projects</span>
              <button type="button" onClick={() => { setProjectCategoryFilter(null); setSelectedProjectId(projectDrafts[0]?.id ?? ""); }} className="rounded-[4px] border border-black/15 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.1em] transition hover:border-black">All projects</button>
            </div>}

            {(activeSection === "projects" || activeSection === "news" || activeSection === "testimonials") && <div>
              <section className="mb-7 flex flex-col justify-between gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-end"><div><p className={labelClass}>{activeSection === "projects" ? "Portfolio" : activeSection === "news" ? "Studio journal" : "Client voices"}</p><h2 className="mt-2 font-display text-3xl sm:text-4xl">{activeSection === "projects" ? "Project library" : activeSection === "news" ? "Journal entries" : "Testimonials"}</h2><p className="mt-2 text-sm text-neutral-500">{activeSection === "projects" ? `${projectDrafts.length} projects in your portfolio` : activeSection === "news" ? `${newsDrafts.length} stories in your journal` : `${testimonialDrafts.length} client testimonials`}</p></div><button type="button" onClick={activeSection === "projects" ? addProject : activeSection === "news" ? addNews : addTestimonial} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 bg-[#171717] px-4 text-[10px] font-medium uppercase tracking-[0.13em] text-white transition hover:bg-neutral-700"><Plus className="h-4 w-4" />Create {activeSection === "projects" ? "project" : activeSection === "news" ? "story" : "testimonial"}</button></section>
              <div className="grid min-w-0 gap-7 xl:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="min-w-0 overflow-hidden rounded-[8px] border border-black/10 bg-white">
                  <div className="border-b border-black/10 p-3">
                    <label className="flex h-10 items-center gap-2 border border-black/10 px-3 text-neutral-400">
                      <Search className="h-4 w-4 shrink-0" />
                      <input
                        value={collectionSearch}
                        onChange={(event) => setCollectionSearch(event.target.value)}
                        placeholder={`Search ${activeSection}...`}
                        className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-neutral-400"
                        aria-label={`Search ${activeSection}`}
                      />
                    </label>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto">
                    {activeSection === "projects" && filteredProjects.map((item) => (
                      <CollectionRow
                        key={item.id}
                        title={item.title}
                        subtitle={`${item.category} · ${item.year}`}
                        published={item.isPublished ?? true}
                        selected={selectedProject?.id === item.id}
                        onClick={() => setSelectedProjectId(item.id)}
                        image={item.heroImage}
                      />
                    ))}
                    {activeSection === "news" && filteredNews.map((item) => (
                      <CollectionRow
                        key={item.id}
                        title={item.title}
                        subtitle={`${item.category} · ${item.date}`}
                        published={item.isPublished ?? true}
                        selected={selectedNews?.id === item.id}
                        onClick={() => setSelectedNewsId(item.id)}
                        image={item.image}
                      />
                    ))}
                    {activeSection === "testimonials" && filteredTestimonials.map((item) => {
                      const linkedProject = projectDrafts.find((p) => p.slug === item.projectSlug);
                      return (
                        <CollectionRow
                          key={item.id}
                          title={item.author}
                          subtitle={item.role ? `${item.role}${linkedProject ? ` · ${linkedProject.title}` : ""}` : (linkedProject ? linkedProject.title : "Client testimonial")}
                          published={item.isPublished}
                          selected={selectedTestimonial?.id === item.id}
                          onClick={() => setSelectedTestimonialId(item.id)}
                          image={item.image}
                        />
                      );
                    })}
                    {((activeSection === "projects" && filteredProjects.length === 0) || (activeSection === "news" && filteredNews.length === 0) || (activeSection === "testimonials" && filteredTestimonials.length === 0)) && (
                      <p className="px-4 py-8 text-center text-sm text-neutral-500">No matching content found.</p>
                    )}
                  </div>
                </aside>

                <section className="min-w-0 overflow-hidden rounded-[8px] border border-black/10 bg-white">
                  {activeSection === "projects" && selectedProject && <>
                    <div className="flex flex-col gap-3 border-b border-black/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="min-w-0"><p className={labelClass}>Project details</p><h3 className="mt-1 truncate font-display text-2xl">{selectedProject.title}</h3></div><div className="flex items-center gap-4"><PublishStatus published={selectedProject.isPublished ?? true} /><button type="button" onClick={deleteProject} title="Delete project" aria-label="Delete project" className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-red-200 text-red-600 transition hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></div>
                    <div className="space-y-7 p-5 sm:p-7">
                      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
                        <div className="grid content-start gap-4 sm:grid-cols-2">
                          <AdminField label="Project title" value={selectedProject.title} onChange={(value) => updateProject("title", value)} />
                          <AdminField label="URL slug" value={selectedProject.slug} onChange={(value) => updateProject("slug", value)} />
                          <AdminField label="Location" value={selectedProject.location} onChange={(value) => updateProject("location", value)} />
                          <AdminField label="Year" value={selectedProject.year} onChange={(value) => updateProject("year", value)} />
                          <AdminField label="Client" value={selectedProject.client} onChange={(value) => updateProject("client", value)} />
                          <AdminField label="Category" value={selectedProject.category} onChange={(value) => updateProject("category", value)} />
                          <AdminField label="Subcategory" value={selectedProject.subcategory} onChange={(value) => updateProject("subcategory", value)} />
                          <AdminField label="Typology" value={selectedProject.typology} onChange={(value) => updateProject("typology", value)} />
                          <AdminField label="Area (m²)" value={selectedProject.sizeM2} onChange={(value) => updateProject("sizeM2", value)} />
                          <AdminField label="Area (ft²)" value={selectedProject.sizeFt2 ?? ""} onChange={(value) => updateProject("sizeFt2", value)} />
                          <label className={labelClass}>Status
                            <select value={selectedProject.status} onChange={(event) => updateProject("status", event.target.value)} className={inputClass}>
                              <option>Completed</option>
                              <option>In Progress</option>
                              <option>Competition Win</option>
                              <option>Concept</option>
                            </select>
                          </label>
                          <AdminField label="Sort order" type="number" value={String(selectedProject.sortOrder ?? 0)} onChange={(value) => updateProject("sortOrder", Number(value))} />
                        </div>
                        <div>
                          <p className={labelClass}>Header Cover Media</p>
                          <div className="mt-1.5 aspect-[4/3] overflow-hidden border border-black/10 bg-[#f5f4f1]">
                            {selectedProject.heroImage ? (
                              <img src={selectedProject.heroImage} alt={`Cover preview for ${selectedProject.title}`} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-neutral-400">
                                <FileImage className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="mt-4">
                            <SupabaseMediaField label="Header image / video URL" value={selectedProject.heroImage} onChange={(value) => updateProject("heroImage", value)} />
                          </div>
                          <label className={`${labelClass} mt-4`}>Media type
                            <select value={selectedProject.heroMediaType ?? "image"} onChange={(event) => updateProject("heroMediaType", event.target.value)} className={inputClass}>
                              <option value="image">Image</option>
                              <option value="video">Video</option>
                            </select>
                          </label>
                          <label className="mt-4 flex cursor-pointer items-center gap-3 border-t border-black/10 pt-4 text-sm text-neutral-700">
                            <input type="checkbox" checked={selectedProject.isPublished ?? true} onChange={(event) => updateProject("isPublished", event.target.checked)} className="h-4 w-4 accent-black" />
                            <span>
                              <span className="block text-xs font-medium">Publish project</span>
                              <span className="mt-0.5 block text-[10px] text-neutral-500">Show this on the public website</span>
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* 2. Project Overview & Architectural Specifications (Before Feature Images) */}
                      <div className="border-t border-black/10 pt-6">
                        <p className={`${labelClass} mb-4`}>Project Overview & Architectural Specifications</p>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <AdminField
                            label="Project overview & summary"
                            value={selectedProject.description}
                            onChange={(value) => updateProject("description", value)}
                            rows={4}
                            className="sm:col-span-2"
                            placeholder="A flagship cultural landmark along Dhaka's riverfront..."
                          />
                          <AdminField
                            label="Materiality"
                            value={selectedProject.materials ?? ""}
                            onChange={(value) => updateProject("materials", value)}
                            placeholder="Hand-molded terracotta brick jali, exposed board-formed concrete..."
                          />
                          <AdminField
                            label="Climate Strategy"
                            value={selectedProject.climateStrategy ?? ""}
                            onChange={(value) => updateProject("climateStrategy", value)}
                            placeholder="Deep perimeter porticos, natural stack cross-ventilation..."
                          />
                          <AdminField
                            label="Structural System"
                            value={selectedProject.structuralSystem ?? ""}
                            onChange={(value) => updateProject("structuralSystem", value)}
                            placeholder="Post-tensioned concrete slabs, perimeter shear walls..."
                          />
                          <AdminField
                            label="Site Area"
                            value={selectedProject.siteArea ?? ""}
                            onChange={(value) => updateProject("siteArea", value)}
                            placeholder="Urban Waterfront Plot / 32,000 m²..."
                          />
                        </div>
                      </div>

                      {/* 3. Feature Images (6-Photo Collage Aligned Website UI) */}
                      <div className="border-t border-black/10 pt-6">
                        <AdminCollageGrid
                          gallery={selectedProject.gallery}
                          onChange={(newGallery) => updateProject("gallery", newGallery)}
                        />
                      </div>

                      {/* 4. Additional Views & Extended Gallery (Images 7+) */}
                      <div className="border-t border-black/10 pt-6">
                        <AdminExtendedGallery
                          gallery={selectedProject.gallery}
                          onChange={(newGallery) => updateProject("gallery", newGallery)}
                        />
                      </div>

                      {/* 5. Architectural Narrative, History & Design Concept */}
                      <div className="border-t border-black/10 pt-6">
                        <div className="mb-4">
                          <p className={labelClass}>Design Biography & Architectural Concept</p>
                          <p className="text-xs text-neutral-500">
                            In-depth architectural narrative covering site heritage, spatial form, tectonic craftsmanship, and ecological resilience.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <AdminField
                            label="Site Context & History"
                            value={selectedProject.historyContext ?? ""}
                            onChange={(value) => updateProject("historyContext", value)}
                            rows={4}
                            placeholder="How the project relates to regional heritage, topography, and urban context..."
                          />
                          <AdminField
                            label="Spatial Concept & Form"
                            value={selectedProject.designConcept ?? ""}
                            onChange={(value) => updateProject("designConcept", value)}
                            rows={4}
                            placeholder="Core architectural ideas, massing, daylight choreography, and volume hierarchy..."
                          />
                          <AdminField
                            label="Planning, Craft & Construction"
                            value={selectedProject.planningStory ?? ""}
                            onChange={(value) => updateProject("planningStory", value)}
                            rows={4}
                            placeholder="Tectonic assembly, collaboration with artisan craftsmen and structural engineers..."
                          />
                          <AdminField
                            label="Climate Strategy & Ecology"
                            value={selectedProject.sustainabilityStory ?? ""}
                            onChange={(value) => updateProject("sustainabilityStory", value)}
                            rows={4}
                            placeholder="Bioclimatic performance, stack ventilation, shading, water harvesting..."
                          />
                        </div>
                      </div>

                      {/* 5. Project Credits, Partners & Engineers */}
                      <div className="border-t border-black/10 pt-6 space-y-5">
                        <AdminCreditsEditor
                          credits={selectedProject.credits}
                          onChange={(newCredits) => updateProject("credits", newCredits)}
                        />

                        <div className="grid gap-4 sm:grid-cols-2 border-t border-black/5 pt-4">
                          <AdminField
                            label="Engineers & Consulting Partners"
                            value={(selectedProject.collaborators || []).join(", ")}
                            onChange={(value) =>
                              updateProject(
                                "collaborators",
                                value.split(",").map((s) => s.trim()).filter(Boolean)
                              )
                            }
                            placeholder="Bengal Structural Engineers, Atelier Bioclimatic, Studio Alluvial (comma-separated)"
                          />
                          <AdminField
                            label="Awards & Recognition"
                            value={(selectedProject.awards || []).join(", ")}
                            onChange={(value) =>
                              updateProject(
                                "awards",
                                value.split(",").map((s) => s.trim()).filter(Boolean)
                              )
                            }
                            placeholder="Delta Architecture Citation 2025, WAF Finalist (comma-separated)"
                          />
                        </div>
                      </div>

                      {/* 6. Project Owner / Client Testimonial */}
                      <div className="border-t border-black/10 pt-6">
                        <div className="mb-4">
                          <p className={labelClass}>Project Owner / Client Testimonial</p>
                          <p className="text-xs text-neutral-500">
                            Rendered as a refined, focused architectural card at the bottom of the project page.
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <AdminField
                            label="Testimonial quote"
                            value={selectedProject.quote ?? ""}
                            onChange={(value) => updateProject("quote", value)}
                            rows={3}
                            className="sm:col-span-2"
                            placeholder="Architecture in the Bengal delta must breathe with water, light, and monsoon rhythm..."
                          />
                          <AdminField
                            label="Client / Quote author"
                            value={selectedProject.quoteAuthor ?? ""}
                            onChange={(value) => updateProject("quoteAuthor", value)}
                            placeholder="e.g. National Arts Trust / Principal Architect"
                          />
                          <AdminField
                            label="Author role or title"
                            value={selectedProject.quoteAuthorRole ?? ""}
                            onChange={(value) => updateProject("quoteAuthorRole", value)}
                            placeholder="e.g. Chairman, Board of Trustees"
                          />
                        </div>
                      </div>
                    </div>
                  </>}

                  {activeSection === "news" && selectedNews && (
                    <>
                      <div className="flex flex-col gap-3 border-b border-black/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                        <div className="min-w-0">
                          <p className={labelClass}>News article & journal dispatch</p>
                          <h3 className="mt-1 truncate font-display text-2xl">{selectedNews.title}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <PublishStatus published={selectedNews.isPublished ?? true} />
                          <Link
                            href={`/news/${selectedNews.slug}`}
                            target="_blank"
                            title="View article on live site"
                            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-black/15 bg-white px-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-700 transition hover:border-black hover:text-black cursor-pointer shadow-2xs"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Preview</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => duplicateNews(selectedNews)}
                            title="Duplicate story"
                            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-black/15 bg-white px-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-700 transition hover:border-black hover:text-black cursor-pointer shadow-2xs"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Duplicate</span>
                          </button>
                          <button
                            type="button"
                            onClick={deleteNews}
                            title="Delete story"
                            aria-label="Delete story"
                            className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-red-200 text-red-600 transition hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-7 p-5 sm:p-7">
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                          <div className="grid content-start gap-4 sm:grid-cols-2">
                            <AdminField
                              label="Article headline / title"
                              value={selectedNews.title}
                              onChange={(value) => {
                                updateNews("title", value);
                              }}
                              className="sm:col-span-2"
                              placeholder="e.g. Dhaka Contemporary Art Center Celebrates Grand Opening"
                            />
                            <AdminField
                              label="URL slug"
                              value={selectedNews.slug}
                              onChange={(value) => updateNews("slug", value)}
                              placeholder="e.g. dhaka-art-center-opening"
                            />
                            <AdminField
                              label="Publication date"
                              value={selectedNews.date}
                              onChange={(value) => updateNews("date", value)}
                              placeholder="e.g. MARCH 2026"
                            />
                            <AdminField
                              label="Author / Byline"
                              value={selectedNews.author ?? ""}
                              onChange={(value) => updateNews("author", value)}
                              placeholder="e.g. Plane Architect Studio"
                            />
                            <div>
                              <AdminField
                                label="Category"
                                value={selectedNews.category}
                                onChange={(value) => updateNews("category", value)}
                                placeholder="e.g. Architecture, Exhibitions, Awards..."
                              />
                              <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] text-neutral-500">
                                <span>Quick tags:</span>
                                {["Architecture", "Education", "Awards", "Publications", "Exhibitions", "Milestones", "Lectures"].map((cat) => (
                                  <button
                                    key={cat}
                                    type="button"
                                    onClick={() => updateNews("category", cat)}
                                    className={`px-1.5 py-0.5 rounded text-[10px] border transition cursor-pointer ${
                                      selectedNews.category === cat
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-neutral-600 border-neutral-200 hover:border-black"
                                    }`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <AdminField
                              label="Read time"
                              value={selectedNews.readTime}
                              onChange={(value) => updateNews("readTime", value)}
                              placeholder="e.g. 4 min read"
                            />
                            <AdminField
                              label="Display sort order"
                              type="number"
                              value={String(selectedNews.sortOrder ?? 0)}
                              onChange={(value) => updateNews("sortOrder", Number(value))}
                            />
                            <AdminField
                              label="Source / External publication URL"
                              value={selectedNews.sourceUrl ?? ""}
                              onChange={(value) => updateNews("sourceUrl", value)}
                              className="sm:col-span-2"
                              placeholder="https://... (optional external press link)"
                            />
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className={labelClass}>Cover image</p>
                              <div className="mt-1.5 aspect-[16/10] overflow-hidden border border-black/10 bg-[#f5f4f1]">
                                {selectedNews.image ? (
                                  <img
                                    src={selectedNews.image}
                                    alt={`Cover preview for ${selectedNews.title}`}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-neutral-400">
                                    <FileImage className="h-6 w-6" />
                                  </div>
                                )}
                              </div>
                              <div className="mt-3">
                                <SupabaseMediaField
                                  label="Cover image URL or Upload"
                                  value={selectedNews.image}
                                  onChange={(value) => updateNews("image", value)}
                                />
                              </div>
                            </div>

                            <label className="flex cursor-pointer items-center gap-3 rounded-[4px] border border-black/10 bg-[#faf9f6] p-3.5 text-sm text-neutral-700">
                              <input
                                type="checkbox"
                                checked={selectedNews.isPublished ?? true}
                                onChange={(event) => updateNews("isPublished", event.target.checked)}
                                className="h-4 w-4 accent-black cursor-pointer"
                              />
                              <span>
                                <span className="block text-xs font-medium">Publish story</span>
                                <span className="mt-0.5 block text-[10px] text-neutral-500">
                                  Visible on /news and dispatches
                                </span>
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="grid gap-6 border-t border-black/10 pt-6">
                          <AdminField
                            label="Lead introduction / Excerpt"
                            value={selectedNews.excerpt}
                            onChange={(value) => updateNews("excerpt", value)}
                            rows={3}
                            placeholder="A concise synopsis displayed on the news cards and article intro..."
                          />

                          <div>
                            <AdminField
                              label="Full article body"
                              value={selectedNews.body ?? ""}
                              onChange={(value) => updateNews("body", value)}
                              rows={12}
                              placeholder="Write the full story here. Separate paragraphs with an empty line (two returns) for clean editorial spacing..."
                            />
                            <p className="mt-1.5 text-[11px] text-neutral-500">
                              Tip: Separate paragraphs with an empty line (two Enters). Each block will format as an editorial paragraph on the article page.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeSection === "testimonials" && selectedTestimonial && (
                    <>
                      <div className="flex flex-col gap-3 border-b border-black/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                        <div className="min-w-0">
                          <p className={labelClass}>Client voice & testimonial</p>
                          <h3 className="mt-1 truncate font-display text-2xl">
                            {selectedTestimonial.author || "New testimonial"}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <PublishStatus published={selectedTestimonial.isPublished} />
                          <button
                            type="button"
                            onClick={() => duplicateTestimonial(selectedTestimonial)}
                            title="Duplicate testimonial"
                            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-black/15 bg-white px-2.5 text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-700 transition hover:border-black hover:text-black cursor-pointer shadow-2xs"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Duplicate</span>
                          </button>
                          <button
                            type="button"
                            onClick={deleteTestimonial}
                            title="Delete testimonial"
                            aria-label="Delete testimonial"
                            className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-red-200 text-red-600 transition hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-8 p-5 sm:p-7">
                        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
                          {/* Left Column: Form Fields */}
                          <div className="space-y-5">
                            <div className="grid content-start gap-4 sm:grid-cols-2">
                              <AdminField
                                label="Client name / author"
                                value={selectedTestimonial.author}
                                onChange={(value) => updateTestimonial(selectedTestimonial.id, "author", value)}
                                placeholder="e.g. Dr. Farhana Rahman"
                                className="sm:col-span-2"
                              />
                              <AdminField
                                label="Role / organization"
                                value={selectedTestimonial.role}
                                onChange={(value) => updateTestimonial(selectedTestimonial.id, "role", value)}
                                placeholder="e.g. Managing Director, Delta Ecological Foundation"
                                className="sm:col-span-2"
                              />
                              <label className={`${labelClass} sm:col-span-2`}>
                                Associated project
                                <select
                                  value={selectedTestimonial.projectSlug ?? ""}
                                  onChange={(event) => updateTestimonial(selectedTestimonial.id, "projectSlug", event.target.value || null)}
                                  className={inputClass}
                                >
                                  <option value="">General Studio (Not project-specific)</option>
                                  {projectDrafts.map((project) => (
                                    <option key={project.id} value={project.slug}>
                                      {project.title} ({project.category} · {project.year})
                                    </option>
                                  ))}
                                </select>
                              </label>

                              {/* Interactive 5-Star Rating Picker */}
                              <div className="sm:col-span-1">
                                <span className={labelClass}>Client rating</span>
                                <div className="mt-1.5 flex h-[42px] items-center gap-1.5 border border-black/15 bg-white px-3">
                                  {[1, 2, 3, 4, 5].map((starNum) => (
                                    <button
                                      key={starNum}
                                      type="button"
                                      onClick={() => updateTestimonial(selectedTestimonial.id, "rating", starNum)}
                                      className="p-1 transition hover:scale-110 cursor-pointer"
                                      title={`Rate ${starNum} star${starNum > 1 ? "s" : ""}`}
                                    >
                                      <Star
                                        className={`h-4 w-4 ${
                                          starNum <= selectedTestimonial.rating
                                            ? "fill-[#b18342] text-[#b18342]"
                                            : "text-neutral-300"
                                        }`}
                                      />
                                    </button>
                                  ))}
                                  <span className="ml-2 font-mono text-xs font-semibold text-neutral-600">
                                    {selectedTestimonial.rating} / 5
                                  </span>
                                </div>
                              </div>

                              <AdminField
                                label="Sort order"
                                type="number"
                                value={String(selectedTestimonial.sortOrder ?? 0)}
                                onChange={(value) => updateTestimonial(selectedTestimonial.id, "sortOrder", Number(value))}
                              />
                            </div>

                            <div>
                              <AdminField
                                label="Testimonial quote"
                                value={selectedTestimonial.quote}
                                onChange={(value) => updateTestimonial(selectedTestimonial.id, "quote", value)}
                                rows={5}
                                placeholder="Describe the client experience working with Plane Architect..."
                              />
                            </div>

                            <label className="flex cursor-pointer items-center gap-3 rounded-[6px] border border-black/10 bg-[#faf9f6] p-4 text-sm text-neutral-700">
                              <input
                                type="checkbox"
                                checked={selectedTestimonial.isPublished}
                                onChange={(event) => updateTestimonial(selectedTestimonial.id, "isPublished", event.target.checked)}
                                className="h-4 w-4 accent-black"
                              />
                              <span>
                                <span className="block text-xs font-medium text-black">Publish testimonial on website</span>
                                <span className="mt-0.5 block text-[10px] text-neutral-500">
                                  Display this client voice in the homepage testimonials slider and connected project references.
                                </span>
                              </span>
                            </label>
                          </div>

                          {/* Right Column: Portrait Photo & Live Website Card Preview */}
                          <div className="space-y-6">
                            <div className="rounded-[6px] border border-black/10 bg-white p-4">
                              <p className={labelClass}>Client portrait photo</p>
                              <div className="mt-3 flex items-center gap-4">
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-black/15 bg-neutral-100">
                                  {selectedTestimonial.image ? (
                                    <img
                                      src={formatImageUrl(selectedTestimonial.image)}
                                      alt={selectedTestimonial.author}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center font-display text-xl font-bold uppercase text-neutral-400">
                                      {selectedTestimonial.author ? selectedTestimonial.author.slice(0, 2) : "CL"}
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <SupabaseMediaField
                                    label="Image URL"
                                    value={selectedTestimonial.image ?? ""}
                                    onChange={(value) => updateTestimonial(selectedTestimonial.id, "image", value)}
                                  />
                                </div>
                              </div>
                              <p className="mt-2 text-[10px] leading-relaxed text-neutral-500">
                                Supports direct image URLs, Google Drive image links, or Supabase file uploads.
                              </p>
                            </div>

                            {/* Live Website Preview Card */}
                            <div className="rounded-[6px] border border-black/10 bg-[#faf9f6] p-4">
                              <div className="mb-2 flex items-center justify-between">
                                <p className={labelClass}>Live website card preview</p>
                                <span className="text-[10px] text-neutral-400">Homepage slider</span>
                              </div>
                              <div className="border border-neutral-200 bg-white p-4 shadow-2xs">
                                <div className="mb-2 flex gap-0.5">
                                  {Array.from({ length: 5 }, (_, idx) => (
                                    <Star
                                      key={idx}
                                      className={`h-3 w-3 ${
                                        idx < (selectedTestimonial.rating || 5)
                                          ? "fill-current text-[#b18342]"
                                          : "text-neutral-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <blockquote className="font-display text-xs leading-relaxed text-neutral-800 line-clamp-4">
                                  &ldquo;{selectedTestimonial.quote || "Add client testimonial statement..."}&rdquo;
                                </blockquote>
                                <div className="mt-3.5 flex items-center gap-2.5 border-t border-neutral-100 pt-2.5">
                                  {selectedTestimonial.image ? (
                                    <img
                                      src={formatImageUrl(selectedTestimonial.image)}
                                      alt=""
                                      className="h-7 w-7 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-semibold text-neutral-600">
                                      {selectedTestimonial.author ? selectedTestimonial.author.charAt(0) : "C"}
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-black">
                                      {selectedTestimonial.author || "Client Name"}
                                    </p>
                                    <p className="truncate text-[10px] text-neutral-400">
                                      {selectedTestimonial.role || "Client Role"}
                                    </p>
                                    <p className="truncate text-[9px] uppercase tracking-wider text-neutral-400">
                                      {projectDrafts.find((p) => p.slug === selectedTestimonial.projectSlug)?.title || "Plane Architect"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {((activeSection === "projects" && !selectedProject) || (activeSection === "news" && !selectedNews) || (activeSection === "testimonials" && !selectedTestimonial)) && <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center"><FileImage className="h-8 w-8 text-neutral-300" /><p className="mt-4 font-display text-xl">Nothing selected</p><p className="mt-2 text-sm text-neutral-500">Create an item or choose one from the collection list.</p></div>}
                </section>
              </div>
            </div>}

            {activeSection === "categories" && <div className="max-w-5xl">
              <section className="mb-7 flex flex-col justify-between gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-end">
                <div>
                  <p className={labelClass}>Website navigation</p>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl">Categories & subcategories</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">These categories appear in the website menu. Each subcategory filters published projects assigned to it.</p>
                </div>
                <button type="button" onClick={addCategory} disabled={settingsDraft.categories.length >= 5} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[8px] bg-[#171717] px-4 text-[10px] font-medium uppercase tracking-[0.13em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"><Plus className="h-4 w-4" />Add category</button>
              </section>
              <div className="mb-5 flex items-center justify-between text-xs text-neutral-500">
                <span>{settingsDraft.categories.length} of 5 categories</span>
                {settingsDraft.categories.length >= 5 && <span>Remove a category before adding another.</span>}
              </div>
              <div className="space-y-3">
                {settingsDraft.categories.map((category) => {
                  const categoryProjects = projectDrafts.filter((project) => project.category === category.id);
                  const isExpanded = expandedCategoryId === category.id;
                  const selectedSubcategory = selectedCategoryBranch?.categoryId === category.id
                    ? category.subcategories.find((subcategory) => subcategory.id === selectedCategoryBranch.subcategoryId)
                    : null;
                  const branchProjects = selectedCategoryBranch?.categoryId === category.id
                    ? categoryProjects.filter((project) => selectedCategoryBranch.subcategoryId === "all" ||
                      project.subcategory.toLowerCase().includes(selectedCategoryBranch.subcategoryId.toLowerCase()) ||
                      project.typology.toLowerCase().includes(selectedCategoryBranch.subcategoryId.toLowerCase()))
                    : [];

                  return (
                    <section key={category.id} className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
                      <div className="flex items-center gap-3 p-4 sm:px-5">
                        <button type="button" aria-expanded={isExpanded} onClick={() => toggleCategoryTree(category.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                          <ChevronDown className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{category.label}</span>
                            <span className="mt-1 block text-xs text-neutral-500">{category.subcategories.length} subcategories · {categoryProjects.filter((project) => project.isPublished ?? true).length} published projects</span>
                          </span>
                        </button>
                        <button type="button" onClick={() => removeCategory(category.id)} disabled={settingsDraft.categories.length <= 1 || categoryProjects.length > 0} title={categoryProjects.length ? "Reassign its projects before deleting this category" : settingsDraft.categories.length <= 1 ? "At least one category is required" : "Delete category"} aria-label={`Delete ${category.label} category`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-35"><Trash2 className="h-4 w-4" /></button>
                      </div>

                      {isExpanded && <div className="border-t border-black/10 px-4 py-4 sm:px-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                          <AdminField label="Category name" value={category.label} onChange={(value) => updateCategory(category.id, { label: value })} className="sm:max-w-sm" />
                          <button type="button" onClick={() => addSubcategory(category.id)} className="inline-flex h-9 shrink-0 items-center gap-2 self-end rounded-[4px] border border-black/15 px-3 text-[10px] font-medium uppercase tracking-[0.1em] transition hover:border-black"><Plus className="h-3.5 w-3.5" />Add subcategory</button>
                        </div>

                        <div className="mt-5 space-y-2">
                          {category.subcategories.map((subcategory) => {
                            const assignedProjects = projectDrafts.filter((project) => project.category === category.id && project.subcategory === subcategory.id);
                            const publishedProjects = projectDrafts.filter((project) => project.isPublished !== false && project.category === category.id && (
                              subcategory.id === "all" || project.subcategory.toLowerCase().includes(subcategory.id.toLowerCase()) || project.typology.toLowerCase().includes(subcategory.id.toLowerCase())
                            )).length;
                            const isSelected = selectedCategoryBranch?.categoryId === category.id && selectedCategoryBranch.subcategoryId === subcategory.id;

                            return (
                              <div key={subcategory.id} className={`flex items-center gap-3 px-2 py-1.5 ${isSelected ? "bg-[#f5f4f1]" : ""}`}>
                                <button type="button" aria-pressed={isSelected} onClick={() => showCategoryBranchProjects(category.id, subcategory.id)} className="flex min-w-0 flex-1 items-center gap-3 py-1 text-left">
                                  <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition ${isSelected ? "rotate-90 text-black" : "text-neutral-400"}`} />
                                  <span className="min-w-0 flex-1 truncate text-sm">{subcategory.label}</span>
                                  <span className="shrink-0 text-xs tabular-nums text-neutral-500">{publishedProjects}</span>
                                </button>
                                {subcategory.id !== "all" && <AdminField label="Name" value={subcategory.label} onChange={(value) => updateSubcategory(category.id, subcategory.id, { label: value })} className="w-36 shrink-0 sm:w-48" />}
                                <button type="button" onClick={() => removeSubcategory(category.id, subcategory.id)} disabled={subcategory.id === "all" || assignedProjects.length > 0} title={subcategory.id === "all" ? "The View all item is required" : assignedProjects.length ? "Reassign its projects before deleting this subcategory" : "Delete subcategory"} aria-label={`Delete ${subcategory.label} subcategory`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-35"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            );
                          })}
                          {!category.subcategories.length && <p className="py-2 text-sm text-neutral-500">No subcategories yet. Add one to make this menu category useful.</p>}
                        </div>

                        {selectedSubcategory && <div className="mt-5 border-t border-black/10 pt-5">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div><p className={labelClass}>{category.label} / {selectedSubcategory.label}</p><p className="mt-1 text-xs text-neutral-500">{branchProjects.length} {branchProjects.length === 1 ? "project" : "projects"} assigned</p></div>
                            <button type="button" onClick={() => { setSelectedCategoryBranch(null); }} className="text-[10px] uppercase tracking-[0.12em] text-neutral-500 transition hover:text-black">Clear selection</button>
                          </div>
                          {branchProjects.length ? <div className="space-y-2">
                            {branchProjects.map((project) => <div key={project.id} className="flex items-center gap-3 rounded-[8px] bg-[#f8f7f4] px-3 py-3 sm:px-4">
                              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{project.title}</span><span className="mt-1 block text-xs text-neutral-500">{project.year} · {project.location}</span></span>
                              <PublishStatus published={project.isPublished ?? true} />
                              <button type="button" onClick={() => editProjectFromCategory(project.id, { categoryId: category.id, subcategoryId: selectedSubcategory.id })} title={`Edit ${project.title}`} aria-label={`Edit ${project.title}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-black/15 bg-white text-neutral-600 transition hover:border-black hover:text-black"><ArrowUpRight className="h-4 w-4" /></button>
                            </div>)}
                          </div> : <p className="border-l-2 border-black/15 py-2 pl-3 text-sm text-neutral-500">No projects are assigned to this subcategory yet.</p>}
                        </div>}
                      </div>}
                    </section>
                  );
                })}
              </div>
            </div>}

            {activeSection === "carousel" && <div className="max-w-4xl space-y-7">
              <section className="border-b border-black/10 pb-6">
                <p className={labelClass}>Homepage showcase</p>
                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-3xl sm:text-4xl">Featured project carousel</h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                      Manage the 5 projects displayed on the homepage carousel. You can fill in the project details directly for each slot and reorder their sequence.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 self-start rounded-[8px] border border-black/10 bg-white px-4 py-3 sm:self-auto shadow-xs">
                    <span className="text-xs font-medium uppercase tracking-[0.1em] text-neutral-700">
                      {settingsDraft.carouselEnabled ? "Carousel Active" : "Carousel Off"}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={settingsDraft.carouselEnabled}
                      onClick={() => setSettingsDraft({ ...settingsDraft, carouselEnabled: !settingsDraft.carouselEnabled })}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${settingsDraft.carouselEnabled ? "bg-black" : "bg-neutral-300"}`}
                    >
                      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${settingsDraft.carouselEnabled ? "left-6" : "left-1"}`} />
                    </button>
                  </div>
                </div>
              </section>

              {!settingsDraft.carouselEnabled && (
                <div className="rounded-[8px] border border-amber-200 bg-amber-50/60 p-4 text-xs leading-5 text-amber-900">
                  <p className="font-medium">Carousel is currently turned OFF</p>
                  <p className="mt-1 text-amber-800">
                    The homepage directly displays all projects in random order with a filter icon (Random, Latest, Oldest).
                  </p>
                </div>
              )}

              <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
                <div className="flex flex-col gap-1 border-b border-black/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <div>
                    <p className={labelClass}>Carousel Sequence</p>
                    <h3 className="mt-1 font-display text-xl">5 Carousel Projects</h3>
                  </div>
                  <p className="text-xs text-neutral-500">
                    5 of 5 slots configured · Use arrows to change slide order
                  </p>
                </div>

                <div className="divide-y divide-black/10 p-5 sm:p-7">
                  {Array.from({ length: 5 }).map((_, slotIndex) => {
                    // Ensure the slot has a project slug assigned
                    let currentSlug = settingsDraft.featuredProjectSlugs[slotIndex];
                    let currentProject = projectDrafts.find((project) => project.slug === currentSlug);

                    if (!currentProject) {
                      // Fallback: pick any unused project or create a default slot project
                      const usedSlugs = new Set(settingsDraft.featuredProjectSlugs.filter(Boolean));
                      const candidate = projectDrafts.find((p) => !usedSlugs.has(p.slug)) || projectDrafts[slotIndex];
                      if (candidate) {
                        currentSlug = candidate.slug;
                        currentProject = candidate;
                      } else {
                        // Create a new project draft for this slot so fields are immediately editable
                        const newSlotProject: Project = {
                          ...emptyProject(),
                          slug: `carousel-project-${slotIndex + 1}`,
                          title: `Carousel Project 0${slotIndex + 1}`,
                          isPublished: true,
                        };
                        currentSlug = newSlotProject.slug;
                        currentProject = newSlotProject;
                      }
                    }

                    const moveSlot = (direction: -1 | 1) => {
                      const targetIndex = slotIndex + direction;
                      if (targetIndex < 0 || targetIndex >= 5) return;
                      const nextSlugs = [...settingsDraft.featuredProjectSlugs];
                      while (nextSlugs.length < 5) {
                        nextSlugs.push(projectDrafts[nextSlugs.length]?.slug || `carousel-project-${nextSlugs.length + 1}`);
                      }
                      const temp = nextSlugs[slotIndex];
                      nextSlugs[slotIndex] = nextSlugs[targetIndex];
                      nextSlugs[targetIndex] = temp;
                      setSettingsDraft({
                        ...settingsDraft,
                        featuredProjectSlugs: nextSlugs.slice(0, 5),
                      });
                    };

                    const updateSlotProjectField = (field: keyof Project, value: string | boolean | number) => {
                      if (!currentProject) return;
                      const targetId = currentProject.id;
                      const isExisting = projectDrafts.some((p) => p.id === targetId);

                      if (isExisting) {
                        setProjectDrafts((prev) =>
                          prev.map((item) => (item.id === targetId ? { ...item, [field]: value } : item))
                        );
                      } else {
                        const newProj = { ...currentProject, [field]: value };
                        setProjectDrafts((prev) => [...prev, newProj]);
                      }

                      // If slug changed, keep settingsDraft.featuredProjectSlugs in sync
                      if (field === "slug" && typeof value === "string") {
                        const nextSlugs = [...settingsDraft.featuredProjectSlugs];
                        nextSlugs[slotIndex] = value;
                        setSettingsDraft({ ...settingsDraft, featuredProjectSlugs: nextSlugs.slice(0, 5) });
                      }
                    };

                    return (
                      <div key={slotIndex} className={`py-6 first:pt-0 last:pb-0`}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 pb-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-[#171717] text-xs font-mono font-medium text-white">
                              0{slotIndex + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs uppercase tracking-[0.14em] font-medium text-neutral-500">
                                  Position {slotIndex + 1}
                                </span>
                                <span className="text-xs text-neutral-400">·</span>
                                <span className="text-sm font-medium text-black">
                                  {currentProject.title || `Project Slot 0${slotIndex + 1}`}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => moveSlot(-1)}
                              disabled={slotIndex === 0}
                              title="Move up in carousel order"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-black/15 bg-white text-neutral-700 transition hover:border-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSlot(1)}
                              disabled={slotIndex === 4}
                              title="Move down in carousel order"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-black/15 bg-white text-neutral-700 transition hover:border-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>

                            <select
                              value={currentProject.slug}
                              onChange={(e) => {
                                const selectedSlug = e.target.value;
                                if (!selectedSlug) return;
                                const nextSlugs = [...settingsDraft.featuredProjectSlugs];
                                while (nextSlugs.length < 5) nextSlugs.push("");
                                nextSlugs[slotIndex] = selectedSlug;
                                setSettingsDraft({
                                  ...settingsDraft,
                                  featuredProjectSlugs: nextSlugs.slice(0, 5),
                                });
                              }}
                              className="h-8 rounded-[4px] border border-black/15 bg-white px-2.5 text-xs text-black outline-none transition focus:border-black max-w-[200px]"
                            >
                              <option value={currentProject.slug}>Assign: {currentProject.title}</option>
                              {projectDrafts
                                .filter((p) => p.slug !== currentProject?.slug)
                                .map((p) => (
                                  <option key={p.id} value={p.slug}>
                                    Switch to: {p.title} ({p.year})
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        {/* Direct input fields for this carousel slot project */}
                        <div className="mt-5 grid gap-5 rounded-[6px] border border-black/10 bg-[#faf9f6] p-4 sm:p-5 lg:grid-cols-[180px_minmax(0,1fr)]">
                          <div>
                            <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] border border-black/10 bg-neutral-200">
                              {currentProject.heroImage ? (
                                <img
                                  src={currentProject.heroImage}
                                  alt={currentProject.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                                  No image set
                                </div>
                              )}
                            </div>
                            <div className="mt-3">
                              <SupabaseMediaField
                                label="Carousel hero image"
                                value={currentProject.heroImage}
                                onChange={(url) => updateSlotProjectField("heroImage", url)}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <AdminField
                                label="Project title"
                                value={currentProject.title}
                                onChange={(val) => updateSlotProjectField("title", val)}
                              />
                              <AdminField
                                label="Slug (URL identifier)"
                                value={currentProject.slug}
                                onChange={(val) => updateSlotProjectField("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}
                              />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                              <AdminField
                                label="Year"
                                value={currentProject.year}
                                onChange={(val) => updateSlotProjectField("year", val)}
                              />
                              <AdminField
                                label="Location"
                                value={currentProject.location}
                                onChange={(val) => updateSlotProjectField("location", val)}
                              />
                              <AdminField
                                label="Typology / Subcategory"
                                value={currentProject.typology || currentProject.subcategory || "Culture"}
                                onChange={(val) => {
                                  updateSlotProjectField("typology", val);
                                  updateSlotProjectField("subcategory", val.toLowerCase());
                                }}
                              />
                            </div>

                            <AdminField
                              label="Slide description"
                              value={currentProject.description}
                              rows={3}
                              onChange={(val) => updateSlotProjectField("description", val)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>}

            {activeSection === "settings" && <div className="max-w-4xl space-y-7">
              <section className="border-b border-black/10 pb-6">
                <p className={labelClass}>Studio profile</p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl">Studio details & settings</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                  Update your identity, studio logo upload, contact email, phone number, and address displayed across the website.
                </p>
              </section>

              <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
                <div className="border-b border-black/10 px-5 py-4 sm:px-7">
                  <p className={labelClass}>Identity & Contact</p>
                  <h3 className="mt-1 font-display text-xl">Studio information</h3>
                </div>
                <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                  <AdminField
                    label="Studio name"
                    value={settingsDraft.siteName}
                    onChange={(value) => setSettingsDraft({ ...settingsDraft, siteName: value })}
                  />
                  <AdminField
                    label="Tagline"
                    value={settingsDraft.tagline}
                    onChange={(value) => setSettingsDraft({ ...settingsDraft, tagline: value })}
                  />
                  <AdminField
                    label="Contact email"
                    type="email"
                    value={settingsDraft.email}
                    onChange={(value) => setSettingsDraft({ ...settingsDraft, email: value })}
                  />
                  <AdminField
                    label="Phone number"
                    value={settingsDraft.phone}
                    onChange={(value) => setSettingsDraft({ ...settingsDraft, phone: value })}
                  />
                  <AdminField
                    label="Studio address"
                    value={settingsDraft.address}
                    onChange={(value) => setSettingsDraft({ ...settingsDraft, address: value })}
                    className="sm:col-span-2"
                  />
                  <div className="sm:col-span-2">
                    <SupabaseMediaField
                      label="Studio logo"
                      value={settingsDraft.logoUrl}
                      onChange={(url) => setSettingsDraft({ ...settingsDraft, logoUrl: url })}
                    />
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
                <div className="border-b border-black/10 px-5 py-4 sm:px-7">
                  <p className={labelClass}>Homepage</p>
                  <h3 className="mt-1 font-display text-xl">Featured carousel toggle</h3>
                </div>
                <div className="flex items-center justify-between gap-5 p-5 sm:px-7">
                  <span>
                    <span className="block text-sm font-medium">Project carousel</span>
                    <span className="mt-1 block text-xs text-neutral-500">
                      Show or hide the featured 5-slide project carousel on the homepage.
                    </span>
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settingsDraft.carouselEnabled}
                    onClick={() => setSettingsDraft({ ...settingsDraft, carouselEnabled: !settingsDraft.carouselEnabled })}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${settingsDraft.carouselEnabled ? "bg-black" : "bg-neutral-300"}`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${settingsDraft.carouselEnabled ? "left-6" : "left-1"}`} />
                  </button>
                </div>
              </section>
            </div>}

            {activeSection === "cta" && <StartProjectAdmin />}
          </main>
          </AdminTaxonomyContext.Provider>

          {/* Version History Modal */}
          {isHistoryOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs select-none">
              <div className="flex h-[82vh] w-full max-w-2xl flex-col rounded-[8px] border border-neutral-700 bg-[#1e1e1e] text-white shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <History className="h-5 w-5 text-blue-400" />
                    <div>
                      <h3 className="font-display text-lg font-medium text-white">Version History & Commits</h3>
                      <p className="text-[11px] text-neutral-400">
                        {versionHistory.length} saved versions in local record · Revert to any state anytime
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsHistoryOpen(false)}
                    className="rounded-[4px] p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-800">
                  {versionHistory.length === 0 ? (
                    <div className="py-16 text-center text-neutral-400">
                      <Clock className="mx-auto h-8 w-8 text-neutral-500 mb-3" />
                      <p className="text-sm font-medium text-neutral-200">No commits recorded yet</p>
                      <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                        Each time you click &ldquo;Commit & Save&rdquo; or save changes to Supabase, an immutable snapshot will be logged here for full undo/redo.
                      </p>
                    </div>
                  ) : (
                    versionHistory.map((version) => (
                      <div key={version.id} className="py-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <GitCommit className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span className="font-medium text-sm text-neutral-100 truncate">{version.message}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                            <span>{new Date(version.timestamp).toLocaleString()}</span>
                            <span>·</span>
                            <span>{version.snapshot.projects?.length || 0} projects</span>
                          </div>
                          {version.summary && version.summary.length > 0 && (
                            <p className="mt-1 text-[11px] text-neutral-400 truncate">
                              {version.summary.join(" · ")}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => revertToVersion(version)}
                          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[4px] border border-neutral-700 bg-neutral-800 px-3 text-[11px] font-medium text-white transition hover:bg-blue-600 hover:border-blue-500 cursor-pointer shadow-xs"
                        >
                          <RotateCcw className="h-3 w-3" /> Revert to this version
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-neutral-800 bg-[#161616] px-5 py-3 flex items-center justify-between text-xs text-neutral-400">
                  <span>Reverting applies the snapshot to the active editor.</span>
                  <button
                    type="button"
                    onClick={() => setIsHistoryOpen(false)}
                    className="rounded-[4px] bg-neutral-800 px-3.5 py-1 text-xs text-white hover:bg-neutral-700 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}