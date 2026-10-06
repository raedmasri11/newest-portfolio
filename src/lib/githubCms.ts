const apiBase = "https://api.github.com";

function env(name: string) {
  return process.env[name]?.trim() ?? "";
}

export function isGithubCmsConfigured() {
  return Boolean(env("GITHUB_CMS_TOKEN") && env("GITHUB_CMS_OWNER") && env("GITHUB_CMS_REPO"));
}

function repoInfo() {
  return {
    token: env("GITHUB_CMS_TOKEN"),
    owner: env("GITHUB_CMS_OWNER"),
    repo: env("GITHUB_CMS_REPO"),
    branch: env("GITHUB_CMS_BRANCH") || "main",
  };
}

function headers() {
  const { token } = repoInfo();
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "raed-portfolio-admin",
  };
}

export async function readRepoFile(path: string) {
  if (!isGithubCmsConfigured()) throw new Error("GitHub CMS is not configured.");
  const { owner, repo, branch } = repoInfo();
  const response = await fetch(`${apiBase}/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}?ref=${encodeURIComponent(branch)}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`GitHub read failed (${response.status}).`);
  const payload = await response.json() as { content?: string; encoding?: string; sha: string };
  if (!payload.content || payload.encoding !== "base64") throw new Error("Unexpected GitHub file response.");
  const content = Buffer.from(payload.content.replace(/\n/g, ""), "base64");
  return { content, sha: payload.sha };
}

export async function readRepoJson<T>(path: string) {
  const { content, sha } = await readRepoFile(path);
  return { data: JSON.parse(content.toString("utf8")) as T, sha };
}

export async function writeRepoFile({ path, content, message, sha }: { path: string; content: Buffer | string; message: string; sha?: string }) {
  if (!isGithubCmsConfigured()) throw new Error("GitHub CMS is not configured.");
  const { owner, repo, branch } = repoInfo();
  const body: Record<string, string> = {
    message,
    content: Buffer.isBuffer(content) ? content.toString("base64") : Buffer.from(content).toString("base64"),
    branch,
  };
  if (sha) body.sha = sha;
  const response = await fetch(`${apiBase}/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`, {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (response.status === 409 || response.status === 422) {
    throw new Error("The content changed on GitHub while you were editing. Refresh the dashboard and try again.");
  }
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub write failed (${response.status}): ${detail.slice(0, 220)}`);
  }
  return response.json();
}

export async function writeRepoJson(path: string, data: unknown, message: string, sha: string) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  return writeRepoFile({ path, content, message, sha });
}
