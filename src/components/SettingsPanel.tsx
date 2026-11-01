"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw, SlidersHorizontal, Type } from "lucide-react";

type ThemeOption = { id: string; name: string; description: string; swatches: string[] };
type FontOption = { id: string; name: string; sample: string };
const themes: ThemeOption[] = [
  { id: "midnight-aviation", name: "Midnight Aviation", description: "The original ANVG dark navy look.", swatches: ["#06111f", "#102b47", "#7fc2ff"] },
  { id: "ana-blue", name: "ANA Blue", description: "A brighter aviation blue palette.", swatches: ["#071b35", "#12365c", "#a9d7ff"] },
  { id: "sakura-night", name: "Sakura Night", description: "A restrained violet night theme.", swatches: ["#171225", "#302341", "#c8b4ef"] },
  { id: "imperial-red", name: "Imperial Red", description: "Cool charcoal with red accents.", swatches: ["#101322", "#252a3e", "#d65c68"] },
  { id: "arctic-silver", name: "Arctic Silver", description: "A cool silver-blue atmosphere.", swatches: ["#101a27", "#334354", "#c3d8ef"] },
  { id: "emerald-flight", name: "Emerald Flight", description: "Deep green with soft mint accents.", swatches: ["#071a19", "#143932", "#a7d7c6"] },
  { id: "oceanic-blue", name: "Oceanic Blue", description: "A deep ocean-inspired palette.", swatches: ["#041825", "#0b3449", "#8ce0f5"] },
  { id: "champagne-gold", name: "Champagne Gold", description: "Warm dark tones with gold accents.", swatches: ["#171512", "#393124", "#e4c887"] },
];
const fonts: FontOption[] = [
  { id: "inter", name: "Inter", sample: "Clear and modern" },
  { id: "manrope", name: "Manrope", sample: "Soft geometric style" },
  { id: "poppins", name: "Poppins", sample: "Rounded and friendly" },
  { id: "montserrat", name: "Montserrat", sample: "Structured and editorial" },
  { id: "roboto", name: "Roboto", sample: "Neutral and familiar" },
  { id: "nunito-sans", name: "Nunito Sans", sample: "Open and approachable" },
];

export function SettingsPanel() {
  const [theme, setTheme] = useState("midnight-aviation");
  const [font, setFont] = useState("inter");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("anvg-preferences") || "{}");
      const nextTheme = themes.some((item) => item.id === stored.theme) ? stored.theme : "midnight-aviation";
      const nextFont = fonts.some((item) => item.id === stored.font) ? stored.font : "inter";
      setTheme(nextTheme);
      setFont(nextFont);
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.dataset.font = nextFont;
    } catch {
      document.documentElement.dataset.theme = "midnight-aviation";
      document.documentElement.dataset.font = "inter";
    }
  }, []);

  function updateTheme(value: string) {
    setTheme(value);
    document.documentElement.dataset.theme = value;
    localStorage.setItem("anvg-preferences", JSON.stringify({ theme: value, font }));
    setSaved(false);
  }
  function updateFont(value: string) {
    setFont(value);
    document.documentElement.dataset.font = value;
    localStorage.setItem("anvg-preferences", JSON.stringify({ theme, font: value }));
    setSaved(false);
  }
  function reset() {
    setTheme("midnight-aviation");
    setFont("inter");
    document.documentElement.dataset.theme = "midnight-aviation";
    document.documentElement.dataset.font = "inter";
    localStorage.setItem("anvg-preferences", JSON.stringify({ theme: "midnight-aviation", font: "inter" }));
    setSaved(true);
  }
  function save() {
    localStorage.setItem("anvg-preferences", JSON.stringify({ theme, font }));
    setSaved(true);
  }

  return (
    <div className="settings-panel-wrap">
      <section className="settings-section">
        <div className="home-section-heading"><div><span className="eyebrow">APPEARANCE / 01</span><h2><SlidersHorizontal size={20}/> Colour theme</h2></div><span className="section-index">{themes.length} THEMES</span></div>
        <div className="settings-theme-grid">{themes.map((item) => <button type="button" key={item.id} className={`settings-theme-card glass-panel ${theme === item.id ? "is-selected" : ""}`} onClick={() => updateTheme(item.id)} aria-pressed={theme === item.id}><span className="settings-swatches">{item.swatches.map((swatch) => <i key={swatch} style={{ background: swatch }}/>)}</span><span className="settings-theme-copy"><strong>{item.name}</strong><small>{item.description}</small></span><span className="settings-check">{theme === item.id ? <Check size={16}/> : null}</span></button>)}</div>
      </section>
      <section className="settings-section">
        <div className="home-section-heading"><div><span className="eyebrow">TYPOGRAPHY / 02</span><h2><Type size={20}/> Font family</h2></div><span className="section-index">{fonts.length} FONTS</span></div>
        <div className="settings-font-list">{fonts.map((item) => <button type="button" key={item.id} className={`settings-font-option glass-panel ${font === item.id ? "is-selected" : ""}`} onClick={() => updateFont(item.id)} aria-pressed={font === item.id}><span><strong>{item.name}</strong><small>{item.sample}</small></span><span className="settings-font-sample" style={{ fontFamily: ({ inter: "Inter", manrope: "Manrope", poppins: "Poppins", montserrat: "Montserrat", roboto: "Roboto", "nunito-sans": "Nunito Sans" } as Record<string, string>)[item.id] }}>{"Aa"}</span>{font === item.id ? <Check size={16}/> : null}</button>)}</div>
      </section>
      <div className="settings-actions"><span className="settings-save-status" aria-live="polite">{saved ? "Preferences saved on this device." : "Changes are previewed immediately and stored on this device."}</span><button type="button" className="quiet-button settings-reset-button" onClick={reset}><RotateCcw size={14}/> Reset defaults</button><button type="button" className="primary-button settings-save-button" onClick={save}>Save preferences <Check size={15}/></button></div>
    </div>
  );
}
