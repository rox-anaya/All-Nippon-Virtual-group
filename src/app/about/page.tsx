import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { StagePlaceholder } from "@/components/StagePlaceholder";
import { pageCopy } from "@/lib/site";
export const metadata: Metadata = { title: "Discover ANVG" };
export default function Page() { const copy = pageCopy["/about"]; return <PublicLayout currentPath="/about"><StagePlaceholder {...copy} currentPath="/about" /></PublicLayout>; }
