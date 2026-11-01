import type { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { StagePlaceholder } from "@/components/StagePlaceholder";
import { pageCopy } from "@/lib/site";
export const metadata: Metadata = { title: "Join Our Flight Deck" };
export default function Page() { const copy = pageCopy["/apply"]; return <PublicLayout currentPath="/apply"><StagePlaceholder {...copy} currentPath="/apply" /></PublicLayout>; }
