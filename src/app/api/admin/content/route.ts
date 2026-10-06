import { NextResponse } from "next/server";
import projectsFallback from "@/data/content/projects.json";
import clientsFallback from "@/data/content/clients.json";
import testimonialsFallback from "@/data/content/testimonials.json";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { isGithubCmsConfigured, readRepoJson, writeRepoJson } from "@/lib/githubCms";

export const runtime = "nodejs";

type Entity = "projects" | "clients" | "testimonials";
type Action = "upsert" | "delete";

const paths: Record<Entity, string> = {
  projects: "src/data/content/projects.json",
  clients: "src/data/content/clients.json",
  testimonials: "src/data/content/testimonials.json",
};

const fallback: Record<Entity, unknown[]> = {
  projects: projectsFallback,
  clients: clientsFallback,
  testimonials: testimonialsFallback,
};

function isEntity(value: unknown): value is Entity {
  return value === "projects" || value === "clients" || value === "testimonials";
}

function cleanString(value: unknown, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function boolean(value: unknown) {
  return value === true;
}

function number(value: unknown, fallbackValue = 9999) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : fallbackValue;
}

function sanitize(entity: Entity, input: Record<string, unknown>, list: Record<string, unknown>[]) {
  if (entity === "projects") {
    const title = cleanString(input.title, 180);
    const slug = slugify(cleanString(input.slug, 100) || title);
    if (!title || !slug) throw new Error("Project title is required.");
    const format = ["long-form", "short-form", "motion"].includes(String(input.format)) ? String(input.format) : "short-form";
    const language = input.language === "ar" ? "ar" : "en";
    const type = ["client", "concept", "test"].includes(String(input.type)) ? String(input.type) : "client";
    const aspect = input.aspect === "9:16" ? "9:16" : "16:9";
    const roles = Array.isArray(input.role) ? input.role.map((item) => cleanString(item, 80)).filter(Boolean).slice(0, 12) : [];
    return {
      slug,
      title,
      client: cleanString(input.client, 140) || "Private project",
      type,
      format,
      language,
      year: cleanString(input.year, 8) || String(new Date().getFullYear()),
      description: cleanString(input.description, 2500),
      role: roles,
      thumbnail: cleanString(input.thumbnail, 500) || undefined,
      videoUrl: cleanString(input.videoUrl, 800) || undefined,
      externalUrl: cleanString(input.externalUrl, 800) || undefined,
      aspect,
      duration: cleanString(input.duration, 40) || undefined,
      featured: boolean(input.featured),
      comingSoon: boolean(input.comingSoon),
      published: input.published !== false,
      sortOrder: number(input.sortOrder, (Math.max(0, ...list.map((item) => number(item.sortOrder, 0))) + 10)),
    };
  }

  if (entity === "clients") {
    const name = cleanString(input.name, 160);
    const id = slugify(cleanString(input.id, 100) || name);
    if (!name || !id) throw new Error("Client / creator name is required.");
    const kind = ["creator", "brand", "agency"].includes(String(input.kind)) ? String(input.kind) : "creator";
    return {
      id,
      name,
      kind,
      image: cleanString(input.image, 500) || undefined,
      url: cleanString(input.url, 800) || "",
      showInHero: boolean(input.showInHero),
      showInMarquee: boolean(input.showInMarquee),
      published: input.published !== false,
      sortOrder: number(input.sortOrder, (Math.max(0, ...list.map((item) => number(item.sortOrder, 0))) + 10)),
    };
  }

  const quote = cleanString(input.quote, 2600);
  const id = slugify(cleanString(input.id, 100)) || `testimonial-${Date.now()}`;
  if (!quote) throw new Error("Feedback text is required.");
  return {
    id,
    quote,
    name: cleanString(input.name, 120) || "Client",
    company: cleanString(input.company, 160) || "Private project",
    published: input.published !== false,
    sortOrder: number(input.sortOrder, (Math.max(0, ...list.map((item) => number(item.sortOrder, 0))) + 10)),
  };
}

async function getEntity(entity: Entity) {
  if (!isGithubCmsConfigured()) return { data: fallback[entity], sha: "", source: "local" as const };
  const result = await readRepoJson<unknown[]>(paths[entity]);
  return { ...result, source: "github" as const };
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [projects, clients, testimonials] = await Promise.all([
      getEntity("projects"),
      getEntity("clients"),
      getEntity("testimonials"),
    ]);
    return NextResponse.json({
      configured: isGithubCmsConfigured(),
      projects: projects.data,
      clients: clients.data,
      testimonials: testimonials.data,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load dashboard content." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isGithubCmsConfigured()) {
    return NextResponse.json({ error: "GitHub publishing is not configured yet. Add the GITHUB_CMS_* environment variables in Netlify." }, { status: 503 });
  }

  try {
    const body = await request.json() as {
      entity?: Entity;
      action?: Action;
      item?: Record<string, unknown>;
      previousId?: string;
    };
    if (!isEntity(body.entity) || (body.action !== "upsert" && body.action !== "delete")) {
      return NextResponse.json({ error: "Invalid dashboard request." }, { status: 400 });
    }

    const entity = body.entity;
    const { data, sha } = await readRepoJson<Record<string, unknown>[]>(paths[entity]);
    const idKey = entity === "projects" ? "slug" : "id";
    let next = data.slice();

    if (body.action === "delete") {
      const id = cleanString(body.previousId, 120);
      if (!id) return NextResponse.json({ error: "Missing item id." }, { status: 400 });
      next = next.filter((item) => item[idKey] !== id);
    } else {
      const item = sanitize(entity, body.item ?? {}, data);
      const id = String(item[idKey as keyof typeof item]);
      const suppliedPreviousId = cleanString(body.previousId, 120);
      const previousId = suppliedPreviousId || id;
      const duplicate = next.some((existing) => existing[idKey] === id && (!suppliedPreviousId || existing[idKey] !== suppliedPreviousId));
      if (duplicate) return NextResponse.json({ error: `An item with the id “${id}” already exists.` }, { status: 409 });
      const index = suppliedPreviousId ? next.findIndex((existing) => existing[idKey] === previousId) : -1;
      if (index >= 0) next[index] = item;
      else next.push(item);
    }

    next.sort((a, b) => number(a.sortOrder) - number(b.sortOrder));
    const label = entity === "projects" ? "project" : entity === "clients" ? "client / creator" : "testimonial";
    await writeRepoJson(paths[entity], next, `Dashboard: ${body.action === "delete" ? "remove" : "update"} ${label}`, sha);
    return NextResponse.json({ ok: true, data: next, deployTriggered: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not publish the change." }, { status: 500 });
  }
}
