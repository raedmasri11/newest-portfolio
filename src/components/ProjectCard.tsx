"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Project } from "@/data/projects";

const typeLabel = {
  client: "Client work",
  concept: "Concept project",
  test: "Editing test",
} as const;

const formatLabel = {
  "long-form": "Long-form",
  "short-form": "Short-form",
  motion: "Motion",
} as const;

export function ProjectCard({
  project,
  onPlay,
  compact = false,
}: {
  project: Project;
  onPlay: (url: string, aspect: Project["aspect"]) => void;
  compact?: boolean;
}) {
  const play = () => {
    if (project.videoUrl) onPlay(project.videoUrl, project.aspect);
    else if (project.externalUrl) window.open(project.externalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.article
      className={`project-card format-${project.format} type-${project.type} aspect-${project.aspect.replace(":", "x")} ${compact ? "project-card-compact" : ""}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <button type="button" className="project-media" onClick={play} aria-label={`View ${project.title}`}>
        {project.thumbnail ? (
          <Image src={project.thumbnail} alt="" fill sizes={compact ? "(max-width: 680px) 84vw, (max-width: 980px) 48vw, 25vw" : "(max-width: 768px) 100vw, 50vw"} className="project-image" />
        ) : (
          <div className={`project-placeholder placeholder-${project.format}`}>
            <span>{project.client}</span>
            <strong>{project.comingSoon ? "Preview coming soon" : project.title}</strong>
          </div>
        )}
        <span className="project-type">{typeLabel[project.type]}</span>
        {project.comingSoon ? <span className="coming-soon">Coming soon</span> : <>
          <span className="play-badge" aria-hidden="true">▶</span>
          {project.videoUrl && <span className="project-play-hover" aria-hidden="true">▶ &nbsp;Play{project.duration ? ` · ${project.duration}` : ""}</span>}
          {!project.videoUrl && project.externalUrl?.includes("instagram.com/p/") && (
            <span className="project-play-hover" aria-hidden="true">Watch on Instagram ↗</span>
          )}
        </>}
      </button>

      {compact ? (
        <div className="project-copy project-copy-compact">
          <h3>{project.title}</h3>
          <p>{project.client} · {formatLabel[project.format]}</p>
        </div>
      ) : (
        <>
          <div className="project-copy">
            <div>
              <p>{project.client}</p>
              <h3>{project.title}</h3>
            </div>
            <div className="project-meta">
              <span>{project.aspect}</span>
              {project.language && <span>{project.language}</span>}
            </div>
          </div>
          <Link className="project-detail-link" href={`/work/${project.slug}`}>Project details →</Link>
        </>
      )}
    </motion.article>
  );
}
