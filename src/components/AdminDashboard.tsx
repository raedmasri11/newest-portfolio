"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ProjectItem = {
  slug: string;
  title: string;
  client: string;
  type: "client" | "concept" | "test";
  format: "long-form" | "short-form" | "motion";
  language: "en" | "ar";
  year: string;
  description: string;
  role: string[];
  thumbnail?: string;
  videoUrl?: string;
  externalUrl?: string;
  aspect: "16:9" | "9:16";
  duration?: string;
  featured?: boolean;
  comingSoon?: boolean;
  published?: boolean;
  sortOrder?: number;
};

type ClientItem = {
  id: string;
  name: string;
  kind: "creator" | "brand" | "agency";
  image?: string;
  url?: string;
  showInHero?: boolean;
  showInMarquee?: boolean;
  published?: boolean;
  sortOrder?: number;
};

type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  company: string;
  published?: boolean;
  sortOrder?: number;
};

type DashboardContent = {
  configured: boolean;
  projects: ProjectItem[];
  clients: ClientItem[];
  testimonials: TestimonialItem[];
};

type Tab = "overview" | "projects" | "clients" | "testimonials";
type Entity = "projects" | "clients" | "testimonials";

type EditorState =
  | { entity: "projects"; item: ProjectItem; previousId?: string }
  | { entity: "clients"; item: ClientItem; previousId?: string }
  | { entity: "testimonials"; item: TestimonialItem; previousId?: string }
  | null;

const emptyProject = (): ProjectItem => ({
  slug: "",
  title: "",
  client: "",
  type: "client",
  format: "short-form",
  language: "en",
  year: String(new Date().getFullYear()),
  description: "",
  role: [],
  thumbnail: "",
  videoUrl: "",
  externalUrl: "",
  aspect: "9:16",
  duration: "",
  featured: false,
  comingSoon: false,
  published: true,
  sortOrder: 9999,
});

const emptyClient = (): ClientItem => ({
  id: "",
  name: "",
  kind: "creator",
  image: "",
  url: "",
  showInHero: true,
  showInMarquee: true,
  published: true,
  sortOrder: 9999,
});

const emptyTestimonial = (): TestimonialItem => ({
  id: "",
  quote: "",
  name: "Client",
  company: "",
  published: true,
  sortOrder: 9999,
});

const formatLabel: Record<ProjectItem["format"], string> = {
  "long-form": "Long-form",
  "short-form": "Short-form",
  motion: "Motion",
};

function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "orange" | "green" | "muted" }) {
  return <span className={`admin-status admin-status-${tone}`}>{children}</span>;
}

