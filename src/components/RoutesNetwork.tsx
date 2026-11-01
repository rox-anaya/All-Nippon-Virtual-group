"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Globe2, MapPin, Pause, Play, RotateCcw, RadioTower } from "lucide-react";

type Airline = { id: string; name: string; category: string; description: string; logo_url: string | null; brand_color: string; hub_icaos: string[]; fleet_types: string[] };
type Hub = { id: string; name: string; icao: string; description: string; image_url: string | null; latitude: number; longitude: number; city: string; is_primary_hub: boolean };
type Route = { id: string; route_name: string; origin: string; origin_icao: string; origin_latitude: number; origin_longitude: number; destination: string; destination_icao: string; destination_latitude: number; destination_longitude: number; airline_division_id: string | null; airline_name: string; aircraft_names: string[]; notes: string };

type GlobeInstance = {
  (container: HTMLElement): GlobeInstance;
  globeImageUrl(url: string): GlobeInstance;
  bumpImageUrl(url: string): GlobeInstance;
  backgroundColor(color: string): GlobeInstance;
  showAtmosphere(value: boolean): GlobeInstance;
  atmosphereColor(color: string): GlobeInstance;
  atmosphereAltitude(value: number): GlobeInstance;
  htmlElementsData(data: Hub[]): GlobeInstance;
  htmlLat(d: Hub): number;
  htmlLng(d: Hub): number;
  htmlElement(d: Hub): HTMLElement;
  htmlElementVisibilityModifier(fn: (element: HTMLElement, isVisible: boolean) => void): GlobeInstance;
  htmlAltitude(value: number): GlobeInstance;
  arcsData(data: Route[]): GlobeInstance;
  arcStartLat(d: Route): number;
  arcStartLng(d: Route): number;
  arcEndLat(d: Route): number;
  arcEndLng(d: Route): number;
  arcColor(d: Route): string;
  arcAltitudeAutoScale(value: number): GlobeInstance;
  arcStroke(value: number): GlobeInstance;
  arcDashLength(value: number): GlobeInstance;
  arcDashGap(value: number): GlobeInstance;
  arcDashAnimateTime(value: number): GlobeInstance;
  width(value: number): GlobeInstance;
  height(value: number): GlobeInstance;
  pointOfView(view: { lat: number; lng: number; altitude: number }, ms?: number): GlobeInstance;
  controls(): { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean; minDistance: number; maxDistance: number; update(): void };
  pauseAnimation(): GlobeInstance;
  resumeAnimation(): GlobeInstance;
  _destructor(): void;
};

declare global { interface Window { __anvgGlobe?: (element: HTMLElement) => GlobeInstance } }

export const brandFallback: Airline[] = [
  { id: "ana", name: "ANA", category: "Full-service airline", description: "All Nippon Airways connects Japan with domestic and international destinations through a full-service virtual airline experience.", logo_url: null, brand_color: "#70b8ef", hub_icaos: ["RJTT", "RJAA"], fleet_types: [] },
  { id: "nca", name: "NCA", category: "Cargo airline", description: "Nippon Cargo Airlines represents dedicated freight operations, connecting cargo destinations across the virtual network.", logo_url: null, brand_color: "#d5b36b", hub_icaos: ["RJAA"], fleet_types: [] },
  { id: "peach", name: "Peach Aviation", category: "Low-cost airline", description: "Peach Aviation brings a low-cost approach to regional and domestic flying, connecting travellers across Japan and beyond.", logo_url: null, brand_color: "#e58ab4", hub_icaos: ["RJBB"], fleet_types: [] },
  { id: "jal", name: "Japan Airlines", category: "Full-service airline", description: "Japan Airlines adds another full-service operation to the group, connecting Japan with destinations around the world.", logo_url: null, brand_color: "#e26d76", hub_icaos: ["RJTT", "RJOO"], fleet_types: [] },
];

export const fallbackHubs: Hub[] = [
  { id: "rjtt", name: "Tokyo Haneda", icao: "RJTT", description: "Primary Tokyo gateway for domestic and international operations.", image_url: null, latitude: 35.5494, longitude: 139.7798, city: "Tokyo, Japan", is_primary_hub: true },
  { id: "rjaa", name: "Tokyo Narita", icao: "RJAA", description: "International gateway serving the Greater Tokyo region.", image_url: null, latitude: 35.772, longitude: 140.3929, city: "Narita, Japan", is_primary_hub: true },
  { id: "rjbb", name: "Osaka Kansai", icao: "RJBB", description: "Major international gateway for the Kansai region.", image_url: null, latitude: 34.4347, longitude: 135.244, city: "Osaka, Japan", is_primary_hub: true },
  { id: "rjgg", name: "Nagoya Chubu", icao: "RJGG", description: "Central Japan gateway serving the Chubu region.", image_url: null, latitude: 34.8584, longitude: 136.8054, city: "Nagoya, Japan", is_primary_hub: true },
];

