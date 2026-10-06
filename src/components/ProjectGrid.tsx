"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Project, ProjectFormat, ProjectLanguage } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectLanguageFilter, useProjectLanguage } from "./ProjectLanguageFilter";
import { VideoModal } from "./VideoModal";

type Filter = "all" | ProjectFormat;
type Variant = "grid" | "carousel";

const carouselLabels: Record<ProjectFormat, string> = {
  "long-form": "Long-form",
  "short-form": "Short-form",
  motion: "Motion",
};

function getCardsPerPage(width: number) {
  if (width <= 680) return 1;
  if (width <= 980) return 2;
  return 4;
}

function emptyMessage(language: ProjectLanguage) {
  return language === "ar"
    ? "No Arabic projects in this category yet."
    : "No English projects in this category yet.";
}

export function ProjectGrid({
  projects,
  showFilters = false,
  showLanguageFilter = false,
  variant = "grid",
}: {
  projects: Project[];
  showFilters?: boolean;
  showLanguageFilter?: boolean;
  variant?: Variant;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [language, setLanguage] = useProjectLanguage();
  const [video, setVideo] = useState<Project | null>(null);
  const [page, setPage] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const filtered = useMemo(() => {
    const byLanguage = showLanguageFilter
      ? projects.filter((project) => project.language === language)
      : projects;

    return filter === "all"
      ? byLanguage
      : byLanguage.filter((project) => project.format === filter);
  }, [projects, filter, language, showLanguageFilter]);

  useEffect(() => {
    if (variant !== "carousel") return;
    const node = viewportRef.current;
    if (!node) return;
    const update = () => setViewportWidth(node.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [variant]);

  const cardsPerPage = getCardsPerPage(viewportWidth || 1200);
  const pageCount = Math.max(1, Math.ceil(filtered.length / cardsPerPage));

  useEffect(() => {
    setPage(0);
  }, [filter, language, cardsPerPage]);

  useEffect(() => {
    if (page > pageCount - 1) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  const changeLanguage = (next: ProjectLanguage) => {
    setPage(0);
    setLanguage(next);
  };

  if (variant === "carousel") {
    const mobile = viewportWidth > 0 && viewportWidth <= 680;
    const gap = mobile ? 14 : 16;
    const cardWidth = viewportWidth
      ? mobile
        ? viewportWidth * 0.84
        : (viewportWidth - gap * (cardsPerPage - 1)) / cardsPerPage
      : 0;
    const groupStep = cardsPerPage * (cardWidth + gap);
    const contentWidth = filtered.length > 0 ? filtered.length * (cardWidth + gap) - gap : 0;
    const maxOffset = Math.max(0, contentWidth - viewportWidth);
    const targetOffset = Math.min(page * groupStep, maxOffset);

    const goTo = (nextPage: number) => {
      setPage(Math.max(0, Math.min(nextPage, pageCount - 1)));
    };

    const setCategory = (next: ProjectFormat) => {
      setPage(0);
      // Clicking the current category again returns to the curated mixed selection.
      setFilter((current) => (current === next ? "all" : next));
    };

    return (
      <>
        <div className="project-carousel" aria-label="Selected portfolio projects">
          <div className="project-carousel-toolbar">
            {showLanguageFilter && (
              <ProjectLanguageFilter value={language} onChange={changeLanguage} />
            )}
            <div className="project-carousel-arrows" aria-label="Project carousel controls">
              <button
                type="button"
                onClick={() => goTo(page - 1)}
                disabled={filtered.length === 0 || page === 0}
                aria-label="Previous projects"
              >
                <svg className="project-carousel-arrow-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.5 12h-13M10.5 7 5.5 12l5 5" /></svg>
              </button>
              <button
                type="button"
                onClick={() => goTo(page + 1)}
                disabled={filtered.length === 0 || page >= pageCount - 1}
                aria-label="Next projects"
              >
                <svg className="project-carousel-arrow-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5.5 12h13M13.5 7l5 5-5 5" /></svg>
              </button>
            </div>
          </div>

          <div className="project-carousel-viewport" ref={viewportRef}>
            {filtered.length > 0 ? (
              <motion.div
                className="project-carousel-track"
                animate={{ x: -targetOffset }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                drag={mobile ? "x" : false}
                dragConstraints={{ left: -maxOffset, right: 0 }}
                dragElastic={0.06}
                dragMomentum={false}
                onDragEnd={(_, info) => {
                  if (!mobile) return;
                  if (info.offset.x < -48 || info.velocity.x < -420) goTo(page + 1);
                  else if (info.offset.x > 48 || info.velocity.x > 420) goTo(page - 1);
                }}
              >
                {filtered.map((project) => (
                  <div
                    className="project-carousel-item"
                    key={project.slug}
                    style={cardWidth ? { width: cardWidth } : undefined}
                  >
                    <ProjectCard project={project} onPlay={() => setVideo(project)} compact />
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="project-language-empty" role="status">
                {emptyMessage(language)}
              </div>
            )}
          </div>

          <div className="project-carousel-footer">
            {filtered.length > 0 && (
              <div className="project-carousel-pagination" aria-label="Project groups">
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={index === page ? "is-active" : ""}
                    aria-label={`Go to project group ${index + 1}`}
                    aria-current={index === page ? "true" : undefined}
                    onClick={() => goTo(index)}
                  >
                    <span aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}

            <div className="project-carousel-categories" aria-label="Browse project categories">
              <span>Browse every project:</span>
              {(Object.keys(carouselLabels) as ProjectFormat[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={filter === item ? "is-active" : ""}
                  aria-pressed={filter === item}
                  onClick={() => setCategory(item)}
                >
                  {carouselLabels[item]}
                </button>
              ))}
            </div>
          </div>

          <span className="sr-only" aria-live="polite">
            {filtered.length > 0
              ? `Showing ${language === "ar" ? "Arabic" : "English"} project group ${page + 1} of ${pageCount}`
              : emptyMessage(language)}
          </span>
        </div>

        <VideoModal
          url={video?.videoUrl ?? null}
          aspect={video?.aspect ?? "16:9"}
          title={video?.title ?? ""}
          subtitle={video ? `${video.client} · ${video.format.replace("-", " ")}` : ""}
          onClose={() => setVideo(null)}
        />
      </>
    );
  }

  return (
    <>
      {showLanguageFilter && (
        <div className="project-grid-language-toolbar">
          <ProjectLanguageFilter value={language} onChange={changeLanguage} />
        </div>
      )}
      {showFilters && (
        <div className="project-filters" aria-label="Filter projects">
          {(["all", "long-form", "short-form", "motion"] as Filter[]).map((item) => (
            <button key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)} type="button">
              {item === "all" ? "All" : item === "long-form" ? "Long-form" : item === "short-form" ? "Short-form" : "Motion"}
            </button>
          ))}
        </div>
      )}
      {filtered.length > 0 ? (
        <motion.div layout className="projects-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div layout key={project.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProjectCard project={project} onPlay={() => setVideo(project)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="project-language-empty project-language-empty-grid" role="status">
          {emptyMessage(language)}
        </div>
      )}
      <VideoModal url={video?.videoUrl ?? null} aspect={video?.aspect ?? "16:9"} title={video?.title ?? ""} subtitle={video ? `${video.client} · ${video.format.replace("-", " ")}` : ""} onClose={() => setVideo(null)} />
    </>
  );
}
