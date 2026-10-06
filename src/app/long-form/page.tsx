import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
export const metadata: Metadata = { title: "YouTube & Long-Form Video Editing", alternates: { canonical: "/long-form" }, description: "Story-driven YouTube, documentary, VSL and talking-head video editing by Raed Masri." };
export default function Page() { return <ServicePage format="long-form" />; }