export function RoutesNetwork({ airlines, hubs, routes }: { airlines: Airline[]; hubs: Hub[]; routes: Route[] }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [selectedAirline, setSelectedAirline] = useState("all");
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const visibleHubs = useMemo(() => selectedAirline === "all" ? hubs : hubs.filter((hub) => airlines.find((airline) => airline.id === selectedAirline)?.hub_icaos.includes(hub.icao)), [airlines, hubs, selectedAirline]);
  const filteredRoutes = useMemo(() => selectedAirline === "all" ? routes : routes.filter((route) => route.airline_division_id === selectedAirline), [routes, selectedAirline]);
  const activeHub = visibleHubs.find((hub) => hub.id === selectedHub) ?? null;

  useEffect(() => {
    let cancelled = false;
    let resizeObserver: ResizeObserver | undefined;
    let instance: GlobeInstance | null = null;
    async function initialise() {
      if (!mountRef.current) return;
      const imported = await import("globe.gl");
      if (cancelled || !mountRef.current) return;
      const GlobeFactory = (imported.default ?? imported) as unknown as (element: HTMLElement) => GlobeInstance;
      instance = GlobeFactory(mountRef.current)
        .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
        .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
        .backgroundColor("rgba(0,0,0,0)")
        .showAtmosphere(true)
        .atmosphereColor("#65c8ff")
        .atmosphereAltitude(0.16)
        .htmlElementsData(hubs)
        .htmlLat((d) => d.latitude)
        .htmlLng((d) => d.longitude)
        .htmlAltitude(0.012)
        .htmlElement((hub) => {
          const el = document.createElement("button");
          el.type = "button";
          el.className = "anvg-globe-marker";
          el.dataset.hubId = hub.id;
          el.setAttribute("aria-label", `${hub.name} (${hub.icao})`);
          el.innerHTML = `<span class="anvg-globe-marker-dot"></span><span class="anvg-globe-marker-label">${hub.icao}</span>`;
          el.addEventListener("click", () => setSelectedHub(hub.id));
          return el;
        })
        .htmlElementVisibilityModifier((element, isVisible) => {
          element.style.display = isVisible ? "block" : "none";
          element.style.pointerEvents = isVisible ? "auto" : "none";
        })
        .arcsData(routes)
        .arcStartLat((d) => d.origin_latitude)
        .arcStartLng((d) => d.origin_longitude)
        .arcEndLat((d) => d.destination_latitude)
        .arcEndLng((d) => d.destination_longitude)
        .arcColor(() => "rgba(255,116,126,0.88)")
        .arcAltitudeAutoScale(0.35)
        .arcStroke(0.55)
        .arcDashLength(0.42)
        .arcDashGap(0.18)
        .arcDashAnimateTime(2600);
      const controls = instance.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.28;
      controls.enableZoom = true;
      controls.minDistance = 150;
      controls.maxDistance = 520;
      instance.pointOfView({ lat: 29, lng: 137, altitude: 1.9 }, 0);
      globeRef.current = instance;
      setGlobeReady(true);
      resizeObserver = new ResizeObserver((entries) => {
        const box = entries[0]?.contentRect;
        if (box && instance) {
          instance.width(Math.max(280, Math.floor(box.width)));
          instance.height(Math.max(320, Math.floor(box.height)));
        }
      });
      resizeObserver.observe(mountRef.current);
    }
    void initialise();
    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      instance?._destructor();
      globeRef.current = null;
    };
  }, [hubs, routes]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.htmlElementsData(visibleHubs).arcsData(filteredRoutes);
  }, [visibleHubs, filteredRoutes, globeReady]);

  const toggleRotation = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const next = !isPaused;
    if (next) globe.pauseAnimation(); else globe.resumeAnimation();
    globe.controls().autoRotate = !next;
    setIsPaused(next);
  }, [isPaused]);

  const resetGlobe = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.pointOfView({ lat: 29, lng: 137, altitude: 1.9 }, 900);
    globe.controls().autoRotate = !isPaused;
    if (isPaused) globe.pauseAnimation(); else globe.resumeAnimation();
  }, [isPaused]);

  return <>
    <section className="network-globe-section">
      <div className="network-globe-copy">
        <span className="eyebrow">ANVG / GLOBAL NETWORK</span>
        <h2>One group. A world of connections.</h2>
        <p>Explore our Japanese hub network and published routes. Select an airline to filter the network, or drag the globe to explore.</p>
        <div className="network-filter-row" aria-label="Filter network by airline">
          <button className={selectedAirline === "all" ? "network-filter is-selected" : "network-filter"} onClick={() => { setSelectedAirline("all"); setSelectedHub(null); }}>All airlines</button>
          {airlines.map((airline) => <button key={airline.id} className={selectedAirline === airline.id ? "network-filter is-selected" : "network-filter"} onClick={() => { setSelectedAirline(airline.id); setSelectedHub(null); }}>{airline.name}</button>)}
        </div>
      </div>
      <div className="network-globe-card glass-panel">
        <div className="network-globe-topline"><span><span className="status-dot"/> GPS NETWORK VIEW</span><span>{visibleHubs.length} HUBS · {filteredRoutes.length} ROUTES</span></div>
        <div className="anvg-globe-stage"><div ref={mountRef} className="anvg-globe-mount" aria-label="Interactive three-dimensional Earth globe with geographic airport labels" />
          {!globeReady && <div className="anvg-globe-loading">Preparing global network…</div>}
          <div className="anvg-globe-controls"><button type="button" onClick={toggleRotation} className="anvg-globe-control" aria-label={isPaused ? "Resume globe rotation" : "Pause globe rotation"}>{isPaused ? <Play size={15}/> : <Pause size={15}/>}<span>{isPaused ? "Resume" : "Pause"}</span></button><button type="button" onClick={resetGlobe} className="anvg-globe-control"><RotateCcw size={15}/><span>Reset view</span></button></div>
          <div className="anvg-globe-hint">Drag to rotate · Pinch or scroll to zoom</div>
        </div>
        <div className="network-globe-legend"><span><i className="legend-hub"/> Operational hubs</span><span><i className="legend-route"/> Published routes</span><span className="network-globe-note">Far-side airport labels hide automatically.</span></div>
        {activeHub && <div className="gps-selected-hub"><MapPin size={15}/><strong>{activeHub.name}</strong><span>{activeHub.icao} · {activeHub.city}</span><button onClick={() => setSelectedHub(null)} aria-label="Clear selected hub">×</button></div>}
      </div>
    </section>
    <section className="network-airlines-section"><div className="home-section-heading"><div><span className="eyebrow">THE ANVG GROUP</span><h2>Our operating airlines</h2></div><span className="section-index">04 / DIVISIONS</span></div><div className="network-airline-grid">{airlines.map((airline) => <article className="network-airline-card glass-panel" key={airline.id} style={{ "--airline-accent": airline.brand_color } as CSSProperties}><div className="network-airline-mark">{airline.logo_url ? <img src={airline.logo_url} alt={`${airline.name} logo`}/> : <span>{airline.name.split(/\s+/).map((word) => word[0]).join("").slice(0,3).toUpperCase()}</span>}</div><div className="network-airline-copy"><span className="network-airline-category">{airline.category}</span><h3>{airline.name}</h3><p>{airline.description}</p>{airline.fleet_types.length > 0 && <small>{airline.fleet_types.join(" · ")}</small>}</div></article>)}</div></section>
    <section className="network-hubs-section"><div className="home-section-heading"><div><span className="eyebrow">JAPAN / PRIMARY GATEWAYS</span><h2>Our hubs</h2></div><span className="section-index">{visibleHubs.length.toString().padStart(2,"0")} / HUBS</span></div><div className="network-hub-grid">{visibleHubs.map((hub) => <article className={`network-hub-card glass-panel ${selectedHub === hub.id ? "is-selected" : ""}`} key={hub.id} onClick={() => setSelectedHub(hub.id)}>{hub.image_url ? <img className="network-hub-image" src={hub.image_url} alt={`${hub.name} airport`}/> : <div className="network-hub-image network-hub-placeholder"><RadioTower size={30}/><span>ANVG HUB</span></div>}<div className="network-hub-info"><span className="eyebrow">{hub.icao} {hub.is_primary_hub ? "· PRIMARY HUB" : "· NETWORK AIRPORT"}</span><h3>{hub.name}</h3><p>{hub.city}</p><small>{hub.description}</small></div></article>)}</div></section>
    <p className="network-data-note"><Globe2 size={14}/>{routes.length ? `${routes.length} published routes are plotted on the network globe.` : "The globe is ready. Published flight paths will appear as route schedules are added."}</p>
  </>;
}
