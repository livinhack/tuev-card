#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cardTransferDryRun } from "../tools/plate-physical-lab/scripts/card-transfer-dry-run.config.mjs";
import { labOnlyModules } from "../tools/plate-physical-lab/scripts/production-import-boundary.config.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const labRoot = resolve(root, "tools/plate-physical-lab");
const targetBase = String(cardTransferDryRun.targetBase || "src/plate/lab-renderer").replace(/\\/g, "/");
const labOnlySet = new Set(labOnlyModules.map((entry) => String(entry).replace(/\\/g, "/")));
const activeCardFiles = ["src/plate/font.js", "src/plate/mm-model.js", "src/plate/renderer.js"];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function normalize(path) {
  return String(path || "").replace(/\\/g, "/");
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

const mappings = cardTransferDryRun.targetMappings || [];
if (mappings.length !== (cardTransferDryRun.productionFiles || []).length) {
  fail(`Staged copy mapping count mismatch: ${mappings.length}/${(cardTransferDryRun.productionFiles || []).length}`);
}

for (const mapping of mappings) {
  const source = normalize(mapping?.source);
  const target = normalize(mapping?.target);
  const sourcePath = resolve(labRoot, source);
  const targetPath = resolve(root, target);

  if (!source || !target) {
    fail("Staged copy mapping must contain source and target.");
    continue;
  }

  if (!target.startsWith(`${targetBase}/`)) {
    fail(`Staged copy target must stay below ${targetBase}: ${target}`);
  }

  if (labOnlySet.has(source) || labOnlySet.has(target)) {
    fail(`Staged copy must not include lab/debug-only module: ${source} -> ${target}`);
  }

  if (!existsSync(sourcePath)) {
    fail(`Staged copy source is missing: ${source}`);
    continue;
  }

  if (!existsSync(targetPath)) {
    fail(`Staged copy target is missing: ${target}`);
    continue;
  }

  const sourceStat = statSync(sourcePath);
  const targetStat = statSync(targetPath);
  if (!sourceStat.size || !targetStat.size) {
    fail(`Staged copy source/target must not be empty: ${source} -> ${target}`);
  }

  if (sourceStat.size !== targetStat.size || sha256(sourcePath) !== sha256(targetPath)) {
    fail(`Staged copy hash mismatch: ${source} -> ${target}`);
  }
}

for (const forbidden of labOnlyModules) {
  const normalized = normalize(forbidden).replace(/^src\/plate\//, `${targetBase}/`);
  if (!forbidden.endsWith("/") && existsSync(resolve(root, normalized))) {
    fail(`Staged copy includes forbidden lab/debug-only module: ${normalized}`);
  }
}

for (const activeFile of activeCardFiles) {
  if (!existsSync(resolve(root, activeFile))) continue;
  const content = read(activeFile);
  if (content.includes("lab-renderer")) {
    fail(`Active Card file must not import staged lab renderer yet: ${activeFile}`);
  }
}

if (!process.exitCode) {
  console.log(`Card transfer staged copy OK: ${mappings.length}/${mappings.length} files copied under ${targetBase}, active Card renderer unchanged.`);
}