function Icon({ name }: { name: "home" | "video" | "people" | "quote" | "plus" | "edit" | "trash" | "external" | "logout" }) {
  const paths: Record<typeof name, React.ReactNode> = {
    home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></>,
    video: <><rect x="3" y="5" width="14" height="14" rx="2.5"/><path d="m17 10 4-2v8l-4-2"/></>,
    people: <><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.6-3.4 2.5-5.2 5.5-5.2s5 1.8 5.5 5.2"/><circle cx="17.5" cy="9" r="2.2"/><path d="M15.7 14.4c2.9-.4 4.5 1.1 4.8 4.1"/></>,
    quote: <><path d="M5 6h5v5H6c0 3-1.2 5-3 6"/><path d="M14 6h5v5h-4c0 3-1.2 5-3 6"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    edit: <><path d="m4 16-.7 4 4-.7L18.5 8.1 15.9 5.5z"/><path d="m14.5 6.9 2.6 2.6"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"/></>,
    external: <><path d="M13 5h6v6M19 5l-8 8"/><path d="M17 13v6H5V7h6"/></>,
    logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"/></>,
  };
  return <svg className="admin-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [content, setContent] = useState<DashboardContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState<"all" | ProjectItem["format"]>("all");
  const [editor, setEditor] = useState<EditorState>(null);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  async function loadContent() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not load dashboard.");
      setContent(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadContent(); }, []);

  const filteredProjects = useMemo(() => {
    if (!content) return [];
    const needle = search.trim().toLowerCase();
    return content.projects.filter((project) => {
      const matchesFormat = projectFilter === "all" || project.format === projectFilter;
      const matchesSearch = !needle || `${project.title} ${project.client}`.toLowerCase().includes(needle);
      return matchesFormat && matchesSearch;
    });
  }, [content, search, projectFilter]);

  function openNew(entity: Entity) {
    setFile(null);
    const nextOrder = (items: { sortOrder?: number }[]) => Math.max(0, ...items.map((item) => item.sortOrder ?? 0)) + 10;
    if (entity === "projects") setEditor({ entity, item: { ...emptyProject(), sortOrder: nextOrder(content?.projects ?? []) } });
    if (entity === "clients") setEditor({ entity, item: { ...emptyClient(), sortOrder: nextOrder(content?.clients ?? []) } });
    if (entity === "testimonials") setEditor({ entity, item: { ...emptyTestimonial(), sortOrder: nextOrder(content?.testimonials ?? []) } });
  }

  function openEdit(entity: Entity, item: ProjectItem | ClientItem | TestimonialItem) {
    setFile(null);
    if (entity === "projects") {
      const project = item as ProjectItem;
      setEditor({ entity, item: { ...project, role: [...project.role] }, previousId: project.slug });
    } else if (entity === "clients") {
      const client = item as ClientItem;
      setEditor({ entity, item: { ...client }, previousId: client.id });
    } else {
      const testimonial = item as TestimonialItem;
      setEditor({ entity, item: { ...testimonial }, previousId: testimonial.id });
    }
  }

  async function uploadImage(label: string) {
    if (!file) return "";
    const form = new FormData();
    form.set("file", file);
    form.set("label", label);
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Image upload failed.");
    return payload.path as string;
  }

  async function saveEditor(event: FormEvent) {
    event.preventDefault();
    if (!editor || !content?.configured) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      let item: ProjectItem | ClientItem | TestimonialItem = editor.item;
      if (editor.entity === "projects" && file) {
        const path = await uploadImage(editor.item.title || "project-cover");
        item = { ...editor.item, thumbnail: path };
      }
      if (editor.entity === "clients" && file) {
        const path = await uploadImage(editor.item.name || "client-profile");
        item = { ...editor.item, image: path };
      }
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity: editor.entity, action: "upsert", item, previousId: editor.previousId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not save the change.");
      setContent((current) => current ? { ...current, [editor.entity]: payload.data } : current);
      setEditor(null);
      setFile(null);
      setNotice("Saved to GitHub. Netlify will deploy the updated portfolio automatically.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the change.");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(entity: Entity, id: string, label: string) {
    if (!content?.configured) return;
    if (!window.confirm(`Remove “${label}” from the portfolio content?`)) return;
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity, action: "delete", previousId: id }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not remove the item.");
      setContent((current) => current ? { ...current, [entity]: payload.data } : current);
      setNotice("Removed from GitHub. Netlify will deploy the update automatically.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove the item.");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const title = tab === "overview" ? "Dashboard" : tab === "projects" ? "Projects" : tab === "clients" ? "Clients & creators" : "Testimonials";
  const subtitle = tab === "overview"
    ? "Everything you need to keep your portfolio current."
    : tab === "projects"
      ? "Add videos, covers, languages and formats without editing code."
      : tab === "clients"
        ? "Control the creator profile row and the “Client work for” marquee."
        : "Publish client feedback directly into your existing review design.";

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span>RM</span><div><strong>Raed Masri.</strong><small>Portfolio admin</small></div></div>
        <nav className="admin-nav" aria-label="Dashboard navigation">
          <button className={tab === "overview" ? "is-active" : ""} onClick={() => setTab("overview")}><Icon name="home" />Overview</button>
          <button className={tab === "projects" ? "is-active" : ""} onClick={() => setTab("projects")}><Icon name="video" />Projects</button>
          <button className={tab === "clients" ? "is-active" : ""} onClick={() => setTab("clients")}><Icon name="people" />Clients & creators</button>
          <button className={tab === "testimonials" ? "is-active" : ""} onClick={() => setTab("testimonials")}><Icon name="quote" />Testimonials</button>
        </nav>
        <div className="admin-sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer"><Icon name="external" />Open portfolio</a>
          <button type="button" onClick={logout}><Icon name="logout" />Sign out</button>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div><p className="admin-eyebrow">Content manager</p><h1>{title}</h1><p>{subtitle}</p></div>
          {tab !== "overview" && <button type="button" className="admin-primary-button admin-add-button" onClick={() => openNew(tab as Entity)}><Icon name="plus" />Add {tab === "projects" ? "project" : tab === "clients" ? "profile" : "feedback"}</button>}
        </header>

        {!content?.configured && !loading && (
          <div className="admin-setup-banner" role="status">
            <div><strong>Dashboard UI is ready — publishing needs one-time GitHub setup.</strong><p>Add the GitHub CMS environment variables in Netlify, then redeploy. The dashboard will publish directly to your repo.</p></div>
            <span>Setup required</span>
          </div>
        )}
        {error && <div className="admin-message admin-message-error" role="alert">{error}</div>}
        {notice && <div className="admin-message admin-message-success" role="status">{notice}</div>}

        {loading ? <DashboardSkeleton /> : content && (
          <>
            {tab === "overview" && (
              <div className="admin-overview">
                <div className="admin-stat-grid">
                  <SummaryCard label="Projects" value={content.projects.length} detail={`${content.projects.filter((item) => item.published !== false).length} published`} icon="video" />
                  <SummaryCard label="Clients & creators" value={content.clients.length} detail={`${content.clients.filter((item) => item.showInHero).length} in profile row`} icon="people" />
                  <SummaryCard label="Testimonials" value={content.testimonials.length} detail={`${content.testimonials.filter((item) => item.published !== false).length} visible`} icon="quote" />
                </div>
                <section className="admin-panel admin-quick-panel">
                  <div className="admin-panel-heading"><div><p className="admin-eyebrow">Quick add</p><h2>Add something new</h2></div><p>The fastest path from finished client work to your live portfolio.</p></div>
                  <div className="admin-quick-grid">
                    <button onClick={() => { setTab("projects"); openNew("projects"); }}><span><Icon name="video" /></span><strong>New project</strong><small>Video, cover, EN/AR, format</small></button>
                    <button onClick={() => { setTab("clients"); openNew("clients"); }}><span><Icon name="people" /></span><strong>New client / creator</strong><small>Profile image + marquee visibility</small></button>
                    <button onClick={() => { setTab("testimonials"); openNew("testimonials"); }}><span><Icon name="quote" /></span><strong>New feedback</strong><small>Quote, client and company</small></button>
                  </div>
                </section>
                <section className="admin-panel">
                  <div className="admin-panel-heading"><div><p className="admin-eyebrow">Recently listed</p><h2>Latest projects</h2></div><button type="button" className="admin-text-button" onClick={() => setTab("projects")}>View all →</button></div>
                  <div className="admin-recent-list">
                    {content.projects.slice(-5).reverse().map((project) => <ProjectRow key={project.slug} project={project} compact onEdit={() => openEdit("projects", project)} onDelete={() => void removeItem("projects", project.slug, project.title)} />)}
                  </div>
                </section>
              </div>
            )}

            {tab === "projects" && (
              <section className="admin-panel admin-content-panel">
                <div className="admin-toolbar">
                  <label className="admin-search"><span className="sr-only">Search projects</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or client…" /></label>
                  <div className="admin-filter-pills" aria-label="Project format filter">
                    {(["all", "long-form", "short-form", "motion"] as const).map((item) => <button type="button" key={item} className={projectFilter === item ? "is-active" : ""} onClick={() => setProjectFilter(item)}>{item === "all" ? "All" : formatLabel[item]}</button>)}
                  </div>
                </div>
                <div className="admin-project-list">
                  {filteredProjects.length ? filteredProjects.map((project) => <ProjectRow key={project.slug} project={project} onEdit={() => openEdit("projects", project)} onDelete={() => void removeItem("projects", project.slug, project.title)} />) : <div className="admin-empty">No projects match this filter.</div>}
                </div>
              </section>
            )}

            {tab === "clients" && (
              <div className="admin-client-grid">
                {content.clients.map((client) => (
                  <article className="admin-client-card" key={client.id}>
                    <div className="admin-client-avatar">{client.image ? <img src={client.image} alt="" /> : <span>{client.name.slice(0, 2).toUpperCase()}</span>}</div>
                    <div className="admin-client-copy"><StatusPill>{client.kind}</StatusPill><h3>{client.name}</h3><div className="admin-inline-status"><span className={client.showInHero ? "is-on" : ""}>Profile row</span><span className={client.showInMarquee ? "is-on" : ""}>Client marquee</span></div></div>
                    <div className="admin-row-actions"><button type="button" onClick={() => openEdit("clients", client)} aria-label={`Edit ${client.name}`}><Icon name="edit" /></button><button type="button" onClick={() => void removeItem("clients", client.id, client.name)} aria-label={`Delete ${client.name}`}><Icon name="trash" /></button></div>
                  </article>
                ))}
              </div>
            )}

            {tab === "testimonials" && (
              <div className="admin-testimonial-grid">
                {content.testimonials.map((testimonial) => (
                  <article className="admin-testimonial-card" key={testimonial.id}>
                    <div className="admin-testimonial-top"><StatusPill tone={testimonial.published === false ? "muted" : "green"}>{testimonial.published === false ? "Draft" : "Published"}</StatusPill><div className="admin-row-actions"><button type="button" onClick={() => openEdit("testimonials", testimonial)} aria-label="Edit feedback"><Icon name="edit" /></button><button type="button" onClick={() => void removeItem("testimonials", testimonial.id, testimonial.company)} aria-label="Delete feedback"><Icon name="trash" /></button></div></div>
                    <blockquote>“{testimonial.quote}”</blockquote><footer><strong>{testimonial.name}</strong><span>{testimonial.company}</span></footer>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {editor && <EditorDialog editor={editor} setEditor={setEditor} clients={content?.clients ?? []} file={file} setFile={setFile} configured={Boolean(content?.configured)} saving={saving} onSubmit={saveEditor} />}
    </main>
  );
}

function SummaryCard({ label, value, detail, icon }: { label: string; value: number; detail: string; icon: "video" | "people" | "quote" }) {
  return <article className="admin-summary-card"><div className="admin-summary-icon"><Icon name={icon} /></div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></article>;
}

function ProjectRow({ project, onEdit, onDelete, compact = false }: { project: ProjectItem; onEdit: () => void; onDelete: () => void; compact?: boolean }) {
  return (
    <article className={`admin-project-row ${compact ? "is-compact" : ""}`}>
      <div className={`admin-project-thumb admin-project-thumb-${project.aspect === "9:16" ? "vertical" : "wide"}`}>{project.thumbnail ? <img src={project.thumbnail} alt="" /> : <span>No cover</span>}</div>
      <div className="admin-project-main"><div className="admin-project-title"><h3>{project.title}</h3>{project.featured && <StatusPill tone="orange">Featured</StatusPill>}</div><p>{project.client}</p><div className="admin-project-tags"><StatusPill>{formatLabel[project.format]}</StatusPill><StatusPill tone={project.language === "ar" ? "orange" : "neutral"}>{project.language.toUpperCase()}</StatusPill><StatusPill tone={project.published === false ? "muted" : "green"}>{project.published === false ? "Draft" : "Published"}</StatusPill></div></div>
      {!compact && <div className="admin-project-order"><span>Order</span><strong>{project.sortOrder ?? "—"}</strong></div>}
      <div className="admin-row-actions"><button type="button" onClick={onEdit} aria-label={`Edit ${project.title}`}><Icon name="edit" /></button><button type="button" onClick={onDelete} aria-label={`Delete ${project.title}`}><Icon name="trash" /></button></div>
    </article>
  );
}

function EditorDialog({ editor, setEditor, clients, file, setFile, configured, saving, onSubmit }: {
  editor: Exclude<EditorState, null>;
  setEditor: (value: EditorState) => void;
  clients: ClientItem[];
  file: File | null;
  setFile: (file: File | null) => void;
  configured: boolean;
  saving: boolean;
  onSubmit: (event: FormEvent) => void;
}) {
  const title = editor.entity === "projects" ? (editor.previousId ? "Edit project" : "Add project") : editor.entity === "clients" ? (editor.previousId ? "Edit client / creator" : "Add client / creator") : (editor.previousId ? "Edit feedback" : "Add feedback");

  function updateProject(patch: Partial<ProjectItem>) {
    if (editor.entity === "projects") setEditor({ ...editor, item: { ...editor.item, ...patch } });
  }
  function updateClient(patch: Partial<ClientItem>) {
    if (editor.entity === "clients") setEditor({ ...editor, item: { ...editor.item, ...patch } });
  }
  function updateTestimonial(patch: Partial<TestimonialItem>) {
    if (editor.entity === "testimonials") setEditor({ ...editor, item: { ...editor.item, ...patch } });
  }

  return (
    <div className="admin-dialog-backdrop" role="presentation" onMouseDown={() => !saving && setEditor(null)}>
      <section className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <header><div><p className="admin-eyebrow">Portfolio content</p><h2 id="admin-dialog-title">{title}</h2></div><button type="button" className="admin-dialog-close" onClick={() => setEditor(null)} disabled={saving} aria-label="Close">×</button></header>
        <form onSubmit={onSubmit}>
          {editor.entity === "projects" && (
            <>
              <div className="admin-form-grid two-col"><label className="admin-field"><span>Project title</span><input value={editor.item.title} onChange={(e) => updateProject({ title: e.target.value })} required placeholder="e.g. Founder Story Reel" /></label><label className="admin-field"><span>Client / creator</span><input list="admin-client-options" value={editor.item.client} onChange={(e) => updateProject({ client: e.target.value })} required placeholder="Client name" /><datalist id="admin-client-options">{clients.map((client) => <option key={client.id} value={client.name} />)}</datalist></label></div>
              <div className="admin-form-grid two-col"><SegmentField label="Language" options={[['en','EN'],['ar','AR']]} value={editor.item.language} onChange={(value) => updateProject({ language: value as ProjectItem['language'] })} /><SegmentField label="Format" options={[['short-form','Short-form'],['long-form','Long-form'],['motion','Motion']]} value={editor.item.format} onChange={(value) => updateProject({ format: value as ProjectItem['format'], aspect: value === 'short-form' ? '9:16' : editor.item.aspect })} /></div>
              <div className="admin-form-grid three-col"><label className="admin-field"><span>Project type</span><select value={editor.item.type} onChange={(e) => updateProject({ type: e.target.value as ProjectItem['type'] })}><option value="client">Client work</option><option value="concept">Concept project</option><option value="test">Editing test</option></select></label><label className="admin-field"><span>Aspect</span><select value={editor.item.aspect} onChange={(e) => updateProject({ aspect: e.target.value as ProjectItem['aspect'] })}><option value="9:16">9:16 vertical</option><option value="16:9">16:9 landscape</option></select></label><label className="admin-field"><span>Year</span><input value={editor.item.year} onChange={(e) => updateProject({ year: e.target.value })} inputMode="numeric" /></label></div>
              <label className="admin-field"><span>Description</span><textarea value={editor.item.description} onChange={(e) => updateProject({ description: e.target.value })} rows={4} placeholder="What did you edit and what was the goal?" /></label>
              <label className="admin-field"><span>Roles / skills <small>comma separated</small></span><input value={editor.item.role.join(", ")} onChange={(e) => updateProject({ role: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} placeholder="Editing, Captions, Motion graphics" /></label>
              <ImageUploadField label="Cover image" current={editor.item.thumbnail} file={file} setFile={setFile} hint="JPG, PNG or WEBP · max 5 MB" />
              <div className="admin-form-grid two-col"><label className="admin-field"><span>Video URL</span><input value={editor.item.videoUrl ?? ""} onChange={(e) => updateProject({ videoUrl: e.target.value })} placeholder="YouTube / Shorts URL" /></label><label className="admin-field"><span>External URL</span><input value={editor.item.externalUrl ?? ""} onChange={(e) => updateProject({ externalUrl: e.target.value })} placeholder="Instagram / client website" /></label></div>
              <div className="admin-form-grid three-col"><label className="admin-field"><span>Duration</span><input value={editor.item.duration ?? ""} onChange={(e) => updateProject({ duration: e.target.value })} placeholder="1:24" /></label><label className="admin-field"><span>Display order</span><input type="number" value={editor.item.sortOrder ?? 9999} onChange={(e) => updateProject({ sortOrder: Number(e.target.value) })} /></label><label className="admin-field"><span>Slug <small>optional</small></span><input value={editor.item.slug} onChange={(e) => updateProject({ slug: e.target.value })} placeholder="auto from title" /></label></div>
              <div className="admin-toggle-grid"><CheckField label="Featured on homepage" checked={Boolean(editor.item.featured)} onChange={(checked) => updateProject({ featured: checked })} /><CheckField label="Coming soon" checked={Boolean(editor.item.comingSoon)} onChange={(checked) => updateProject({ comingSoon: checked })} /><CheckField label="Published" checked={editor.item.published !== false} onChange={(checked) => updateProject({ published: checked })} /></div>
            </>
          )}

          {editor.entity === "clients" && (
            <>
              <div className="admin-form-grid two-col"><label className="admin-field"><span>Name</span><input value={editor.item.name} onChange={(e) => updateClient({ name: e.target.value })} required placeholder="Creator / brand name" /></label><label className="admin-field"><span>Type</span><select value={editor.item.kind} onChange={(e) => updateClient({ kind: e.target.value as ClientItem['kind'] })}><option value="creator">Creator</option><option value="brand">Brand</option><option value="agency">Agency</option></select></label></div>
              <ImageUploadField label="Profile image / logo" current={editor.item.image} file={file} setFile={setFile} hint="Square images work best in the profile row" />
              <label className="admin-field"><span>Website / social URL</span><input value={editor.item.url ?? ""} onChange={(e) => updateClient({ url: e.target.value })} placeholder="https://…" /></label>
              <div className="admin-form-grid two-col"><label className="admin-field"><span>Display order</span><input type="number" value={editor.item.sortOrder ?? 9999} onChange={(e) => updateClient({ sortOrder: Number(e.target.value) })} /></label><label className="admin-field"><span>ID <small>optional</small></span><input value={editor.item.id} onChange={(e) => updateClient({ id: e.target.value })} placeholder="auto from name" /></label></div>
              <div className="admin-toggle-grid"><CheckField label="Show in creator profile row" checked={Boolean(editor.item.showInHero)} onChange={(checked) => updateClient({ showInHero: checked })} /><CheckField label="Show in “Client work for”" checked={Boolean(editor.item.showInMarquee)} onChange={(checked) => updateClient({ showInMarquee: checked })} /><CheckField label="Published" checked={editor.item.published !== false} onChange={(checked) => updateClient({ published: checked })} /></div>
            </>
          )}

          {editor.entity === "testimonials" && (
            <>
              <label className="admin-field"><span>Client feedback</span><textarea value={editor.item.quote} onChange={(e) => updateTestimonial({ quote: e.target.value })} rows={6} required placeholder="Paste the client's feedback exactly…" /></label>
              <div className="admin-form-grid two-col"><label className="admin-field"><span>Name / role</span><input value={editor.item.name} onChange={(e) => updateTestimonial({ name: e.target.value })} placeholder="Founder" /></label><label className="admin-field"><span>Client / company</span><input value={editor.item.company} onChange={(e) => updateTestimonial({ company: e.target.value })} required placeholder="Midnight Studios" /></label></div>
              <label className="admin-field"><span>Display order</span><input type="number" value={editor.item.sortOrder ?? 9999} onChange={(e) => updateTestimonial({ sortOrder: Number(e.target.value) })} /></label>
              <div className="admin-toggle-grid"><CheckField label="Published" checked={editor.item.published !== false} onChange={(checked) => updateTestimonial({ published: checked })} /></div>
            </>
          )}

          <footer className="admin-dialog-footer"><div>{!configured && <small>Configure GitHub publishing in Netlify before saving.</small>}</div><div><button type="button" className="admin-secondary-button" onClick={() => setEditor(null)} disabled={saving}>Cancel</button><button type="submit" className="admin-primary-button" disabled={!configured || saving}>{saving ? "Publishing…" : "Save & publish"}<span aria-hidden="true">→</span></button></div></footer>
        </form>
      </section>
    </div>
  );
}

function SegmentField({ label, options, value, onChange }: { label: string; options: readonly [string, string][]; value: string; onChange: (value: string) => void }) {
  return <fieldset className="admin-segment-field"><legend>{label}</legend><div>{options.map(([key, text]) => <button type="button" key={key} className={value === key ? "is-active" : ""} aria-pressed={value === key} onClick={() => onChange(key)}>{text}</button>)}</div></fieldset>;
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="admin-check-field"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span className="admin-switch" aria-hidden="true"><i /></span><span>{label}</span></label>;
}

function ImageUploadField({ label, current, file, setFile, hint }: { label: string; current?: string; file: File | null; setFile: (file: File | null) => void; hint: string }) {
  return (
    <label className="admin-upload-field">
      <span>{label}</span>
      <div className="admin-upload-box">
        <div className="admin-upload-preview">{file ? <span>{file.name}</span> : current ? <img src={current} alt="Current upload" /> : <span>No image yet</span>}</div>
        <div><strong>{file ? "New image selected" : "Choose an image"}</strong><small>{hint}</small><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
      </div>
    </label>
  );
}

function DashboardSkeleton() {
  return <div className="admin-skeleton"><i /><i /><i /><i /></div>;
}
