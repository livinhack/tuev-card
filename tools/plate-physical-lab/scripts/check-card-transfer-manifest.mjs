#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cardTransferDryRun } from "./card-transfer-dry-run.config.mjs";
import { labOnlyModules } from "./production-import-boundary.config.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function normalize(path) {
  return String(path || "").replace(/\\/g, "/");
}

function sha256(relativePath) {
  const buffer = readFileSync(resolve(root, relativePath));
  return {
    bytes: buffer.length,
    sha256: createHash("sha256").update(buffer).digest("hex")
  };
}

const mappings = cardTransferDryRun.targetMappings || [];
const productionFiles = cardTransferDryRun.productionFiles || [];
const labOnlySet = new Set(labOnlyModules);
const sourceOrder = new Map(productionFiles.map((file, index) => [file, index]));

if (cardTransferDryRun.mode !== "manifest-only") {
  fail(`Card transfer manifest preview requires manifest-only mode: ${cardTransferDryRun.mode}`);
}

if (cardTransferDryRun.activeCardRendererUnchanged !== true) {
  fail("Card transfer manifest preview requires active Card renderer to remain unchanged.");
}

if (mappings.length !== productionFiles.length) {
  fail(`Card transfer manifest mapping count mismatch: ${mappings.length}/${productionFiles.length}`);
}

let previousIndex = -1;
const manifest = [];

for (const mapping of mappings) {
  const source = normalize(mapping?.source);
  const target = normalize(mapping?.target);

  if (!sourceOrder.has(source)) {
    fail(`Manifest source is not part of productionFiles: ${source}`);
    continue;
  }

  const sourceIndex = sourceOrder.get(source);
  if (sourceIndex < previousIndex) {
    fail(`Manifest mapping order must follow productionFiles order: ${source}`);
  }
  previousIndex = sourceIndex;

  if (labOnlySet.has(source) || labOnlySet.has(target)) {
    fail(`Manifest must not include lab/debug-only module: ${source} -> ${target}`);
  }

  if (!target.startsWith(`${normalize(cardTransferDryRun.targetBase)}/`)) {
    fail(`Manifest target must stay below ${cardTransferDryRun.targetBase}: ${target}`);
  }

  try {
    const fileHash = sha256(source);
    if (!fileHash.bytes) fail(`Manifest source must not be empty: ${source}`);
    manifest.push({ source, target, ...fileHash });
  } catch (error) {
    fail(`Manifest source cannot be read: ${source} (${error.message})`);
  }
}

const totalBytes = manifest.reduce((sum, entry) => sum + entry.bytes, 0);
const duplicateHashes = manifest
  .map((entry) => entry.sha256)
  .filter((hash, index, values) => values.indexOf(hash) !== index);

if (duplicateHashes.length) {
  fail("Card transfer manifest contains duplicate source content hashes; review before transfer.");
}

if (!process.exitCode) {
  console.log(`Card transfer manifest preview OK: ${manifest.length} entries, ${totalBytes} bytes, active Card renderer unchanged.`);
}
