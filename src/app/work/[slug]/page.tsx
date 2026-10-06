import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.description, alternates: { canonical: `/work/${project.slug}` } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <main className={`project-main project-main-${project.format}`}><section className="project-page page-container"><div className="project-page-copy"><p className="eyebrow">{project.type === "client" ? "Client work" : project.type === "test" ? "Editing test" : "Concept project"}</p><h1>{project.title}</h1><p className="service-lead">{project.description}</p><div className="project-facts"><div><span>Client / context</span><strong>{project.client}</strong></div><div><span>Format</span><strong>{project.format} · {project.aspect}</strong></div><div><span>Language</span><strong>{project.language ?? "English"}</strong></div></div><div className="tag-row">{project.role.map((role) => <span key={role}>{role}</span>)}</div><div className="hero-actions">{project.videoUrl && <a className="button button-dark" href={project.videoUrl} target="_blank" rel="noreferrer">Watch video ↗</a>}{project.externalUrl && <a className="button button-dark" href={project.externalUrl} target="_blank" rel="noreferrer">Open project ↗</a>}<Link className="button button-ghost" href="/work">Back to work</Link></div></div><div className="project-page-visual">{project.thumbnail ? <Image src={project.thumbnail} alt={`${project.title} thumbnail`} fill sizes="(max-width: 900px) 100vw, 50vw" /> : <div className={`project-placeholder placeholder-${project.format}`}><span>{project.client}</span><strong>{project.comingSoon ? "Full case study coming after launch" : project.title}</strong></div>}</div></section><section className="section page-container case-study"><div><p className="eyebrow">Approach</p><h2>The edit is built around comprehension first, then momentum.</h2></div><div><p>For client work, this page will grow into a full case study once we have the final public video, project context and performance or client-result information. Concept pieces remain clearly marked so the portfolio never implies a client relationship that didn’t happen.</p></div></section></main>;
}
