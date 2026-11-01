import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { StagePlaceholder } from "@/components/StagePlaceholder";
import { pageCopy } from "@/lib/site";
export const metadata: Metadata = { title: "Flight Deck Settings" };
export default function Page() { const copy = pageCopy["/settings"]; return <PublicLayout currentPath="/settings"><StagePlaceholder {...copy} currentPath="/settings" /></PublicLayout>; }
