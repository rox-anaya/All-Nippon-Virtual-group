import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { StagePlaceholder } from "@/components/StagePlaceholder";
import { pageCopy } from "@/lib/site";
export const metadata: Metadata = { title: "Global Network" };
export default function Page() { const copy = pageCopy["/routes"]; return <PublicLayout currentPath="/routes"><StagePlaceholder {...copy} currentPath="/routes" /></PublicLayout>; }
