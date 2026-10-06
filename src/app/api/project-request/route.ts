import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { COOLDOWN_MS, normalizedContactIdentity, validateProjectRequest, type ProjectRequestData } from "@/lib/projectRequest";

export const runtime = "nodejs";

const COOLDOWN_SECONDS = Math.round(COOLDOWN_MS / 1000);
const RATE_LIMIT_SECONDS = 60 * 60;
const MAX_PER_HOUR = 8;
const PENDING_SECONDS = 10 * 60;

type PreflightBody = ProjectRequestData & { action: "preflight"; website: string };
type TokenBody = { action: "confirm" | "cancel"; token: string };
type PendingRecord = { deliveredKey: string; emailKey: string | null; lockKey: string };

function reply(message: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ success: false, message, ...extra }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function serverConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    process.env.PROJECT_REQUEST_HASH_SECRET
  );
}

async function redis(command: (string | number)[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Persistent duplicate protection is not configured");

  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(7000),
  });

  const payload = await response.json();
  if (!response.ok || payload.error) throw new Error("Submission protection is temporarily unavailable");
  return payload.result;
}

function hashed(value: string) {
  const secret = process.env.PROJECT_REQUEST_HASH_SECRET;
  if (!secret) throw new Error("Hash secret is not configured");
  return createHash("sha256").update(`${secret}|${value}`).digest("hex");
}

function clientIp(request: NextRequest) {
  return request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
}

async function preflight(request: NextRequest, body: PreflightBody) {
  if (body.website.length > 0) return reply("Submission could not be accepted.", 400);

  const data: ProjectRequestData = {
    projectType: body.projectType,
    name: body.name,
    contact: body.contact,
    email: body.email,
    budget: body.budget,
    reference: body.reference,
    details: body.details,
  };

  const issues = validateProjectRequest(data);
  if (Object.keys(issues).length) {
    return NextResponse.json(
      { success: false, message: "Please check your project details.", errors: issues },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const ipKey = `raed:project:ratelimit:${hashed(clientIp(request))}`;
  const identity = normalizedContactIdentity(data);
  const deliveredKey = `raed:project:delivered:${hashed(identity)}`;
  const emailKey = data.email.trim()
    ? `raed:project:email:${hashed(data.email.trim().toLowerCase())}`
    : null;
  const lockKey = `raed:project:processing:${hashed(identity)}`;

  const attempts = Number(await redis(["INCR", ipKey]));
  if (attempts === 1) await redis(["EXPIRE", ipKey, RATE_LIMIT_SECONDS]);
  if (attempts > MAX_PER_HOUR) {
    return reply("Too many requests from this connection. Please try again later.", 429);
  }

  const delivered = await redis(["GET", deliveredKey]);
  const deliveredByEmail = emailKey ? await redis(["GET", emailKey]) : null;
  if (delivered || deliveredByEmail) {
    return reply(
      "Your project request has already been sent. I’ll get back to you soon.",
      409,
      { alreadySubmitted: true },
    );
  }

  const locked = await redis(["SET", lockKey, "1", "EX", PENDING_SECONDS, "NX"]);
  if (locked !== "OK") {
    return reply("Your request is already being processed. Please wait a moment.", 429);
  }

  const token = randomBytes(24).toString("hex");
  const pendingKey = `raed:project:pending:${hashed(token)}`;
  const pending: PendingRecord = { deliveredKey, emailKey, lockKey };

  try {
    await redis(["SET", pendingKey, JSON.stringify(pending), "EX", PENDING_SECONDS, "NX"]);
  } catch (error) {
    try { await redis(["DEL", lockKey]); } catch { /* lock expires automatically */ }
    throw error;
  }

  return NextResponse.json(
    { success: true, token },
    { headers: { "Cache-Control": "no-store" } },
  );
}

async function readPending(token: string) {
  if (!/^[a-f0-9]{48}$/i.test(token)) return null;
  const pendingKey = `raed:project:pending:${hashed(token)}`;
  const raw = await redis(["GET", pendingKey]);
  if (!raw || typeof raw !== "string") return null;
  try {
    return { pendingKey, record: JSON.parse(raw) as PendingRecord };
  } catch {
    return null;
  }
}

async function confirm(token: string) {
  const pending = await readPending(token);
  if (!pending) {
    return reply("This submission confirmation has expired. Please try again.", 410);
  }

  const timestamp = String(Date.now());
  await redis(["SET", pending.record.deliveredKey, timestamp, "EX", COOLDOWN_SECONDS]);
  if (pending.record.emailKey) {
    await redis(["SET", pending.record.emailKey, timestamp, "EX", COOLDOWN_SECONDS]);
  }
  await redis(["DEL", pending.record.lockKey]);
  await redis(["DEL", pending.pendingKey]);

  return NextResponse.json(
    { success: true, message: "Submission cooldown recorded." },
    { headers: { "Cache-Control": "no-store" } },
  );
}

async function cancel(token: string) {
  const pending = await readPending(token);
  if (pending) {
    await redis(["DEL", pending.record.lockKey]);
    await redis(["DEL", pending.pendingKey]);
  }
  return NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: NextRequest) {
  if (!serverConfigured()) {
    return reply("Project requests aren't available just yet. Please book a call or message me on WhatsApp.", 503);
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > 15000) return reply("This request is too large.", 413);

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return reply("Please review the project information and try again.", 400);
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return reply("Invalid form data.", 400);
  }

  const body = input as Record<string, unknown>;
  const action = body.action;

  try {
    if (action === "preflight") {
      const keys = ["projectType", "name", "contact", "email", "budget", "reference", "details", "website"] as const;
      if (keys.some((key) => typeof body[key] !== "string")) {
        return reply("Please complete all required fields.", 400);
      }
      return await preflight(request, body as unknown as PreflightBody);
    }

    if (action === "confirm" || action === "cancel") {
      if (typeof body.token !== "string") return reply("Invalid submission token.", 400);
      return action === "confirm" ? await confirm(body.token) : await cancel(body.token);
    }

    return reply("Invalid submission action.", 400);
  } catch {
    return reply("The submission service is temporarily unavailable. Your details have been kept. Please try again.", 503);
  }
}
