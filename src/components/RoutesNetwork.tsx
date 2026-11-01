"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Pause, Play, RadioTower, RotateCcw } from "lucide-react";

type Hub = {
  id: string;
  name: string;
  icao: string;
  description: string;
  image_url: string | null;
  latitude: number;
  longitude: number;
  city: string;
  is_primary_hub: boolean;
};

type GlobeInstance = {
  globeImageUrl(url: string): GlobeInstance;
  bumpImageUrl(url: string): GlobeInstance;
  backgroundColor(color: string): GlobeInstance;
  showAtmosphere(value: boolean): GlobeInstance;
  atmosphereColor(color: string): GlobeInstance;
  atmosphereAltitude(value: number): GlobeInstance;
  showGraticules(value: boolean): GlobeInstance;
  htmlElementsData(data: Hub[]): GlobeInstance;
  htmlLat(accessor: (hub: Hub) => number): GlobeInstance;
  htmlLng(accessor: (hub: Hub) => number): GlobeInstance;
  htmlAltitude(value: number): GlobeInstance;
  htmlElement(accessor: (hub: Hub) => HTMLElement): GlobeInstance;
  htmlElementVisibilityModifier(fn: (element: HTMLElement, isVisible: boolean) => void): GlobeInstance;
  width(value: number): GlobeInstance;
  height(value: number): GlobeInstance;
  pointOfView(view: { lat: number; lng: number; altitude: number }, ms?: number): GlobeInstance;
  controls(): { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean; minDistance: number; maxDistance: number };
  _destructor(): void;
};

type GlobeFactory = () => (container: HTMLElement) => GlobeInstance;

export const fallbackHubs: Hub[] = [
  { id: "rjtt", name: "Tokyo Haneda", icao: "RJTT", description: "A major gateway serving Tokyo and the Greater Tokyo region.", image_url: null, latitude: 35.5494, longitude: 139.7798, city: "Tokyo, Japan", is_primary_hub: true },
  { id: "rjaa", name: "Tokyo Narita", icao: "RJAA", description: "Tokyo's major international gateway, located in Chiba Prefecture.", image_url: null, latitude: 35.772, longitude: 140.3929, city: "Narita, Japan", is_primary_hub: true },
  { id: "rjbb", name: "Osaka Kansai", icao: "RJBB", description: "An international gateway serving Osaka and the wider Kansai region.", image_url: null, latitude: 34.4347, longitude: 135.244, city: "Osaka, Japan", is_primary_hub: true },
  { id: "rjgg", name: "Nagoya Chubu", icao: "RJGG", description: "A central Japan gateway serving the Chubu region.", image_url: null, latitude: 34.8584, longitude: 136.8054, city: "Nagoya, Japan", is_primary_hub: true },
];

