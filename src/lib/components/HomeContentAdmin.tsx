"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Save, Trash2, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ShowcaseSlide } from "@/components/HomeCarousel";

type Metric = { id: string; metric_key: string; label: string; value: string; display_order: number };
type HomeSettings = {
  site_name: string;
  tagline: string;
  home_hero_label: string;
  home_hero_image_url: string;
  brand_logo_url: string;
  home_hero_alt_text: string;
  mission_text: string;
  ceo_message: string;
  ceo_name: string;
  ceo_role: string;
  footer_waypoints_url: string;
  footer_instagram_url: string;
  footer_youtube_url: string;
  footer_vk_url: string;
  footer_disclaimer: string;
  footer_regional_credit: string;
  menu_powered_by: string;
  menu_developer_name: string;
  menu_button_label: string;
  menu_button_url: string;
};

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

async function uploadImage(file: File, folder: string): Promise<string> {
  const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
  if (!allowedImageTypes.has(file.type)) throw new Error("Choose a JPEG, PNG, WebP, AVIF or GIF image.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("This image is larger than the 20 MB upload limit.");
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const objectPath = `${folder}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from("site-media").upload(objectPath, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from("site-media").getPublicUrl(objectPath).data.publicUrl;
}

async function removeManagedStorageImage(url: string) {
  const marker = "/storage/v1/object/public/site-media/";
  const at = url.indexOf(marker);
  if (at < 0) return;
  const objectPath = decodeURIComponent(url.slice(at + marker.length));
  const supabase = createClient();
  if (supabase) await supabase.storage.from("site-media").remove([objectPath]);
}

export function HomeContentAdmin({
  initialSettings,
  initialMetrics,
  initialSlides,
}: {
  initialSettings: HomeSettings;
  initialMetrics: Metric[];
  initialSlides: ShowcaseSlide[];
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [slides, setSlides] = useState(initialSlides);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  function updateSetting<K extends keyof HomeSettings>(key: K, value: HomeSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function saveSettings() {
    const externalUrls = [
      settings.footer_waypoints_url,
      settings.footer_instagram_url,
      settings.footer_youtube_url,
      settings.footer_vk_url,
      settings.menu_button_url,
    ].filter((value) => value.trim().length > 0);
    const invalidUrl = externalUrls.some((value) => {
      try { return new URL(value).protocol !== "https:"; }
      catch { return true; }
    });
    if (invalidUrl) return setNotice("Community and menu destinations must be valid HTTPS URLs.");

    const supabase = createClient();
    if (!supabase) return setNotice("Supabase is not configured.");
    setBusy(true);
    setNotice("");
    const { error } = await supabase.from("site_settings").update(settings).eq("id", true);
    setBusy(false);
    setNotice(error ? `Could not save site content: ${error.message}` : "Home text and image settings saved.");
  }

  async function saveMetrics() {
    const invalidMetric = metrics.find((metric) => !/^\d[\d,]*(?:\.\d+)?$/.test(metric.value.trim()));
    if (invalidMetric) return setNotice(`Enter a numerical value for “${invalidMetric.label}”.`);
    const supabase = createClient();
    if (!supabase) return setNotice("Supabase is not configured.");
    setBusy(true);
    setNotice("");
    const results = await Promise.all(metrics.map((metric, order) =>
      supabase.from("home_statistics").update({ label: metric.label, value: metric.value, display_order: order + 1 }).eq("id", metric.id),
    ));
    setBusy(false);
    const problem = results.find((result) => result.error)?.error;
    setNotice(problem ? `Could not save a statistic: ${problem.message}` : "Home statistics saved.");
  }

  async function addMetric() {
    const supabase = createClient();
    if (!supabase) return setNotice("Supabase is not configured.");
    const metric = {
      metric_key: `custom_${crypto.randomUUID()}`,
      label: "New statistic",
      value: "0",
      display_order: metrics.length + 1,
      is_published: true,
      is_active: true,
    };
    const { data, error } = await supabase.from("home_statistics").insert(metric).select("id, metric_key, label, value, display_order").single();
    if (error) return setNotice(`Could not add statistic: ${error.message}`);
    setMetrics((current) => [...current, data as Metric]);
    setNotice("Statistic added.");
  }

  async function removeMetric(id: string) {
    if (!window.confirm("Delete this statistic? This cannot be undone.")) return;
    const supabase = createClient();
    if (!supabase) return setNotice("Supabase is not configured.");
    const { error } = await supabase.from("home_statistics").delete().eq("id", id);
    if (error) return setNotice(`Could not delete statistic: ${error.message}`);
    setMetrics((current) => current.filter((item) => item.id !== id));
    setNotice("Statistic deleted.");
  }

  async function moveMetric(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= metrics.length) return;
    const reordered = [...metrics];
    [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
    setMetrics(reordered);
    const supabase = createClient();
    if (!supabase) return setNotice("Supabase is not configured.");
    const results = await Promise.all(reordered.map((metric, order) => supabase.from("home_statistics").update({ display_order: order + 1 }).eq("id", metric.id)));
    const problem = results.find((result) => result.error)?.error;
    setNotice(problem ? `Could not save statistic order: ${problem.message}` : "Statistic order saved.");
  }

  async function handleHeroUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setNotice("Uploading hero image…");
    try {
      const url = await uploadImage(file, "home/hero");
      updateSetting("home_hero_image_url", url);
      setNotice("Hero image uploaded. Save Home settings to publish the new image.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setNotice("Uploading logo…");
    try {
      const url = await uploadImage(file, "brand/logo");
      updateSetting("brand_logo_url", url);
      setNotice("Logo uploaded. Save Home settings to store it.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Logo upload failed.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function handleShowcaseUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setNotice("Uploading showcase image…");
    try {
      const url = await uploadImage(file, "home/showcase");
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase is not configured.");
      const order = slides.length + 1;
      const { data, error } = await supabase.from("home_showcase").insert({
        title: file.name.replace(/\.[^.]+$/, ""),
        image_url: url,
        alt_text: "ANVG aircraft fleet showcase",
        display_order: order,
        is_published: true,
        is_active: true,
      }).select("id, title, image_url, alt_text, object_position").single();
      if (error) throw error;
      setSlides((current) => [...current, data as ShowcaseSlide]);
      setNotice("Showcase image added and published.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Showcase upload failed.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function replaceSlideImage(slide: ShowcaseSlide, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setNotice("Uploading replacement showcase image…");
    try {
      const url = await uploadImage(file, "home/showcase");
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase is not configured.");
      const { error } = await supabase.from("home_showcase").update({ image_url: url, title: file.name.replace(/\.[^.]+$/, "") }).eq("id", slide.id);
      if (error) throw error;
      await removeManagedStorageImage(slide.image_url);
      setSlides((current) => current.map((item) => item.id === slide.id ? { ...item, image_url: url, title: file.name.replace(/\.[^.]+$/, "") } : item));
      setNotice("Showcase image replaced.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Showcase image replacement failed.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function removeSlide(slide: ShowcaseSlide) {
    if (!window.confirm("Remove this image from the Home showcase? This cannot be undone.")) return;
    const supabase = createClient();
    if (!supabase) return setNotice("Supabase is not configured.");
    const { error } = await supabase.from("home_showcase").delete().eq("id", slide.id);
    if (error) return setNotice(`Could not remove image: ${error.message}`);
    await removeManagedStorageImage(slide.image_url);
    setSlides((current) => current.filter((item) => item.id !== slide.id));
    setNotice("Showcase image removed.");
  }

  async function moveSlide(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= slides.length) return;
    const reordered = [...slides];
    [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
    setSlides(reordered);
    const supabase = createClient();
    if (!supabase) return setNotice("Supabase is not configured.");
    const results = await Promise.all(reordered.map((slide, order) => supabase.from("home_showcase").update({ display_order: order + 1 }).eq("id", slide.id)));
    const problem = results.find((result) => result.error)?.error;
    setNotice(problem ? `Could not save showcase order: ${problem.message}` : "Showcase order saved.");
  }

  return (
    <div className="home-admin-content">
      <div className="admin-subnav"><Link href="/admin/dashboard"><ArrowLeft size={15} /> Admin overview</Link><span>HOME PAGE MANAGEMENT</span></div>
      <div className="admin-section-heading home-admin-heading"><div><span className="eyebrow">PUBLIC CONTENT / HOME</span><h2>Home page settings</h2></div><span className="admin-section-meta">Changes are saved to Supabase</span></div>
      <section className="glass-panel home-admin-panel">
        <h3>Hero and brand images</h3>
        <div className="home-admin-two-col">
          <div><label className="admin-field-label">Hero title / group name</label><input className="admin-text-input" value={settings.site_name} onChange={(event) => updateSetting("site_name", event.target.value)} /></div>
          <div><label className="admin-field-label">Hero tagline</label><input className="admin-text-input" value={settings.tagline} onChange={(event) => updateSetting("tagline", event.target.value)} /></div>
        </div>
        <label className="admin-field-label">Small hero label</label>
        <input className="admin-text-input" value={settings.home_hero_label} onChange={(event) => updateSetting("home_hero_label", event.target.value)} />
        <div className="home-admin-image-grid">
          <div className="home-admin-image-field">
            <span className="field-title">Home foreground image</span>
            <div className="admin-image-preview hero-preview"><img src={settings.home_hero_image_url} alt="Home hero preview" /></div>
            <label className="upload-control"><UploadCloud size={15} /> Upload replacement<input type="file" accept="image/*" onChange={handleHeroUpload} disabled={busy} /></label>
            <label className="admin-field-label">Image URL</label>
            <input className="admin-text-input" value={settings.home_hero_image_url} onChange={(event) => updateSetting("home_hero_image_url", event.target.value)} />
            <label className="admin-field-label">Alternative text</label>
            <input className="admin-text-input" value={settings.home_hero_alt_text} onChange={(event) => updateSetting("home_hero_alt_text", event.target.value)} />
          </div>
          <div className="home-admin-image-field">
            <span className="field-title">Header logo</span>
            <div className="admin-image-preview logo-preview"><img src={settings.brand_logo_url} alt="Brand logo preview" /></div>
            <label className="upload-control"><UploadCloud size={15} /> Upload logo<input type="file" accept="image/*" onChange={handleLogoUpload} disabled={busy} /></label>
            <label className="admin-field-label">Logo URL</label>
            <input className="admin-text-input" value={settings.brand_logo_url} onChange={(event) => updateSetting("brand_logo_url", event.target.value)} />
            <p className="field-hint">The logo is displayed with contain sizing to preserve its original proportions.</p>
          </div>
        </div>
      </section>

      <section className="glass-panel home-admin-panel">
        <h3>Mission and CEO message</h3>
        <label className="admin-field-label">Our Mission</label>
        <textarea className="admin-textarea" rows={4} value={settings.mission_text} onChange={(event) => updateSetting("mission_text", event.target.value)} />
        <label className="admin-field-label">CEO message</label>
        <textarea className="admin-textarea" rows={4} value={settings.ceo_message} onChange={(event) => updateSetting("ceo_message", event.target.value)} />
        <div className="home-admin-two-col">
          <div><label className="admin-field-label">CEO name</label><input className="admin-text-input" value={settings.ceo_name} onChange={(event) => updateSetting("ceo_name", event.target.value)} /></div>
          <div><label className="admin-field-label">CEO role</label><input className="admin-text-input" value={settings.ceo_role} onChange={(event) => updateSetting("ceo_role", event.target.value)} /></div>
        </div>
      </section>

      <section className="glass-panel home-admin-panel">
        <h3>Community links and menu credit</h3>
        <div className="home-admin-two-col">
          <div><label className="admin-field-label">Waypoints Portal URL</label><input className="admin-text-input" type="url" value={settings.footer_waypoints_url} onChange={(event) => updateSetting("footer_waypoints_url", event.target.value)} /></div>
          <div><label className="admin-field-label">Instagram URL</label><input className="admin-text-input" type="url" value={settings.footer_instagram_url} onChange={(event) => updateSetting("footer_instagram_url", event.target.value)} placeholder="Leave blank to hide" /></div>
          <div><label className="admin-field-label">YouTube URL</label><input className="admin-text-input" type="url" value={settings.footer_youtube_url} onChange={(event) => updateSetting("footer_youtube_url", event.target.value)} /></div>
          <div><label className="admin-field-label">VK URL</label><input className="admin-text-input" type="url" value={settings.footer_vk_url} onChange={(event) => updateSetting("footer_vk_url", event.target.value)} placeholder="Leave blank to hide" /></div>
          <div><label className="admin-field-label">Menu credit top label</label><input className="admin-text-input" value={settings.menu_powered_by} onChange={(event) => updateSetting("menu_powered_by", event.target.value)} /></div>
          <div><label className="admin-field-label">Developer name</label><input className="admin-text-input" value={settings.menu_developer_name} onChange={(event) => updateSetting("menu_developer_name", event.target.value)} /></div>
          <div><label className="admin-field-label">Menu button label</label><input className="admin-text-input" value={settings.menu_button_label} onChange={(event) => updateSetting("menu_button_label", event.target.value)} /></div>
          <div><label className="admin-field-label">Menu button destination URL</label><input className="admin-text-input" type="url" value={settings.menu_button_url} onChange={(event) => updateSetting("menu_button_url", event.target.value)} placeholder="Developer IFC profile URL" /></div>
        </div>
        <label className="admin-field-label">Footer disclaimer</label>
        <textarea className="admin-textarea" rows={3} value={settings.footer_disclaimer} onChange={(event) => updateSetting("footer_disclaimer", event.target.value)} />
        <label className="admin-field-label">Footer regional credit</label>
        <input className="admin-text-input" value={settings.footer_regional_credit} onChange={(event) => updateSetting("footer_regional_credit", event.target.value)} />
      </section>

      <section className="glass-panel home-admin-panel">
        <div className="admin-panel-title-row"><h3>Home statistics</h3><button type="button" className="small-outline-button" onClick={addMetric}>+ Add metric</button></div>
        <p className="field-hint">Values are informational only; these are not clickable controls.</p>
        <div className="metric-editor-list">
          {metrics.map((metric, index) => (
            <div className="metric-editor-row" key={metric.id}>
              <div className="metric-editor-order"><button type="button" aria-label="Move statistic up" disabled={index === 0} onClick={() => moveMetric(index, -1)}><ArrowUp size={14} /></button><button type="button" aria-label="Move statistic down" disabled={index === metrics.length - 1} onClick={() => moveMetric(index, 1)}><ArrowDown size={14} /></button></div>
              <input aria-label="Statistic name" className="admin-text-input" value={metric.label} onChange={(event) => setMetrics((current) => current.map((item) => item.id === metric.id ? { ...item, label: event.target.value } : item))} />
              <input aria-label="Statistic numerical value" className="admin-text-input metric-value-input" inputMode="decimal" pattern="[0-9][0-9,.]*" value={metric.value} onChange={(event) => setMetrics((current) => current.map((item) => item.id === metric.id ? { ...item, value: event.target.value } : item))} />
              <button type="button" className="delete-icon-button" aria-label={`Delete ${metric.label}`} onClick={() => removeMetric(metric.id)}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
        <button className="primary-button admin-save-button" type="button" onClick={saveMetrics} disabled={busy}><Save size={15} /> Save statistics</button>
      </section>

      <section className="glass-panel home-admin-panel">
        <div className="admin-panel-title-row"><h3>Fleet showcase</h3><label className="upload-control"><ImagePlus size={15} /> Add showcase image<input type="file" accept="image/*" onChange={handleShowcaseUpload} disabled={busy} /></label></div>
        <p className="field-hint">Images appear one at a time in the Home carousel. Move images up or down to change their order.</p>
        <div className="showcase-admin-list">
          {slides.map((slide, index) => (
            <div className="showcase-admin-row" key={slide.id}>
              <div className="showcase-admin-thumb"><img src={slide.image_url} alt={slide.alt_text} /></div>
              <div className="showcase-admin-info"><strong>{slide.title}</strong><small>{index + 1} / {slides.length}</small></div>
              <label className="icon-tile-button upload-replace-button" aria-label={`Replace ${slide.title}`} title="Replace image"><UploadCloud size={14} /><input type="file" accept="image/*" onChange={(event) => replaceSlideImage(slide, event)} disabled={busy} /></label>
              <button type="button" aria-label="Move image up" className="icon-tile-button" disabled={index === 0 || busy} onClick={() => moveSlide(index, -1)}><ArrowUp size={15} /></button>
              <button type="button" aria-label="Move image down" className="icon-tile-button" disabled={index === slides.length - 1 || busy} onClick={() => moveSlide(index, 1)}><ArrowDown size={15} /></button>
              <button type="button" aria-label={`Remove ${slide.title}`} className="delete-icon-button" disabled={busy} onClick={() => removeSlide(slide)}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      </section>
      <div className="home-admin-save-footer"><p className="admin-save-notice" role="status">{notice}</p><button type="button" className="primary-button" disabled={busy} onClick={saveSettings}><Save size={15} /> {busy ? "Saving…" : "Save Home settings"}</button></div>
    </div>
  );
}
