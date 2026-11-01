import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { StagePlaceholder } from "@/components/StagePlaceholder";
import { pageCopy } from "@/lib/site";
export const metadata: Metadata = { title: "Change Log" };
export default function Page() { const copy = pageCopy["/changelog"]; return <PublicLayout currentPath="/changelog"><StagePlaceholder {...copy} currentPath="/changelog" /></PublicLayout>; }
