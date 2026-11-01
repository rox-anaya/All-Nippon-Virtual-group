"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plane } from "lucide-react";

export type ShowcaseSlide = {
  id: string;
  title: string;
  image_url: string;
  alt_text: string;
  object_position?: string;
};

export function HomeCarousel({ slides }: { slides: ShowcaseSlide[] }) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = slides.length;

  useEffect(() => {
    setIndex((current) => (total ? current % total : 0));
  }, [total]);

  useEffect(() => {
    if (total < 2) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [total]);

  useEffect(() => setFailed(false), [index]);

  function previous() {
    setIndex((current) => (current - 1 + total) % total);
  }
  function next() {
    setIndex((current) => (current + 1) % total);
  }

  const current = slides[index];

  return (
    <div
      className="home-carousel"
      onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX;
        if (start !== null && end !== undefined && Math.abs(end - start) > 45) {
          if (end < start) next(); else previous();
        }
        touchStartX.current = null;
      }}
    >
      <div className="carousel-stage">
        {current && !failed ? (
          <img
            key={current.id}
            src={current.image_url}
            alt={current.alt_text || current.title || "ANVG aircraft showcase"}
            className="carousel-image"
            style={{ objectPosition: current.object_position || "center" }}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="carousel-fallback"><Plane size={32} /><span>ANVG Fleet Showcase</span></div>
        )}
        {total > 1 ? (
          <>
            <button type="button" className="carousel-control carousel-prev" aria-label="Previous showcase image" onClick={previous}><ChevronLeft size={20} /></button>
            <button type="button" className="carousel-control carousel-next" aria-label="Next showcase image" onClick={next}><ChevronRight size={20} /></button>
          </>
        ) : null}
        <div className="carousel-count">{total ? String(index + 1).padStart(2, "0") : "00"} <span>/ {String(total).padStart(2, "0")}</span></div>
      </div>
      <div className="carousel-caption-row">
        <span>{current?.title || "ANVG Fleet"}</span>
        <div className="carousel-dots" aria-label="Choose showcase image">
          {slides.map((slide, dotIndex) => (
            <button
              key={slide.id}
              type="button"
              className={`carousel-dot ${dotIndex === index ? "is-active" : ""}`}
              aria-label={`Show image ${dotIndex + 1}`}
              aria-pressed={dotIndex === index}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
