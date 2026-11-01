import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { StagePlaceholder } from "@/components/StagePlaceholder";
import { pageCopy } from "@/lib/site";
export const metadata: Metadata = { title: "The Wings of ANVG" };
export default function Page() { const copy = pageCopy["/fleet"]; return <PublicLayout currentPath="/fleet"><StagePlaceholder {...copy} currentPath="/fleet" /></PublicLayout>; }
