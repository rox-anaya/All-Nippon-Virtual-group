"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { MapPin, Plane, RadioTower } from "lucide-react";

type Airline = { id: string; name: string; category: string; description: string; logo_url: string | null; brand_color: string; hub_icaos: string[]; fleet_types: string[] };
type Hub = { id: string; name: string; icao: string; description: string; image_url: string | null; latitude: number; longitude: number; city: string; is_primary_hub: boolean };
type Route = { id: string; route_name: string; origin: string; origin_icao: string; destination: string; destination_icao: string; airline_division_id: string | null; airline_name: string; aircraft_names: string[]; notes: string };

const brandFallback = [
  { id: "ana", name: "ANA", category: "Full-service airline", description: "All Nippon Airways connects Japan with domestic and international destinations through a full-service virtual airline experience.", logo_url: null, brand_color: "#70b8ef", hub_icaos: ["RJTT", "RJAA"], fleet_types: [] },
  { id: "nca", name: "NCA", category: "Cargo airline", description: "Nippon Cargo Airlines represents dedicated freight operations, connecting cargo destinations across the virtual network.", logo_url: null, brand_color: "#d5b36b", hub_icaos: ["RJAA"], fleet_types: [] },
  { id: "peach", name: "Peach Aviation", category: "Low-cost airline", description: "Peach Aviation brings a low-cost approach to regional and domestic flying, connecting travellers across Japan and beyond.", logo_url: null, brand_color: "#e58ab4", hub_icaos: ["RJBB"], fleet_types: [] },
  { id: "jal", name: "Japan Airlines", category: "Full-service airline", description: "Japan Airlines adds another full-service operation to the group, connecting Japan with destinations around the world.", logo_url: null, brand_color: "#e26d76", hub_icaos: ["RJTT", "RJOO"], fleet_types: [] },
] as Airline[];

const fallbackHubs: Hub[] = [
  { id: "rjtt", name: "Tokyo Haneda", icao: "RJTT", description: "Primary Tokyo gateway for domestic and international operations.", image_url: null, latitude: 35.5494, longitude: 139.7798, city: "Tokyo, Japan", is_primary_hub: true },
  { id: "rjaa", name: "Tokyo Narita", icao: "RJAA", description: "International gateway serving the Greater Tokyo region.", image_url: null, latitude: 35.7720, longitude: 140.3929, city: "Narita, Japan", is_primary_hub: true },
  { id: "rjbb", name: "Osaka Kansai", icao: "RJBB", description: "Major international gateway for the Kansai region.", image_url: null, latitude: 34.4347, longitude: 135.2440, city: "Osaka, Japan", is_primary_hub: true },
  { id: "rjgg", name: "Nagoya Chubu", icao: "RJGG", description: "Central Japan gateway serving the Chubu region.", image_url: null, latitude: 34.8584, longitude: 136.8054, city: "Nagoya, Japan", is_primary_hub: true },
];

