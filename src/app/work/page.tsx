import type { Metadata } from "next";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";
export const metadata: Metadata = { title: "Selected Video Editing Work", alternates: { canonical: "/work" }, description: "Selected client work, concept projects, editing tests and motion-design work by Raed Masri." };
export default function WorkPage() { return <main className="work-main"><section className="page-hero work-page-hero page-container"><Reveal><p className="eyebrow">Selected work</p><h1>Client work, concept projects and editing tests — clearly labeled.</h1><p className="service-lead">Find the format closest to what you need, then judge the storytelling, pacing and polish for yourself. Every project is clearly labeled.</p></Reveal></section><section className="section page-container"><ProjectGrid projects={projects} showFilters /></section></main>; }