export function RoutesNetwork({ hubs }: { hubs: Hub[] }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const [globeError, setGlobeError] = useState<string | null>(null);
  const activeHub = hubs.find((hub) => hub.id === selectedHub) ?? null;

  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    let instance: GlobeInstance | null = null;

    async function initialise() {
      try {
        if (!mountRef.current) return;
        const imported = await import("globe.gl");
        if (cancelled || !mountRef.current) return;
        const Globe = (imported.default ?? imported) as unknown as GlobeFactory;
        // Globe.gl is a factory that returns the container initialiser: Globe()(element).
        const globe = Globe()(mountRef.current);
        instance = globe;
        globe
          .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-day.jpg")
          .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
          .backgroundColor("rgba(0,0,0,0)")
          .showAtmosphere(true)
          .atmosphereColor("#8ecfff")
          .atmosphereAltitude(0.12)
          .showGraticules(true)
          .htmlElementsData(hubs)
          .htmlLat((hub) => hub.latitude)
          .htmlLng((hub) => hub.longitude)
          .htmlAltitude(0.012)
          .htmlElement((hub) => {
            const marker = document.createElement("button");
            marker.type = "button";
            marker.className = `anvg-globe-marker anvg-marker-${hub.icao.toLowerCase()}`;
            marker.dataset.hubId = hub.id;
            marker.setAttribute("aria-label", `${hub.name} (${hub.icao})`);
            marker.innerHTML = `<span class="anvg-globe-marker-dot"></span><span class="anvg-globe-marker-label">${hub.icao}</span>`;
            marker.addEventListener("click", () => setSelectedHub(hub.id));
            return marker;
          })
          .htmlElementVisibilityModifier((element, isVisible) => {
            element.style.display = isVisible ? "flex" : "none";
            element.style.pointerEvents = isVisible ? "auto" : "none";
          });

        const controls = globe.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.22;
        controls.enableZoom = true;
        controls.minDistance = 145;
        controls.maxDistance = 520;
        globe.pointOfView({ lat: 36, lng: 138, altitude: 1.75 }, 0);
        globeRef.current = globe;
        setGlobeReady(true);

        observer = new ResizeObserver((entries) => {
          const rect = entries[0]?.contentRect;
          if (rect && instance) {
            instance.width(Math.max(280, Math.floor(rect.width)));
            instance.height(Math.max(340, Math.floor(rect.height)));
          }
        });
        observer.observe(mountRef.current);
      } catch (error) {
        console.error("ANVG globe initialisation failed", error);
        if (!cancelled) setGlobeError("The globe could not be loaded. Please refresh and try again.");
      }
    }

    void initialise();
    return () => {
      cancelled = true;
      observer?.disconnect();
      instance?._destructor();
      globeRef.current = null;
    };
  }, [hubs]);

  const toggleRotation = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const nextPaused = !isPaused;
    // Only stop automatic rotation; leave OrbitControls active for drag and zoom.
    globe.controls().autoRotate = !nextPaused;
    setIsPaused(nextPaused);
  }, [isPaused]);

  const resetView = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.pointOfView({ lat: 36, lng: 138, altitude: 1.75 }, 850);
    // Do not change autoRotate here: reset must preserve the current pause state.
  }, []);

  return (
    <section className="network-globe-section">
      <div className="network-globe-copy">
        <span className="eyebrow">ANVG / JAPAN HUB NETWORK</span>
        <h2>Explore our hubs.</h2>
        <p>Discover the group's operational gateways across Japan on an interactive globe.</p>
      </div>

      <div className="network-globe-toolbar" aria-label="Globe controls">
        <button type="button" onClick={toggleRotation} className="anvg-globe-control" disabled={!globeReady} aria-label={isPaused ? "Resume automatic rotation" : "Pause automatic rotation"}>
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
          <span>{isPaused ? "Resume" : "Pause"}</span>
        </button>
        <button type="button" onClick={resetView} className="anvg-globe-control" disabled={!globeReady}>
          <RotateCcw size={16} /><span>Reset view</span>
        </button>
      </div>

      <div className="network-globe-card glass-panel">
        <div className="network-globe-topline">
          <span><span className="status-dot" /> GPS HUB VIEW</span>
          <span>{hubs.length} OPERATIONAL HUBS</span>
        </div>
        <div className="anvg-globe-stage">
          <div ref={mountRef} className="anvg-globe-mount" aria-label="Interactive white geographic globe showing ANVG operational hubs" />
          {!globeReady && <div className="anvg-globe-loading">{globeError ?? "Preparing global network…"}</div>}
          <div className="anvg-globe-hint">Drag to rotate · Pinch or scroll to zoom</div>
        </div>
        <div className="network-globe-legend"><span><i className="legend-hub" /> Operational hubs</span><span className="network-globe-note">Labels hide automatically on the far side</span></div>
        {activeHub && (
          <div className="gps-selected-hub">
            <MapPin size={15} />
            <strong>{activeHub.name}</strong>
            <span>{activeHub.icao} · {activeHub.city}</span>
            <button type="button" onClick={() => setSelectedHub(null)} aria-label="Clear selected hub">×</button>
          </div>
        )}
      </div>

      <section className="network-hubs-section">
        <div className="home-section-heading">
          <div><span className="eyebrow">JAPAN / OPERATIONAL GATEWAYS</span><h2>Our hubs</h2></div>
          <span className="section-index">{hubs.length.toString().padStart(2, "0")} / HUBS</span>
        </div>
        <div className="network-hub-grid">
          {hubs.map((hub) => (
            <button type="button" className={`network-hub-card glass-panel ${selectedHub === hub.id ? "is-selected" : ""}`} key={hub.id} onClick={() => setSelectedHub(hub.id)}>
              {hub.image_url ? <img className="network-hub-image" src={hub.image_url} alt={`${hub.name} airport`} /> : <span className="network-hub-image network-hub-placeholder"><RadioTower size={30} /><span>ANVG HUB</span></span>}
              <span className="network-hub-info">
                <span className="eyebrow">{hub.icao}{hub.is_primary_hub ? " · PRIMARY HUB" : " · NETWORK AIRPORT"}</span>
                <strong>{hub.name}</strong>
                <span className="network-hub-city">{hub.city}</span>
                <span className="network-hub-description">{hub.description}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
