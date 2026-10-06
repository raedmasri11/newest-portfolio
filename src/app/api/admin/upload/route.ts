import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { isGithubCmsConfigured, writeRepoFile } from "@/lib/githubCms";

export const runtime = "nodejs";

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 55) || "image";
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isGithubCmsConfigured()) return NextResponse.json({ error: "GitHub publishing is not configured yet." }, { status: 503 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    const label = String(form.get("label") ?? "image");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image first." }, { status: 400 });
    const extension = allowedTypes[file.type];
    if (!extension) return NextResponse.json({ error: "Use JPG, PNG, WEBP or GIF." }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });

    const filename = `${Date.now()}-${slugify(label)}.${extension}`;
    const repoPath = `public/uploads/${filename}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeRepoFile({ path: repoPath, content: bytes, message: `Dashboard: upload ${filename}` });
    return NextResponse.json({ ok: true, path: `/uploads/${filename}`, deployTriggered: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not upload the image." }, { status: 500 });
  }
}
