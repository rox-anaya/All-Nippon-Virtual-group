import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { StagePlaceholder } from "@/components/StagePlaceholder";
import { pageCopy } from "@/lib/site";
export const metadata: Metadata = { title: "Leadership Team" };
export default function Page() { const copy = pageCopy["/staff"]; return <PublicLayout currentPath="/staff"><StagePlaceholder {...copy} currentPath="/staff" /></PublicLayout>; }
