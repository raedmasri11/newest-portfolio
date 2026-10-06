"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const clips = [
  { id: "me", label: "ME", start: 0, end: 0.22, kind: "profile" as const },
  { id: "long", label: "LONG-FORM", start: 0.22, end: 0.5, kind: "image" as const, src: "/thumbs/chatgpt.webp", title: "Documentary storytelling", meta: "16:9 · story-led" },
  { id: "short", label: "SHORT-FORM", start: 0.5, end: 0.74, kind: "image" as const, src: "/thumbs/joseph-editing.webp", title: "Personal-brand short-form", meta: "9:16 · social-first" },
  { id: "motion", label: "MOTION", start: 0.74, end: 1, kind: "image" as const, src: "/thumbs/hi-playing-with-motions.webp", title: "Motion inside the edit", meta: "After Effects · custom" },
] as const;

function formatTimecode(progress: number) {
  const fps = 24;
  const totalSeconds = 18;
  const totalFrames = Math.round(progress * totalSeconds * fps);
  const seconds = Math.floor(totalFrames / fps);
  const frames = totalFrames % fps;
  const hh = "00";
  const mm = "00";
  const ss = String(seconds).padStart(2, "0");
  const ff = String(frames).padStart(2, "0");
  return `${hh}:${mm}:${ss}:${ff}`;
}

export function HeroEditor() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.16);
  const [width, setWidth] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!timelineRef.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(timelineRef.current);
    return () => observer.disconnect();
  }, []);

  const active = useMemo(
    () => clips.find((clip, index) => progress >= clip.start && (progress < clip.end || index === clips.length - 1)) ?? clips[0],
    [progress]
  );

  const seekFromPointer = (clientX: number) => {
    const node = timelineRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setProgress(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    seekFromPointer(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) seekFromPointer(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const selectClip = (clip: (typeof clips)[number]) => setProgress((clip.start + clip.end) / 2);
  const playheadX = Math.max(0, Math.min(width - 1, width * progress));

  return (
    <div className="editor-shell" aria-label="Interactive video editing timeline">
      <div className={`editor-ambient editor-ambient-${active.id}`} aria-hidden="true" />
      <div className="editor-toolbar">
        <div className="editor-toolbar-title">
          <span className="editor-kicker">NOW EDITING</span>
          <strong>Raed Masri · Video Editor & Motion Designer</strong>
        </div>
        <div className="editor-time"><span className="editor-status-dot" /> <time>{formatTimecode(progress)}</time></div>
      </div>

      <div className="editor-monitor">
        {active.kind === "profile" ? (
          <div className="editor-profile-frame editor-profile-photo-frame">
            <Image
              src="/hero/raed-editor-workspace.webp"
              alt="Raed Masri working on a laptop in his video-editing workspace"
              fill
              priority
              sizes="(max-width: 980px) 92vw, 52vw"
              className="editor-profile-photo"
            />
            <div className="editor-profile-photo-shade" aria-hidden="true" />
          </div>
        ) : (
          <>
            <Image
              key={active.src}
              src={active.src}
              alt=""
              fill
              priority={false}
              sizes="(max-width: 980px) 92vw, 52vw"
              className={`editor-preview-image ${active.id === "short" ? "editor-preview-portrait" : ""}`}
            />
            <div className="monitor-scrim" />
            <div className="monitor-overlay">
              <span>{active.meta}</span>
              <strong>{active.title}</strong>
            </div>
          </>
        )}
      </div>

      <div className="editor-lower">
        <div className="editor-hint"><span>↔</span> Drag the playhead or tap a clip</div>
        <div
          ref={timelineRef}
          className={`interactive-timeline ${dragging ? "is-dragging" : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setDragging(false)}
        >
          <div className="timeline-ruler" aria-hidden="true">
            {Array.from({ length: 13 }).map((_, index) => <i key={index} />)}
          </div>
          <div className="timeline-clips">
            {clips.map((clip) => (
              <button
                key={clip.id}
                type="button"
                className={`editor-clip editor-clip-${clip.id} ${active.id === clip.id ? "is-active" : ""}`}
                style={{ width: `${(clip.end - clip.start) * 100}%` }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => selectClip(clip)}
                aria-pressed={active.id === clip.id}
              >
                <span>{clip.label}</span>
              </button>
            ))}
          </div>
          <div className="audio-lane" aria-hidden="true"><span>A1</span><i /><i /><i /><i /><i /><i /></div>
          <div className="timeline-playhead" style={{ transform: `translate3d(${playheadX}px,0,0)` }} aria-hidden="true"><span /></div>
        </div>
      </div>
    </div>
  );
}
