import type { Metadata } from "next";
import { CalendarDays, Clock3, MapPin, Newspaper } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Events & News | ANVG" };
export const dynamic = "force-dynamic";

type EventItem = { id: string; name: string; description: string; banner_url: string | null; banner_position: string; departure_icao: string; arrival_icao: string; departure_at: string };
type NewsItem = { id: string; title: string; description: string; banner_url: string | null; banner_position: string; published_at: string };
const dateLabel = (value: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value)) + " UTC";

export default async function EventsPage() {
  const supabase = await createClient();
  let events: EventItem[] = [];
  let news: NewsItem[] = [];
  if (supabase) {
    const [eventResult, newsResult] = await Promise.all([
      supabase.from("events").select("id,name,description,banner_url,banner_position,departure_icao,arrival_icao,departure_at").eq("is_published", true).eq("is_active", true).gte("departure_at", new Date().toISOString()).order("departure_at"),
      supabase.from("news_items").select("id,title,description,banner_url,banner_position,published_at").eq("is_published", true).eq("is_active", true).order("published_at", { ascending: false }),
    ]);
    if (eventResult.data) events = eventResult.data as EventItem[];
    if (newsResult.data) news = newsResult.data as NewsItem[];
  }
  return <PublicLayout currentPath="/events"><div className="page-container stage-page content-page"><div className="page-heading"><span className="eyebrow"><span className="eyebrow-line"/> ANVG / COMMUNITY CALENDAR</span><h1>Meet us in the skies.</h1><p>Discover upcoming group flights, network events and the latest news from across All Nippon Virtual Group.</p></div>
    <section className="content-section"><div className="home-section-heading"><div><span className="eyebrow">FLY TOGETHER</span><h2>Upcoming events</h2></div><span className="section-index">{events.length.toString().padStart(2,"0")} / EVENTS</span></div>{events.length ? <div className="event-grid">{events.map((event) => <article className="event-card glass-panel" key={event.id}>{event.banner_url ? <img src={event.banner_url} alt={event.name} style={{ objectPosition: event.banner_position }}/> : <div className="event-banner-placeholder"><CalendarDays size={32}/><span>ANVG COMMUNITY FLIGHT</span></div>}<div className="event-card-copy"><span className="eyebrow">GROUP FLIGHT</span><h3>{event.name}</h3><p>{event.description}</p><div className="event-meta"><span><MapPin size={14}/>{event.departure_icao} → {event.arrival_icao}</span><span><Clock3 size={14}/>{dateLabel(event.departure_at)}</span></div></div></article>)}</div> : <div className="content-empty glass-panel"><CalendarDays size={22}/><h3>No upcoming events published</h3><p>New group flights and community events will appear here when announced by the ANVG team.</p></div>}</section>
    <section className="content-section"><div className="home-section-heading"><div><span className="eyebrow">FROM THE FLIGHT DECK</span><h2>Latest news</h2></div><span className="section-index">{news.length.toString().padStart(2,"0")} / UPDATES</span></div>{news.length ? <div className="news-list">{news.map((item) => <article className="news-card glass-panel" key={item.id}>{item.banner_url && <img src={item.banner_url} alt="" style={{ objectPosition: item.banner_position }}/>}<div><span className="eyebrow">{dateLabel(item.published_at)}</span><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div> : <div className="content-empty glass-panel"><Newspaper size={22}/><h3>No news updates yet</h3><p>Official announcements and community news will be published here.</p></div>}</section>
  </div></PublicLayout>;
}
