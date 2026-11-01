import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { RoutesNetwork, fallbackHubs } from "@/components/RoutesNetwork";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Hubs | ANVG" };
export const dynamic = "force-dynamic";

type Hub = { id: string; name: string; icao: string; description: string; image_url: string | null; latitude: number; longitude: number; city: string; is_primary_hub: boolean };

export default async function RoutesPage() {
  const supabase = await createClient();
  let hubs: Hub[] = fallbackHubs;

  if (supabase) {
    const [hubResult, locationResult] = await Promise.all([
      supabase.from("operational_hubs").select("id,name,icao,description,image_url,location_id,display_order").eq("is_published", true).eq("is_active", true).order("display_order"),
      supabase.from("operating_locations").select("id,name,icao,latitude,longitude,is_primary_hub").eq("is_published", true).eq("is_active", true),
    ]);

    if (hubResult.data?.length) {
      const locations = locationResult.data ?? [];
      hubs = hubResult.data.map((hub) => {
        const location = locations.find((item) => item.id === hub.location_id);
        return {
          id: hub.id,
          name: hub.name,
          icao: hub.icao,
          description: hub.description ?? "",
          image_url: hub.image_url,
          latitude: Number(location?.latitude ?? 35.6762),
          longitude: Number(location?.longitude ?? 139.6503),
          city: location?.name ?? "Japan",
          is_primary_hub: Boolean(location?.is_primary_hub),
        };
      }) as Hub[];
    }
  }

  return (
    <PublicLayout currentPath="/routes">
      <div className="page-container stage-page network-page">
        <div className="page-heading">
          <span className="eyebrow"><span className="eyebrow-line" /> ANVG / JAPAN HUB NETWORK</span>
          <h1>Our hubs, connected.</h1>
          <p>Explore the group's operational gateways across Japan on an interactive geographic globe.</p>
        </div>
        <RoutesNetwork hubs={hubs} />
      </div>
    </PublicLayout>
  );
}
