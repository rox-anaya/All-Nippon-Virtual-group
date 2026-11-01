import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { StagePlaceholder } from "@/components/StagePlaceholder";
import { pageCopy } from "@/lib/site";
export const metadata: Metadata = { title: "Network Activity" };
export default function Page() { const copy = pageCopy["/events"]; return <PublicLayout currentPath="/events"><StagePlaceholder {...copy} currentPath="/events" /></PublicLayout>; }
