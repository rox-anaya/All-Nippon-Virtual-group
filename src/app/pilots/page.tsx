import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { StagePlaceholder } from "@/components/StagePlaceholder";
import { pageCopy } from "@/lib/site";
export const metadata: Metadata = { title: "Our Pilots" };
export default function Page() { const copy = pageCopy["/pilots"]; return <PublicLayout currentPath="/pilots"><StagePlaceholder {...copy} currentPath="/pilots" /></PublicLayout>; }
