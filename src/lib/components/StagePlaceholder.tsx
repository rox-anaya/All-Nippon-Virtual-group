import Link from "next/link";
import { ArrowRight, Compass, Layers3 } from "lucide-react";

export function StagePlaceholder({
  title,
  description,
  currentPath,
}: {
  title: string;
  description: string;
  currentPath: string;
}) {
  return (
    <section className="page-container stage-page" data-current-path={currentPath}>
      <div className="page-heading">
        <span className="eyebrow"><span className="eyebrow-line" /> ALL NIPPON VIRTUAL GROUP</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="foundation-card glass-panel">
        <div className="foundation-icon"><Layers3 size={22} /></div>
        <div className="foundation-card-copy">
          <span className="eyebrow">STAGED IMPLEMENTATION</span>
          <h2>This page is reserved in the ANVG foundation.</h2>
          <p>
            The shared navigation, visual system, Supabase architecture and protected administration
            entry point are being established first. This page’s full content and editing tools will
            be implemented in its dedicated build stage.
          </p>
          <Link href="/" className="text-link">Return to Flight Deck <ArrowRight size={16} /></Link>
        </div>
        <Compass className="foundation-watermark" size={110} strokeWidth={0.8} />
      </div>
      <p className="stage-note">Stage 1 / Shared foundation · Page content not yet implemented</p>
    </section>
  );
}
