import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { StagePlaceholder } from "@/components/StagePlaceholder";
import { pageCopy } from "@/lib/site";
export const metadata: Metadata = { title: "Pilot Training & Evaluation" };
export default function Page() { const copy = pageCopy["/training"]; return <PublicLayout currentPath="/training"><StagePlaceholder {...copy} currentPath="/training" /></PublicLayout>; }
