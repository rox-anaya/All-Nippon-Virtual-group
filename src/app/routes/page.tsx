import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { RoutesNetwork, brandFallback, fallbackHubs } from "@/components/RoutesNetwork";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Global Network | ANVG" };
export const dynamic = "force-dynamic";

type Division = { id: string; name: string; category: string; description: string; logo_url: string | null; brand_color: string; hub_icaos: string[]; fleet_types: string[] };
type Hub = { id: string; name: string; icao: string; description: string; image_url: string | null; latitude: number; longitude: number; city: string; is_primary_hub: boolean };
type Route = { id: string; route_name: string; origin: string; origin_icao: string; origin_latitude: number; origin_longitude: number; destination: string; destination_icao: string; destination_latitude: number; destination_longitude: number; airline_division_id: string | null; airline_name: string; aircraft_names: string[]; notes: string };

export default async function RoutesPage() {
  const supabase = await createClient();
  let airlines: Division[] = brandFallback;
  let hubs: Hub[] = fallbackHubs;
  let routes: Route[] = [];
  if (supabase) {
    const [divisionResult, hubResult, locationResult, routeResult] = await Promise.all([
      supabase.from("airline_divisions").select("id,name,category,description,logo_url,brand_color,hub_icaos,fleet_types").eq("is_published", true).eq("is_active", true).order("display_order"),
      supabase.from("operational_hubs").select("id,name,icao,description,image_url,location_id,display_order").eq("is_published", true).eq("is_active", true).order("display_order"),
      supabase.from("operating_locations").select("id,name,icao,latitude,longitude,is_primary_hub").eq("is_published", true).eq("is_active", true),
      supabase.from("operational_routes").select("id,route_name,origin_location_id,destination_location_id,airline_division_id,notes,display_order").eq("is_published", true).eq("is_active", true).order("display_order"),
    ]);
    if (divisionResult.data?.length) airlines = divisionResult.data as Division[];
    if (hubResult.data?.length) {
      const locations = locationResult.data ?? [];
      hubs = hubResult.data.map((hub) => {
        const location = locations.find((item) => item.id === hub.location_id);
        return { id: hub.id, name: hub.name, icao: hub.icao, description: hub.description, image_url: hub.image_url, latitude: location?.latitude ?? 35.6762, longitude: location?.longitude ?? 139.6503, city: location?.name ?? "Japan", is_primary_hub: Boolean(location?.is_primary_hub) };
      }) as Hub[];
    }
    if (routeResult.data?.length) {
      const locations = locationResult.data ?? [];
      routes = routeResult.data.map((route) => {
        const origin = locations.find((item) => item.id === route.origin_location_id);
        const destination = locations.find((item) => item.id === route.destination_location_id);
        const airline = airlines.find((item) => item.id === route.airline_division_id);
        return { id: route.id, route_name: route.route_name, origin: origin?.name ?? "Origin", origin_icao: origin?.icao ?? "----", origin_latitude: origin?.latitude ?? 35.6762, origin_longitude: origin?.longitude ?? 139.6503, destination: destination?.name ?? "Destination", destination_icao: destination?.icao ?? "----", destination_latitude: destination?.latitude ?? 35.6762, destination_longitude: destination?.longitude ?? 139.6503, airline_division_id: route.airline_division_id, airline_name: airline?.name ?? "ANVG", aircraft_names: airline?.fleet_types ?? [], notes: route.notes };
      }) as Route[];
    }
  }
  return <PublicLayout currentPath="/routes"><div className="page-container stage-page network-page"><div className="page-heading"><span className="eyebrow"><span className="eyebrow-line"/> ANVG / WAYPOINTS NETWORK</span><h1>Our world, connected.</h1><p>Explore the group’s operating airlines, Japanese hubs and published routes across the Waypoints community.</p></div><RoutesNetwork airlines={airlines} hubs={hubs} routes={routes}/></div></PublicLayout>;
}
