import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
const base = "https://raedmasri.me";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/long-form", "/short-form", "/motion-design", "/reviews", "/request-project"];
  return [...pages.map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : .8 })), ...projects.map((project) => ({ url: `${base}/work/${project.slug}`, changeFrequency: "yearly" as const, priority: .6 }))];
}
