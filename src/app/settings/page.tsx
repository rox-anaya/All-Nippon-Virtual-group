import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { SettingsPanel } from "@/components/SettingsPanel";

export const metadata: Metadata = { title: "Appearance Settings | ANVG", description: "Personalise the ANVG website theme and typography on this device." };

export default function SettingsPage() {
  return (
    <PublicLayout currentPath="/settings">
      <div className="page-container stage-page content-page settings-page">
        <header className="page-heading"><span className="eyebrow"><span className="eyebrow-line" /> ANVG / PERSONAL PREFERENCES</span><h1>Your flight deck, <span className="settings-title-accent">your style.</span></h1><p>Personalise the appearance of the ANVG website. Your choices are saved locally on this device and do not change the experience for other visitors.</p></header>
        <SettingsPanel />
      </div>
    </PublicLayout>
  );
}
