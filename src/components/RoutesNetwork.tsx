"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { MapPin, RadioTower, Globe2 } from "lucide-react";

type Airline = { id: string; name: string; category: string; description: string; logo_url: string | null; brand_color: string; hub_icaos: string[]; fleet_types: string[] };
type Hub = { id: string; name: string; icao: string; description: string; image_url: string | null; latitude: number; longitude: number; city: string; is_primary_hub: boolean };
type Route = { id: string; route_name: string; origin: string; origin_icao: string; origin_latitude: number; origin_longitude: number; destination: string; destination_icao: string; destination_latitude: number; destination_longitude: number; airline_division_id: string | null; airline_name: string; aircraft_names: string[]; notes: string };

const brandFallback: Airline[] = [
  { id: "ana", name: "ANA", category: "Full-service airline", description: "All Nippon Airways connects Japan with domestic and international destinations through a full-service virtual airline experience.", logo_url: null, brand_color: "#70b8ef", hub_icaos: ["RJTT", "RJAA"], fleet_types: [] },
  { id: "nca", name: "NCA", category: "Cargo airline", description: "Nippon Cargo Airlines represents dedicated freight operations, connecting cargo destinations across the virtual network.", logo_url: null, brand_color: "#d5b36b", hub_icaos: ["RJAA"], fleet_types: [] },
  { id: "peach", name: "Peach Aviation", category: "Low-cost airline", description: "Peach Aviation brings a low-cost approach to regional and domestic flying, connecting travellers across Japan and beyond.", logo_url: null, brand_color: "#e58ab4", hub_icaos: ["RJBB"], fleet_types: [] },
  { id: "jal", name: "Japan Airlines", category: "Full-service airline", description: "Japan Airlines adds another full-service operation to the group, connecting Japan with destinations around the world.", logo_url: null, brand_color: "#e26d76", hub_icaos: ["RJTT", "RJOO"], fleet_types: [] },
];

const fallbackHubs: Hub[] = [
  { id: "rjtt", name: "Tokyo Haneda", icao: "RJTT", description: "Primary Tokyo gateway for domestic and international operations.", image_url: null, latitude: 35.5494, longitude: 139.7798, city: "Tokyo, Japan", is_primary_hub: true },
  { id: "rjaa", name: "Tokyo Narita", icao: "RJAA", description: "International gateway serving the Greater Tokyo region.", image_url: null, latitude: 35.7720, longitude: 140.3929, city: "Narita, Japan", is_primary_hub: true },
  { id: "rjbb", name: "Osaka Kansai", icao: "RJBB", description: "Major international gateway for the Kansai region.", image_url: null, latitude: 34.4347, longitude: 135.2440, city: "Osaka, Japan", is_primary_hub: true },
  { id: "rjgg", name: "Nagoya Chubu", icao: "RJGG", description: "Central Japan gateway serving the Chubu region.", image_url: null, latitude: 34.8584, longitude: 136.8054, city: "Nagoya, Japan", is_primary_hub: true },
];

function projectPoint(latitude: number, longitude: number) {
  const centerLat = 25 * Math.PI / 180;
  const lat = latitude * Math.PI / 180;
  const lon = (longitude - 135) * Math.PI / 180;
  const x = 250 + 205 * Math.cos(lat) * Math.sin(lon);
  const y = 250 - 205 * (Math.sin(lat) * Math.cos(centerLat) - Math.cos(lat) * Math.cos(lon) * Math.sin(centerLat));
  return { x, y };
}

