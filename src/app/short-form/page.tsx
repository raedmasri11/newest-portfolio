import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
export const metadata: Metadata = { title: "Short-Form Video Editing for Reels & Shorts", alternates: { canonical: "/short-form" }, description: "Short-form video editing for creators, personal brands and businesses: hooks, captions, b-roll, pacing and motion." };
export default function Page() { return <ServicePage format="short-form" />; }
