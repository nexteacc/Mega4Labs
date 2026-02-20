#!/usr/bin/env tsx
/**
 * Video Availability Validator for Mega 4 Labs
 *
 * Uses YouTube's free oEmbed API (no API key needed) to check whether each
 * video in videos.json is still accessible. Deleted, private, or
 * region-blocked videos return 404 → they are removed automatically.
 *
 * Usage:
 *   pnpm validate-videos            # dry-run: report only, no writes
 *   pnpm validate-videos --fix      # auto-remove dead videos from videos.json
 *
 * Recommended to run:
 *   - Before every pnpm fetch-videos run
 *   - As a weekly scheduled CI job (e.g. GitHub Actions cron)
 */

import { readFileSync, writeFileSync } from "fs";
import type { LandingVideo } from "../src/lib/types";

const VIDEOS_FILE_PATH = "src/data/videos.json";
const OEMBED_BASE = "https://www.youtube.com/oembed?format=json&url=";
const CONCURRENCY = 5; // parallel requests at a time (be polite to YouTube)
const TIMEOUT_MS = 8_000;

const shouldFix = process.argv.includes("--fix");

// ── helpers ────────────────────────────────────────────────────────────────

async function checkVideo(id: string): Promise<"ok" | "dead"> {
    const url = `${OEMBED_BASE}https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        return res.ok ? "ok" : "dead";
    } catch {
        return "dead"; // network error / timeout → treat as dead
    }
}

/** Run tasks with limited concurrency */
async function pLimit<T>(
    tasks: (() => Promise<T>)[],
    limit: number,
): Promise<T[]> {
    const results: T[] = [];
    let idx = 0;

    async function worker() {
        while (idx < tasks.length) {
            const i = idx++;
            results[i] = await tasks[i]();
        }
    }

    await Promise.all(Array.from({ length: limit }, worker));
    return results;
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
    console.log("🔍 Mega 4 Labs — Video Availability Check");
    console.log(`   Mode: ${shouldFix ? "AUTO-FIX (will write changes)" : "DRY-RUN (report only)"}\n`);

    const raw = readFileSync(VIDEOS_FILE_PATH, "utf-8");
    const videos = JSON.parse(raw) as LandingVideo[];

    // Deduplicate IDs for checking (one check per unique ID)
    const uniqueIds = [...new Set(videos.map((v) => v.id))];
    console.log(`   Checking ${uniqueIds.length} unique video IDs from ${videos.length} total entries...\n`);

    const statusMap = new Map<string, "ok" | "dead">();

    const tasks = uniqueIds.map((id) => async () => {
        const status = await checkVideo(id);
        statusMap.set(id, status);
        const icon = status === "ok" ? "✅" : "❌";
        const title = videos.find((v) => v.id === id)?.title?.slice(0, 55) ?? id;
        console.log(`   ${icon} ${id}  ${title}`);
        return status;
    });

    await pLimit(tasks, CONCURRENCY);

    const deadIds = [...statusMap.entries()]
        .filter(([, s]) => s === "dead")
        .map(([id]) => id);

    console.log(`\n📊 Results: ${uniqueIds.length - deadIds.length} OK, ${deadIds.length} dead`);

    if (deadIds.length === 0) {
        console.log("🎉 All videos are accessible. Nothing to remove.");
        return;
    }

    console.log("\n💀 Dead videos (404 / private / deleted):");
    for (const id of deadIds) {
        const entry = videos.find((v) => v.id === id);
        console.log(`   - ${id}  "${entry?.title?.slice(0, 60)}"`);
    }

    if (!shouldFix) {
        console.log(
            "\n⚠️  Dry-run mode: no changes written. Re-run with --fix to auto-remove.",
        );
        process.exit(1); // non-zero exit so CI can catch this
    }

    // Remove all entries with dead IDs
    const deadSet = new Set(deadIds);
    const cleaned = videos.filter((v) => !deadSet.has(v.id));
    const removed = videos.length - cleaned.length;

    writeFileSync(VIDEOS_FILE_PATH, JSON.stringify(cleaned, null, 2));
    console.log(
        `\n✅ Removed ${removed} entries (${deadIds.length} unique IDs). videos.json updated.`,
    );
}

main().catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
});