export function RoutesNetwork({ airlines, hubs, routes }: { airlines: Airline[]; hubs: Hub[]; routes: Route[] }) {
  const [selectedAirline, setSelectedAirline] = useState("all");
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const visibleHubs = useMemo(() => selectedAirline === "all" ? hubs : hubs.filter((hub) => airlines.find((airline) => airline.id === selectedAirline)?.hub_icaos.includes(hub.icao)), [airlines, hubs, selectedAirline]);
  const filteredRoutes = useMemo(() => selectedAirline === "all" ? routes : routes.filter((route) => route.airline_division_id === selectedAirline), [routes, selectedAirline]);
  const activeHub = visibleHubs.find((hub) => hub.id === selectedHub) ?? null;

  return <>
    <section className="network-intro-section">
      <div className="network-globe-copy">
        <span className="eyebrow">ANVG / GLOBAL NETWORK</span>
        <h2>One group. A world of connections.</h2>
        <p>Explore our Japanese hub network and the routes operated by each airline division. Select an airline to focus the network.</p>
        <div className="network-filter-row">
          <button className={selectedAirline === "all" ? "network-filter is-selected" : "network-filter"} onClick={() => { setSelectedAirline("all"); setSelectedHub(null); }}>All airlines</button>
          {airlines.map((airline) => <button key={airline.id} className={selectedAirline === airline.id ? "network-filter is-selected" : "network-filter"} onClick={() => { setSelectedAirline(airline.id); setSelectedHub(null); }}>{airline.name}</button>)}
        </div>
      </div>

      <div className="network-globe-card glass-panel">
        <div className="network-globe-topline">
          <span><span className="status-dot" /> GPS NETWORK VIEW</span>
          <span>{visibleHubs.length} HUBS · {filteredRoutes.length} ROUTES</span>
        </div>
        <div className="gps-globe-stage" aria-label="Interactive GPS-style globe showing ANVG hubs and published routes">
          <svg className="gps-globe" viewBox="0 0 500 500" role="img" aria-label="Three-dimensional globe centred on Japan">
            <defs>
              <radialGradient id="earthOcean" cx="34%" cy="27%" r="78%">
                <stop offset="0%" stopColor="#164b68"/>
                <stop offset="48%" stopColor="#092a43"/>
                <stop offset="100%" stopColor="#020d1b"/>
              </radialGradient>
              <linearGradient id="earthShade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a7e4ff" stopOpacity=".16"/>
                <stop offset="42%" stopColor="#4aa6d5" stopOpacity=".02"/>
                <stop offset="100%" stopColor="#000814" stopOpacity=".76"/>
              </linearGradient>
              <clipPath id="earthClip"><circle cx="250" cy="250" r="218"/></clipPath>
              <filter id="earthGlow"><feGaussianBlur stdDeviation="7"/></filter>
            </defs>
            <circle cx="250" cy="250" r="224" fill="#1d8bc2" opacity=".12" filter="url(#earthGlow)"/>
            <circle cx="250" cy="250" r="218" fill="url(#earthOcean)" stroke="#58bce9" strokeOpacity=".62" strokeWidth="1.5"/>
            <g clipPath="url(#earthClip)">
              <g className="gps-earth-map">
                <path className="gps-land" d="M45 112 L75 83 111 78 135 91 151 118 143 143 119 154 111 179 87 187 70 166 47 158 34 135 Z"/>
                <path className="gps-land" d="M115 197 L145 185 170 198 185 227 177 260 163 284 155 318 135 347 120 320 125 288 108 262 103 230 Z"/>
                <path className="gps-land" d="M206 105 L231 83 264 79 286 91 309 85 338 98 366 91 395 108 421 133 414 154 390 160 374 181 347 177 329 197 305 188 286 208 264 197 248 173 223 165 210 140 Z"/>
                <path className="gps-land" d="M229 202 L251 190 278 201 293 226 285 252 269 274 257 308 238 325 223 300 216 270 203 245 208 221 Z"/>
                <path className="gps-land" d="M355 242 L377 231 401 239 413 257 403 275 381 280 365 267 Z"/>
                <path className="gps-land" d="M390 302 L416 292 438 307 430 328 407 337 391 325 Z"/>
                <path className="gps-land" d="M302 342 L326 330 350 340 361 362 347 382 320 389 300 371 Z"/>
                <path className="gps-land" d="M174 75 L184 63 197 69 195 86 182 93 Z"/>
                <path className="gps-land" d="M421 181 L432 169 442 180 436 197 Z"/>
              </g>
              <g className="gps-grid">
                <ellipse cx="250" cy="250" rx="218" ry="72"/>
                <ellipse cx="250" cy="250" rx="218" ry="145"/>
                <ellipse cx="250" cy="250" rx="105" ry="218"/>
                <ellipse cx="250" cy="250" rx="174" ry="218"/>
                <path d="M32 250H468 M48 165H452 M48 335H452"/>
              </g>
              {filteredRoutes.map((route) => {
                const a = projectPoint(route.origin_latitude, route.origin_longitude);
                const b = projectPoint(route.destination_latitude, route.destination_longitude);
                const mx = (a.x + b.x) / 2;
                const my = Math.min(a.y, b.y) - 30;
                return <g key={route.id} className="gps-route-arc"><path d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}/></g>;
              })}
              {visibleHubs.map((hub) => {
                const point = projectPoint(hub.latitude, hub.longitude);
                return <g key={hub.id} className={`gps-hub-pin ${selectedHub === hub.id ? "is-active" : ""}`} transform={`translate(${point.x} ${point.y})`} onClick={() => setSelectedHub(hub.id)} role="button" aria-label={`${hub.name} ${hub.icao}`}>
                  <circle className="gps-pin-pulse" r="13"/>
                  <circle className="gps-pin-core" r="5"/>
                  <circle className="gps-pin-center" r="1.8"/>
                  <title>{hub.name} ({hub.icao})</title>
                </g>;
              })}
              <circle cx="250" cy="250" r="218" fill="url(#earthShade)"/>
            </g>
            <circle cx="250" cy="250" r="218" fill="none" stroke="#80d5ff" strokeOpacity=".25"/>
          </svg>
          <div className="gps-globe-coordinates"><span>GPS / 35° 41′ N</span><span>139° 41′ E</span></div>
          <div className="gps-globe-tag">JAPAN REGION</div>
        </div>
        <div className="network-globe-legend">
          <span><i className="legend-hub"/> Hubs</span>
          <span><i className="legend-route"/> Published routes</span>
          <span className="network-globe-note">Select a glowing marker to inspect a hub.</span>
        </div>
        {activeHub && <div className="gps-selected-hub"><MapPin size={15}/><strong>{activeHub.name}</strong><span>{activeHub.icao} · {activeHub.city}</span><button onClick={() => setSelectedHub(null)} aria-label="Clear selected hub">×</button></div>}
      </div>
    </section>

    <section className="network-airlines-section">
      <div className="home-section-heading"><div><span className="eyebrow">THE ANVG GROUP</span><h2>Our operating airlines</h2></div><span className="section-index">04 / DIVISIONS</span></div>
      <div className="network-airline-grid">{airlines.map((airline) => <article className="network-airline-card glass-panel" key={airline.id} style={{ "--airline-accent": airline.brand_color } as CSSProperties}>
        <div className="network-airline-mark">{airline.logo_url ? <img src={airline.logo_url} alt={`${airline.name} logo`}/> : <span>{airline.name.split(/\s+/).map((word) => word[0]).join("").slice(0,3).toUpperCase()}</span>}</div>
        <div className="network-airline-copy"><span className="network-airline-category">{airline.category}</span><h3>{airline.name}</h3><p>{airline.description}</p>{airline.fleet_types.length > 0 && <small>{airline.fleet_types.join(" · ")}</small>}</div>
      </article>)}</div>
    </section>

    <section className="network-hubs-section">
      <div className="home-section-heading"><div><span className="eyebrow">JAPAN / PRIMARY GATEWAYS</span><h2>Our hubs</h2></div><span className="section-index">{visibleHubs.length.toString().padStart(2,"0")} / HUBS</span></div>
      <div className="network-hub-grid">{visibleHubs.map((hub) => <article className={`network-hub-card glass-panel ${selectedHub === hub.id ? "is-selected" : ""}`} key={hub.id} onClick={() => setSelectedHub(hub.id)}>
        {hub.image_url ? <img className="network-hub-image" src={hub.image_url} alt={`${hub.name} airport`}/> : <div className="network-hub-image network-hub-placeholder"><RadioTower size={30}/><span>ANVG HUB</span></div>}
        <div className="network-hub-info"><span className="eyebrow">{hub.icao} {hub.is_primary_hub ? "· PRIMARY HUB" : "· NETWORK AIRPORT"}</span><h3>{hub.name}</h3><p>{hub.city}</p><small>{hub.description}</small></div>
      </article>)}</div>
    </section>
    <p className="network-data-note"><Globe2 size={14}/> {routes.length ? `${routes.length} published routes are plotted on the network globe.` : "The network globe is ready. Published flight paths will appear as route schedules are added."}</p>
  </>;
}

export { brandFallback, fallbackHubs };
