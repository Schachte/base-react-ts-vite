import { type Plugin } from "vite";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

function run(cmd: string) {
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (err) {
    console.error(`[fetchArticles] ❌ Command failed: ${cmd}`);
    console.error((err as Error).message);
  }
}

function fetchPrivateRepo() {
  const DEST = path.resolve("external-content");
  const REPO_URL = process.env.PRIVATE_REPO_URL;
  const TOKEN = process.env.PRIVATE_REPO_TOKEN;
  const LOCAL_MODE = process.env.LOCAL_MODE === "true";

  const IS_CI =
    !!process.env.CI || !!process.env.VERCEL || !!process.env.GITHUB_ACTIONS;
  const ACTIVE_LOCAL_MODE = LOCAL_MODE || !IS_CI;

  const log = (...args: any[]) => console.log("[fetchArticles]", ...args);

  if (ACTIVE_LOCAL_MODE) {
    log("🧩 Local mode active — skipping fetch.");
    if (!fs.existsSync(DEST)) {
      log("⚠️ No external-content/ folder found. You can clone manually:");
      log(
        "   git clone git@github.com:YOURUSER/private-articles.git external-content"
      );
    }
    return;
  }

  log("🚀 Remote/CI mode: syncing private repo...");

  if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

  if (fs.existsSync(path.join(DEST, ".git"))) {
    try {
      log("🔄 Updating existing private repo...");
      run(`git -C ${DEST} pull`);
      return;
    } catch {
      log("⚠️ Pull failed, removing and recloning...");
      fs.rmSync(DEST, { recursive: true, force: true });
    }
  }

  if (!REPO_URL) {
    console.error("❌ PRIVATE_REPO_URL not set, cannot clone.");
    return;
  }

  const authedUrl = TOKEN
    ? `https://${TOKEN}@${REPO_URL}`
    : `https://${REPO_URL}`;

  log("📦 Cloning repo...");
  run(`git clone --depth=1 ${authedUrl} ${DEST}`);
  log("✅ Repo cloned to external-content/");
}

export function PrivateRepoPlugin(): Plugin {
  return {
    name: "vite:private-repo-fetch",
    enforce: "pre",
    async configResolved() {
      fetchPrivateRepo();
    },
    configureServer() {
      fetchPrivateRepo();
    },
  };
}
