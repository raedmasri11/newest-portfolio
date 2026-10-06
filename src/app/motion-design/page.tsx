import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
export const metadata: Metadata = { title: "Motion Design & Motion Graphics", alternates: { canonical: "/motion-design" }, description: "Motion graphics, kinetic typography and visual animation integrated into video edits by Raed Masri." };
export default function Page() { return <ServicePage format="motion" />; }
