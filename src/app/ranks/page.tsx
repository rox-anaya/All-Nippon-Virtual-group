import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { StagePlaceholder } from "@/components/StagePlaceholder";
import { pageCopy } from "@/lib/site";
export const metadata: Metadata = { title: "Pilot Progression" };
export default function Page() { const copy = pageCopy["/ranks"]; return <PublicLayout currentPath="/ranks"><StagePlaceholder {...copy} currentPath="/ranks" /></PublicLayout>; }
