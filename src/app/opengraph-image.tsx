import { ImageResponse } from "next/og";
export const alt = "Raed Masri — Video Editor & Motion Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 70, background: "#ebe8df", color: "#111", fontFamily: "sans-serif" }}><div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>Raed Masri.</div><div style={{ display: "flex", flexDirection: "column", gap: 20 }}><div style={{ fontSize: 74, lineHeight: 1.02, fontWeight: 800, maxWidth: 960 }}>Video editor & motion designer.</div><div style={{ fontSize: 30, color: "#555" }}>YouTube · Documentary · Short-form · Motion</div></div></div>, size);
}
