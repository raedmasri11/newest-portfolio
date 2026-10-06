import projectData from "./content/projects.json";

export type ProjectType = "client" | "concept" | "test";
export type ProjectFormat = "long-form" | "short-form" | "motion";
export type ProjectLanguage = "en" | "ar";

export const projectLanguageLabels: Record<ProjectLanguage, string> = {
  en: "English",
  ar: "Arabic / Darija",
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  type: ProjectType;
  format: ProjectFormat;
  language: ProjectLanguage;
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

const allProjects = (projectData as Project[])
  .slice()
  .sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999));

export const projects = allProjects.filter((project) => project.published !== false);
export const featuredProjects = projects.filter((project) => project.featured);

export function getProjectsByFormat(format: ProjectFormat) {
  return projects.filter((project) => project.format === format);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
