"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  FileImage,
  FolderKanban,
  LayoutDashboard,
  ListTree,
  Lock,
  LogOut,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Save,
  Trash2,
  Upload,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";
import PlaneLogo from "@/components/PlaneLogo";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { getAdminCmsContent, saveAdminCmsContent } from "@/lib/site-content";
import type { CmsDeletedContent, SiteCategory } from "@/lib/site-content";
import { NewsItem, Project, ProjectTestimonial } from "@/types/project";

const emptyProject = (): Project => ({
  id: crypto.randomUUID(),
  slug: "new-project",
  title: "New Project",
  location: "Dhaka, Bangladesh",
  year: String(new Date().getFullYear()),
  client: "Plane Architect",
  typology: "Architecture",
  category: "architecture",
  subcategory: "culture",
  sizeM2: "5,000",
  status: "Concept",
  aspectRatio: "16 / 9",
  heroImage: "",
  description: "Add a project description.",
  quote: "",
  quoteAuthor: "Plane Architect",
  quoteAuthorRole: "Design Principal",
  isPublished: false,
  sortOrder: 0,
});

const emptyNews = (): NewsItem => ({
  id: crypto.randomUUID(),
  slug: "new-news-story",
  title: "New Journal Story",
  date: new Date().toLocaleDateString("en", { month: "short", year: "numeric" }).toUpperCase(),
  author: "Plane Architect",
  category: "Architecture",
  excerpt: "Add a short introduction.",
  image: "",
  readTime: "4 min read",
  body: "",
  isPublished: false,
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

type AdminSection = "overview" | "projects" | "news" | "testimonials" | "categories" | "settings";
type ProjectTreeSelection = { categoryId: string; subcategoryId: string };

const inputClass = "mt-1.5 w-full border border-black/15 bg-white px-3.5 py-2.5 text-sm text-[#171717] outline-none transition placeholder:text-neutral-400 focus:border-black";
const labelClass = "block text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500";

const navItems: { key: AdminSection; label: string; icon: LucideIcon }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "news", label: "Journal", icon: BookOpen },
  { key: "testimonials", label: "Testimonials", icon: UsersRound },
  { key: "categories", label: "Categories", icon: ListTree },
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
      <AdminField label={label} value={value} onChange={(url) => { setUploaded(false); onChange(url); }} placeholder="https://..." />
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <input ref={inputRef} type="file" accept={allowVideo ? "image/*,video/mp4,video/webm,video/quicktime" : "image/*"} onChange={handleUpload} className="sr-only" aria-label={`Upload ${label.toLowerCase()}`} />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex h-8 items-center gap-2 rounded-[4px] border border-black/15 px-3 text-[10px] font-medium uppercase tracking-[0.1em] text-neutral-700 transition hover:border-black disabled:cursor-wait disabled:opacity-50">
          <Upload className="h-3.5 w-3.5" />{uploading ? "Uploading..." : "Upload from device"}
        </button>
        <span className="text-[10px] text-neutral-400">Supabase Storage · 50 MB max</span>
      </div>
      {uploaded && <p role="status" className="mt-2 text-xs text-[#426454]">Uploaded to Supabase Storage.</p>}
      {uploadError && <p role="alert" className="mt-2 text-xs text-red-600">{uploadError}</p>}
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
}: {
  title: string;
  subtitle: string;
  published: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex w-full items-center gap-3 border-b border-black/8 px-4 py-3.5 text-left transition ${selected ? "bg-[#f2f1ed]" : "bg-white hover:bg-[#faf9f6]"}`}
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center border ${selected ? "border-black bg-black text-white" : "border-black/10 bg-[#f8f7f4] text-neutral-500"}`}>
        <FileImage className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-[#171717]">{title || "Untitled"}</span>
        <span className="mt-1 block truncate text-xs text-neutral-500">{subtitle}</span>
      </span>
      <span className="hidden sm:block"><PublishStatus published={published} /></span>
      <ChevronRight className={`h-4 w-4 shrink-0 transition ${selected ? "text-black" : "text-neutral-300 group-hover:text-neutral-600"}`} />
    </button>
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
  const [authReady, setAuthReady] = useState(false);
  const [authSession, setAuthSession] = useState<{ user?: { id?: string } } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

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
          if (!ignore) setAuthSession(session);
        })
      : { data: { subscription: null } };

    return () => {
      ignore = true;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (!supabase || !authSession?.user?.id) {
        setIsAdmin(Boolean(!supabase));
        return;
      }

      setIsAdmin(null);
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", authSession.user.id)
        .maybeSingle();

      setIsAdmin(!error && Boolean(data));
    };

    void verifyAdminAccess();
  }, [authSession]);

  useEffect(() => {
    if (isAdmin !== true) return;
    let cancelled = false;

    void getAdminCmsContent()
      .then((content) => {
        if (cancelled) return;
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
  }, [isAdmin, loadAttempt]);

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
    } catch (error) {
      setSaveState("Ready");
      setSaveError(error instanceof Error ? error.message : "Unable to save changes to Supabase.");
    }
  };

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
    const item = emptyNews();
    setNewsDrafts((current) => [...current, item]);
    setSelectedNewsId(item.id);
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
    setDeletedContent((current) => ({ ...current, projects: [...current.projects, selectedProject.id] }));
    setProjectDrafts((current) => current.filter((item) => item.id !== selectedProject.id));
    setSelectedProjectId(projectDrafts.find((item) => item.id !== selectedProject.id)?.id ?? "");
  };
  const deleteNews = () => {
    if (!selectedNews) return;
    setDeletedContent((current) => ({ ...current, news: [...current.news, selectedNews.id] }));
    setNewsDrafts((current) => current.filter((item) => item.id !== selectedNews.id));
    setSelectedNewsId(newsDrafts.find((item) => item.id !== selectedNews.id)?.id ?? "");
  };
  const deleteTestimonial = () => {
    if (!selectedTestimonial) return;
    setDeletedContent((current) => ({ ...current, testimonials: [...current.testimonials, selectedTestimonial.id] }));
    setTestimonialDrafts((current) => current.filter((item) => item.id !== selectedTestimonial.id));
    setSelectedTestimonialId(testimonialDrafts.find((item) => item.id !== selectedTestimonial.id)?.id ?? "");
  };
  const updateProject = (field: keyof Project, value: string | boolean | number | null) => {
    if (!selectedProject) return;
    if (field === "category" || field === "subcategory") setProjectCategoryFilter(null);
    setProjectDrafts((current) => current.map((item) => item.id === selectedProject.id ? { ...item, [field]: value } : item));
  };
  const updateNews = (field: keyof NewsItem, value: string | boolean | number | null) => {
    if (!selectedNews) return;
    setNewsDrafts((current) => current.map((item) => item.id === selectedNews.id ? { ...item, [field]: value } : item));
  };
  const updateTestimonial = (id: string, field: keyof ProjectTestimonial, value: string | boolean | number | null) => {
    setTestimonialDrafts((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  if (!authReady || (authSession?.user && isAdmin === null)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f5f1] text-[#171717]">
        <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-neutral-500">
          <span className="h-4 w-4 animate-spin border border-black/20 border-t-black" />
          {authReady ? "Verifying administrator access" : "Loading admin access"}
        </p>
      </div>
    );
  }

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f5f1] px-6 text-[#171717]">
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
      <div className="grid min-h-screen bg-[#f6f5f1] text-[#171717] lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.82fr)]">
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
      <div className="flex min-h-screen items-center justify-center bg-[#f6f5f1] text-[#171717]">
        <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-neutral-500">
          <span className="h-4 w-4 animate-spin border border-black/20 border-t-black" />
          Loading studio content
        </p>
      </div>
    );
  }

  if (contentError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f5f1] px-5 text-[#171717]">
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
    news: "Journal",
    testimonials: "Testimonials",
    categories: "Categories",
    settings: "Site settings",
  };
  const publishedCount = [...projectDrafts, ...newsDrafts, ...testimonialDrafts].filter((item) => item.isPublished).length;

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171717]">
      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-black/10 bg-white lg:flex">
          <div className="flex h-[76px] items-center border-b border-black/10 px-5"><PlaneLogo imageClassName="h-9 max-w-[170px]" /></div>
          <p className="px-6 pb-2 pt-8 text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-400">Workspace</p>
          <nav aria-label="Admin sections" className="space-y-1 px-3">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button key={key} type="button" onClick={() => openSection(key)} aria-current={activeSection === key ? "page" : undefined} className={`flex w-full items-center gap-3 border-l-2 px-3.5 py-2.5 text-left text-sm transition ${activeSection === key ? "border-black bg-[#f4f3ef] font-medium text-black" : "border-transparent text-neutral-500 hover:bg-[#faf9f6] hover:text-black"}`}>
                <Icon className="h-4 w-4" strokeWidth={1.6} />{label}
                {key === "projects" && <span className="ml-auto text-[10px] text-neutral-400">{projectDrafts.length}</span>}
                {key === "news" && <span className="ml-auto text-[10px] text-neutral-400">{newsDrafts.length}</span>}
                {key === "testimonials" && <span className="ml-auto text-[10px] text-neutral-400">{testimonialDrafts.length}</span>}
                {key === "categories" && <span className="ml-auto text-[10px] text-neutral-400">{settingsDraft.categories.length}/5</span>}
              </button>
            ))}
          </nav>
          <div className="mt-auto border-t border-black/10 p-4"><div className="flex items-center gap-3 px-2 py-2"><span className="flex h-8 w-8 items-center justify-center bg-[#171717] text-white"><ShieldCheck className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">Administrator</span><span className="mt-0.5 block text-[10px] text-neutral-500">Secure session</span></span><button type="button" onClick={handleLogout} title="Sign out" aria-label="Sign out" className="flex h-8 w-8 items-center justify-center text-neutral-500 transition hover:bg-neutral-100 hover:text-black"><LogOut className="h-4 w-4" /></button></div></div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-black/10 bg-[#f6f5f1]/95 backdrop-blur">
            <div className="flex min-h-[76px] items-center justify-between gap-4 px-4 sm:px-7 xl:px-10">
              <div className="flex min-w-0 items-center gap-3"><div className="lg:hidden"><PlaneLogo imageClassName="h-8 max-w-[122px]" /></div><div className="min-w-0"><p className="hidden text-[9px] uppercase tracking-[0.18em] text-neutral-400 sm:block">Plane Architect / Studio CMS</p><h1 className="mt-1 truncate font-display text-xl sm:text-2xl">{sectionTitle[activeSection]}</h1></div></div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3"><span className="hidden items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-neutral-500 md:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-[#668b72]" />Supabase connected</span><Link href="/" className="hidden items-center gap-2 rounded-[4px] border border-black/15 bg-white px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] transition hover:border-black sm:inline-flex">View site <ArrowUpRight className="h-3.5 w-3.5" /></Link><button type="button" onClick={handleSave} disabled={!contentLoaded || saveState === "Saving..."} className="inline-flex h-9 items-center gap-2 rounded-[4px] bg-[#171717] px-3.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"><Save className="h-3.5 w-3.5" /><span className="hidden sm:inline">{saveState === "Saving..." ? "Saving..." : "Save changes"}</span><span className="sm:hidden">Save</span></button><button type="button" onClick={handleLogout} title="Sign out" aria-label="Sign out" className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-black/15 bg-white text-neutral-600 transition hover:border-black hover:text-black lg:hidden"><LogOut className="h-4 w-4" /></button></div>
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
          <main className="mx-auto max-w-[1440px] px-4 pb-20 pt-7 sm:px-7 sm:pt-9 xl:px-10">
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
                      : key === "news" ? newsDrafts.length
                      : key === "testimonials" ? testimonialDrafts.length
                      : key === "categories" ? settingsDraft.categories.length
                      : null;
                    const description = key === "projects" ? "Portfolio entries and project imagery"
                      : key === "news" ? "Studio news and journal stories"
                      : key === "testimonials" ? "Client voices and project references"
                      : key === "categories" ? "Navbar categories and project submenus"
                      : "Studio details and homepage options";
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
                <aside className="min-w-0 overflow-hidden rounded-[8px] border border-black/10 bg-white"><div className="border-b border-black/10 p-3"><label className="flex h-10 items-center gap-2 border border-black/10 px-3 text-neutral-400"><Search className="h-4 w-4 shrink-0" /><input value={collectionSearch} onChange={(event) => setCollectionSearch(event.target.value)} placeholder={`Search ${activeSection}...`} className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-neutral-400" aria-label={`Search ${activeSection}`} /></label></div><div className="max-h-[70vh] overflow-y-auto">{activeSection === "projects" && filteredProjects.map((item) => <CollectionRow key={item.id} title={item.title} subtitle={`${item.category} · ${item.year}`} published={item.isPublished ?? true} selected={selectedProject?.id === item.id} onClick={() => setSelectedProjectId(item.id)} />)}{activeSection === "news" && filteredNews.map((item) => <CollectionRow key={item.id} title={item.title} subtitle={`${item.category} · ${item.date}`} published={item.isPublished ?? true} selected={selectedNews?.id === item.id} onClick={() => setSelectedNewsId(item.id)} />)}{activeSection === "testimonials" && filteredTestimonials.map((item) => <CollectionRow key={item.id} title={item.author} subtitle={item.role || "Client testimonial"} published={item.isPublished} selected={selectedTestimonial?.id === item.id} onClick={() => setSelectedTestimonialId(item.id)} />)}{((activeSection === "projects" && filteredProjects.length === 0) || (activeSection === "news" && filteredNews.length === 0) || (activeSection === "testimonials" && filteredTestimonials.length === 0)) && <p className="px-4 py-8 text-center text-sm text-neutral-500">No matching content found.</p>}</div></aside>

                <section className="min-w-0 overflow-hidden rounded-[8px] border border-black/10 bg-white">
                  {activeSection === "projects" && selectedProject && <>
                    <div className="flex flex-col gap-3 border-b border-black/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="min-w-0"><p className={labelClass}>Project details</p><h3 className="mt-1 truncate font-display text-2xl">{selectedProject.title}</h3></div><div className="flex items-center gap-4"><PublishStatus published={selectedProject.isPublished ?? true} /><button type="button" onClick={deleteProject} title="Delete project" aria-label="Delete project" className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-red-200 text-red-600 transition hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></div>
                    <div className="space-y-7 p-5 sm:p-7"><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]"><div className="grid content-start gap-4 sm:grid-cols-2"><AdminField label="Project title" value={selectedProject.title} onChange={(value) => updateProject("title", value)} /><AdminField label="URL slug" value={selectedProject.slug} onChange={(value) => updateProject("slug", value)} /><AdminField label="Location" value={selectedProject.location} onChange={(value) => updateProject("location", value)} /><AdminField label="Year" value={selectedProject.year} onChange={(value) => updateProject("year", value)} /><AdminField label="Client" value={selectedProject.client} onChange={(value) => updateProject("client", value)} /><AdminField label="Category" value={selectedProject.category} onChange={(value) => updateProject("category", value)} /><AdminField label="Subcategory" value={selectedProject.subcategory} onChange={(value) => updateProject("subcategory", value)} /><AdminField label="Typology" value={selectedProject.typology} onChange={(value) => updateProject("typology", value)} /><AdminField label="Area (m²)" value={selectedProject.sizeM2} onChange={(value) => updateProject("sizeM2", value)} /><AdminField label="Area (ft²)" value={selectedProject.sizeFt2 ?? ""} onChange={(value) => updateProject("sizeFt2", value)} /><label className={labelClass}>Status<select value={selectedProject.status} onChange={(event) => updateProject("status", event.target.value)} className={inputClass}><option>Completed</option><option>In Progress</option><option>Competition Win</option><option>Concept</option></select></label><AdminField label="Sort order" type="number" value={String(selectedProject.sortOrder ?? 0)} onChange={(value) => updateProject("sortOrder", Number(value))} /></div><div><p className={labelClass}>Cover media</p><div className="mt-1.5 aspect-[4/3] overflow-hidden border border-black/10 bg-[#f5f4f1]">{selectedProject.heroImage ? <img src={selectedProject.heroImage} alt={`Cover preview for ${selectedProject.title}`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-neutral-400"><FileImage className="h-6 w-6" /></div>}</div><div className="mt-4"><SupabaseMediaField label="Image or video URL" value={selectedProject.heroImage} onChange={(value) => updateProject("heroImage", value)} /></div><label className={`${labelClass} mt-4`}>Media type<select value={selectedProject.heroMediaType ?? "image"} onChange={(event) => updateProject("heroMediaType", event.target.value)} className={inputClass}><option value="image">Image</option><option value="video">Video</option></select></label><label className="mt-4 flex cursor-pointer items-center gap-3 border-t border-black/10 pt-4 text-sm text-neutral-700"><input type="checkbox" checked={selectedProject.isPublished ?? true} onChange={(event) => updateProject("isPublished", event.target.checked)} className="h-4 w-4 accent-black" /><span><span className="block text-xs font-medium">Publish project</span><span className="mt-0.5 block text-[10px] text-neutral-500">Show this on the public website</span></span></label></div></div><div className="border-t border-black/10 pt-6"><p className={`${labelClass} mb-4`}>Project story</p><div className="grid gap-4 sm:grid-cols-2"><AdminField label="Description" value={selectedProject.description} onChange={(value) => updateProject("description", value)} rows={5} className="sm:col-span-2" /><AdminField label="Project quote" value={selectedProject.quote ?? ""} onChange={(value) => updateProject("quote", value)} rows={3} /><div className="grid content-start gap-4"><AdminField label="Quote author" value={selectedProject.quoteAuthor ?? ""} onChange={(value) => updateProject("quoteAuthor", value)} /><AdminField label="Author role" value={selectedProject.quoteAuthorRole ?? ""} onChange={(value) => updateProject("quoteAuthorRole", value)} /></div></div></div></div>
                  </>}

                  {activeSection === "news" && selectedNews && <>
                    <div className="flex flex-col gap-3 border-b border-black/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="min-w-0"><p className={labelClass}>Journal entry</p><h3 className="mt-1 truncate font-display text-2xl">{selectedNews.title}</h3></div><div className="flex items-center gap-4"><PublishStatus published={selectedNews.isPublished ?? true} /><button type="button" onClick={deleteNews} title="Delete story" aria-label="Delete story" className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-red-200 text-red-600 transition hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></div>
                    <div className="space-y-7 p-5 sm:p-7"><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]"><div className="grid content-start gap-4 sm:grid-cols-2"><AdminField label="Story title" value={selectedNews.title} onChange={(value) => updateNews("title", value)} className="sm:col-span-2" /><AdminField label="URL slug" value={selectedNews.slug} onChange={(value) => updateNews("slug", value)} /><AdminField label="Publication date" value={selectedNews.date} onChange={(value) => updateNews("date", value)} /><AdminField label="Author" value={selectedNews.author ?? ""} onChange={(value) => updateNews("author", value)} /><AdminField label="Category" value={selectedNews.category} onChange={(value) => updateNews("category", value)} /><AdminField label="Read time" value={selectedNews.readTime} onChange={(value) => updateNews("readTime", value)} /><AdminField label="Sort order" type="number" value={String(selectedNews.sortOrder ?? 0)} onChange={(value) => updateNews("sortOrder", Number(value))} /><AdminField label="Source URL" value={selectedNews.sourceUrl ?? ""} onChange={(value) => updateNews("sourceUrl", value)} className="sm:col-span-2" /></div><div><p className={labelClass}>Cover image</p><div className="mt-1.5 aspect-[4/3] overflow-hidden border border-black/10 bg-[#f5f4f1]">{selectedNews.image ? <img src={selectedNews.image} alt={`Cover preview for ${selectedNews.title}`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-neutral-400"><FileImage className="h-6 w-6" /></div>}</div><div className="mt-4"><SupabaseMediaField label="Image URL" value={selectedNews.image} onChange={(value) => updateNews("image", value)} /></div><label className="mt-4 flex cursor-pointer items-center gap-3 border-t border-black/10 pt-4 text-sm text-neutral-700"><input type="checkbox" checked={selectedNews.isPublished ?? true} onChange={(event) => updateNews("isPublished", event.target.checked)} className="h-4 w-4 accent-black" /><span><span className="block text-xs font-medium">Publish story</span><span className="mt-0.5 block text-[10px] text-neutral-500">Show this in the journal</span></span></label></div></div><div className="grid gap-4 border-t border-black/10 pt-6"><AdminField label="Short introduction" value={selectedNews.excerpt} onChange={(value) => updateNews("excerpt", value)} rows={3} /><AdminField label="Article body" value={selectedNews.body ?? ""} onChange={(value) => updateNews("body", value)} rows={9} /></div></div>
                  </>}

                  {activeSection === "testimonials" && selectedTestimonial && <>
                    <div className="flex flex-col gap-3 border-b border-black/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="min-w-0"><p className={labelClass}>Client voice</p><h3 className="mt-1 truncate font-display text-2xl">{selectedTestimonial.author || "New testimonial"}</h3></div><div className="flex items-center gap-4"><PublishStatus published={selectedTestimonial.isPublished} /><button type="button" onClick={deleteTestimonial} title="Delete testimonial" aria-label="Delete testimonial" className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-red-200 text-red-600 transition hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></div>
                    <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_240px]"><div className="grid content-start gap-4 sm:grid-cols-2"><AdminField label="Client name" value={selectedTestimonial.author} onChange={(value) => updateTestimonial(selectedTestimonial.id, "author", value)} /><AdminField label="Role or organization" value={selectedTestimonial.role} onChange={(value) => updateTestimonial(selectedTestimonial.id, "role", value)} /><AdminField label="Testimonial" value={selectedTestimonial.quote} onChange={(value) => updateTestimonial(selectedTestimonial.id, "quote", value)} rows={6} className="sm:col-span-2" /><AdminField label="Related project slug" value={selectedTestimonial.projectSlug ?? ""} onChange={(value) => updateTestimonial(selectedTestimonial.id, "projectSlug", value || null)} placeholder="Optional" /><AdminField label="Rating (1-5)" type="number" value={String(selectedTestimonial.rating)} onChange={(value) => updateTestimonial(selectedTestimonial.id, "rating", Number(value))} /><label className="flex cursor-pointer items-center gap-3 border-t border-black/10 pt-4 text-sm text-neutral-700 sm:col-span-2"><input type="checkbox" checked={selectedTestimonial.isPublished} onChange={(event) => updateTestimonial(selectedTestimonial.id, "isPublished", event.target.checked)} className="h-4 w-4 accent-black" /><span><span className="block text-xs font-medium">Publish testimonial</span><span className="mt-0.5 block text-[10px] text-neutral-500">Display this client voice on the website</span></span></label></div><div><p className={labelClass}>Portrait</p><div className="mt-1.5 flex aspect-[4/3] items-center justify-center overflow-hidden border border-black/10 bg-[#f5f4f1]">{selectedTestimonial.image ? <img src={selectedTestimonial.image} alt={`Portrait preview of ${selectedTestimonial.author}`} className="h-full w-full object-cover" /> : <div className="text-neutral-400"><FileImage className="h-6 w-6" /></div>}</div><div className="mt-4"><SupabaseMediaField label="Image URL" value={selectedTestimonial.image ?? ""} onChange={(value) => updateTestimonial(selectedTestimonial.id, "image", value)} /></div><p className="mt-2 text-[10px] leading-4 text-neutral-500">Choose a local file or paste a direct image URL.</p></div></div>
                  </>}

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

            {activeSection === "settings" && <div className="max-w-4xl">
              <section className="mb-7 border-b border-black/10 pb-6"><p className={labelClass}>Studio profile</p><h2 className="mt-2 font-display text-3xl sm:text-4xl">The details visitors see</h2><p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">Update contact information, identity, and the homepage carousel.</p></section>
              <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white"><div className="border-b border-black/10 px-5 py-4 sm:px-7"><p className={labelClass}>Identity</p><h3 className="mt-1 font-display text-xl">Studio information</h3></div><div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7"><AdminField label="Studio name" value={settingsDraft.siteName} onChange={(value) => setSettingsDraft({ ...settingsDraft, siteName: value })} /><AdminField label="Tagline" value={settingsDraft.tagline} onChange={(value) => setSettingsDraft({ ...settingsDraft, tagline: value })} /><AdminField label="Contact email" type="email" value={settingsDraft.email} onChange={(value) => setSettingsDraft({ ...settingsDraft, email: value })} /><AdminField label="Phone number" value={settingsDraft.phone} onChange={(value) => setSettingsDraft({ ...settingsDraft, phone: value })} /><AdminField label="Studio address" value={settingsDraft.address} onChange={(value) => setSettingsDraft({ ...settingsDraft, address: value })} className="sm:col-span-2" /><AdminField label="Logo image URL" value={settingsDraft.logoUrl} onChange={(value) => setSettingsDraft({ ...settingsDraft, logoUrl: value })} className="sm:col-span-2" /></div></section>
              <section className="mt-6 overflow-hidden rounded-[8px] border border-black/10 bg-white"><div className="border-b border-black/10 px-5 py-4 sm:px-7"><p className={labelClass}>Homepage</p><h3 className="mt-1 font-display text-xl">Featured experience</h3></div><div className="flex items-center justify-between gap-5 p-5 sm:px-7"><span><span className="block text-sm font-medium">Project carousel</span><span className="mt-1 block text-xs text-neutral-500">Show the featured project carousel on the homepage.</span></span><button type="button" role="switch" aria-checked={settingsDraft.carouselEnabled} onClick={() => setSettingsDraft({ ...settingsDraft, carouselEnabled: !settingsDraft.carouselEnabled })} className={`relative h-6 w-11 shrink-0 transition ${settingsDraft.carouselEnabled ? "bg-black" : "bg-neutral-300"}`}><span className={`absolute top-1 h-4 w-4 bg-white transition ${settingsDraft.carouselEnabled ? "left-6" : "left-1"}`} /></button></div></section>
            </div>}
          </main>
          </AdminTaxonomyContext.Provider>
        </div>
      </div>
    </div>
  );
}