export function RoutesNetwork({ airlines, hubs, routes }: { airlines: Airline[]; hubs: Hub[]; routes: Route[] }) {
  const [selectedAirline, setSelectedAirline] = useState("all");
  const filteredRoutes = useMemo(() => selectedAirline === "all" ? routes : routes.filter((route) => route.airline_division_id === selectedAirline), [routes, selectedAirline]);
  const visibleHubs = useMemo(() => selectedAirline === "all" ? hubs : hubs.filter((hub) => airlines.find((airline) => airline.id === selectedAirline)?.hub_icaos.includes(hub.icao)), [airlines, hubs, selectedAirline]);
  const grouped = airlines.map((airline) => ({ airline, routes: filteredRoutes.filter((route) => route.airline_division_id === airline.id) })).filter((group) => selectedAirline === "all" || group.airline.id === selectedAirline);

  return <>
    <section className="network-globe-section">
      <div className="network-globe-copy"><span className="eyebrow">ANVG / GLOBAL NETWORK</span><h2>One group. A world of connections.</h2><p>Explore our Japanese hub network and the routes operated by each airline division. Select an airline to focus the network.</p><div className="network-filter-row"><button className={selectedAirline === "all" ? "network-filter is-selected" : "network-filter"} onClick={() => setSelectedAirline("all")}>All airlines</button>{airlines.map((airline) => <button key={airline.id} className={selectedAirline === airline.id ? "network-filter is-selected" : "network-filter"} onClick={() => setSelectedAirline(airline.id)}>{airline.name}</button>)}</div></div>
      <div className="network-globe-card glass-panel">
        <div className="network-globe-topline"><span><span className="status-dot" /> NETWORK VIEW</span><span>{visibleHubs.length} HUBS · {filteredRoutes.length} ROUTES</span></div>
        <div className="network-globe-stage" aria-label="Stylised interactive globe showing ANVG hub locations">
          <div className="network-globe"><div className="globe-latitudes"/><div className="globe-longitudes"/><div className="globe-shine"/>
            {visibleHubs.map((hub) => <span key={hub.id} className="globe-marker" style={{ left: `${50 + (hub.longitude - 135) * 3}%`, top: `${50 - (hub.latitude - 35) * 3}%` }} title={`${hub.name} (${hub.icao})`} />)}
          </div>
          <div className="globe-label globe-label-japan">JAPAN</div><div className="globe-label globe-label-network">ANVG NETWORK</div>
        </div>
        <div className="network-globe-legend"><span><i className="legend-hub"/> Primary hubs</span><span><i className="legend-route"/> Published routes</span><span className="network-globe-note">Route arcs appear as published schedules are added.</span></div>
      </div>
    </section>

    <section className="network-airlines-section"><div className="home-section-heading"><div><span className="eyebrow">THE ANVG GROUP</span><h2>Our operating airlines</h2></div><span className="section-index">04 / DIVISIONS</span></div>
      <div className="network-airline-grid">{airlines.map((airline) => <article className="network-airline-card glass-panel" key={airline.id} style={{ "--airline-accent": airline.brand_color } as CSSProperties}><div className="network-airline-mark">{airline.logo_url ? <img src={airline.logo_url} alt={`${airline.name} logo`}/> : <span>{airline.name.split(/\s+/).map((word) => word[0]).join("").slice(0,3).toUpperCase()}</span>}</div><div className="network-airline-copy"><span className="network-airline-category">{airline.category}</span><h3>{airline.name}</h3><p>{airline.description}</p>{airline.fleet_types.length > 0 && <small>{airline.fleet_types.join(" · ")}</small>}</div></article>)}</div>
    </section>

    <section className="network-hubs-section"><div className="home-section-heading"><div><span className="eyebrow">JAPAN / PRIMARY GATEWAYS</span><h2>Our hubs</h2></div><span className="section-index">{hubs.length.toString().padStart(2,"0")} / HUBS</span></div><div className="network-hub-grid">{visibleHubs.map((hub) => <article className="network-hub-card glass-panel" key={hub.id}>{hub.image_url ? <img className="network-hub-image" src={hub.image_url} alt={`${hub.name} airport`}/> : <div className="network-hub-image network-hub-placeholder"><RadioTower size={30}/><span>ANVG HUB</span></div>}<div className="network-hub-info"><span className="eyebrow">{hub.icao} {hub.is_primary_hub ? "· PRIMARY HUB" : "· NETWORK AIRPORT"}</span><h3>{hub.name}</h3><p>{hub.city}</p><small>{hub.description}</small></div></article>)}</div></section>

    <section className="network-routes-section"><div className="home-section-heading"><div><span className="eyebrow">FLIGHT DIRECTORY</span><h2>Routes by airline</h2></div><span className="section-index">{filteredRoutes.length.toString().padStart(2,"0")} / ROUTES</span></div>
      {grouped.map(({ airline, routes: airlineRoutes }) => <details className="network-route-group glass-panel" key={airline.id} open={selectedAirline !== "all"}><summary><span className="route-group-mark" style={{ background: airline.brand_color }}/><span className="route-group-name"><strong>{airline.name}</strong><small>{airline.category}</small></span><span className="route-group-count">{airlineRoutes.length} ROUTES</span></summary>{airlineRoutes.length ? <div className="network-route-list">{airlineRoutes.map((route) => <article className="network-route-row" key={route.id}><div className="route-airports"><strong>{route.origin_icao}</strong><span>→</span><strong>{route.destination_icao}</strong></div><div className="route-description"><span>{route.route_name || `${route.origin} to ${route.destination}`}</span><small>{route.aircraft_names.length ? route.aircraft_names.join(" · ") : "Aircraft assignment pending"}</small></div><span className="route-detail-note">{route.notes || "Scheduled route"}</span></article>)}</div> : <div className="network-empty-state"><Plane size={19}/><p>Routes for {airline.name} will appear here once they are published in the Admin Centre.</p></div>}</details>)}
      {routes.length === 0 && <p className="network-data-note"><MapPin size={14}/> The globe and hub directory are ready. Published route arcs and flight listings will appear when route records are added.</p>}
    </section>
  </>;
}

export { brandFallback, fallbackHubs };
