import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { StagePlaceholder } from "@/components/StagePlaceholder";
import { pageCopy } from "@/lib/site";
export const metadata: Metadata = { title: "Codeshare Alliances" };
export default function Page() { const copy = pageCopy["/codeshare"]; return <PublicLayout currentPath="/codeshare"><StagePlaceholder {...copy} currentPath="/codeshare" /></PublicLayout>; }
