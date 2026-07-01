#!/usr/bin/env node
import { existsSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { labOnlyModules, productionEntries } from "./production-import-boundary.config.mjs";
import { cardTransferDryRun } from "./card-transfer-dry-run.config.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function normalize(path) {
  return path.replace(/\\/g, "/");
}

function pathExists(relativePath) {
  return existsSync(resolve(root, relativePath));
}

function hasDuplicates(values) {
  return new Set(values).size !== values.length;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasPathTraversal(value) {
  return normalize(value).split("/").includes("..");
}

function unique(values) {
  return [...new Set(values)];
}

for (const file of cardTransferDryRun.productionFiles) {
  if (!pathExists(file)) fail(`Transfer dry run missing production file: ${file}`);
}

for (const file of cardTransferDryRun.labOnlyFiles) {
  if (!file.endsWith("/") && !pathExists(file)) fail(`Transfer dry run missing lab-only marker file: ${file}`);
}

if (hasDuplicates(cardTransferDryRun.productionFiles)) {
  fail("Transfer dry run production file list contains duplicates.");
}

if (hasDuplicates(cardTransferDryRun.labOnlyFiles)) {
  fail("Transfer dry run lab-only file list contains duplicates.");
}

const productionSet = new Set(cardTransferDryRun.productionFiles);
const labOnlySet = new Set(labOnlyModules);
const forbiddenIncluded = cardTransferDryRun.productionFiles.filter((file) => labOnlySet.has(file));
if (forbiddenIncluded.length) {
  fail(`Transfer dry run includes lab/debug-only files: ${forbiddenIncluded.join(", ")}`);
}

const missingConfiguredForbidden = labOnlyModules.filter((file) => !cardTransferDryRun.labOnlyFiles.includes(file));
if (missingConfiguredForbidden.length) {
  fail(`Transfer dry run lab-only list does not include configured forbidden modules: ${missingConfiguredForbidden.join(", ")}`);
}

const missingEntryFiles = productionEntries.filter((entry) => !productionSet.has(entry));
if (missingEntryFiles.length) {
  fail(`Transfer dry run production list does not include production entries: ${missingEntryFiles.join(", ")}`);
}

if (cardTransferDryRun.mode !== "manifest-only") {
  fail(`Transfer dry run mode must remain manifest-only before real Card integration: ${cardTransferDryRun.mode}`);
}

if (cardTransferDryRun.activeCardRendererUnchanged !== true) {
  fail("Transfer dry run must keep active Card renderer unchanged.");
}


const targetMappings = cardTransferDryRun.targetMappings || [];
if (!Array.isArray(targetMappings)) {
  fail("Transfer dry run targetMappings must be an array.");
}

if (targetMappings.length !== cardTransferDryRun.productionFiles.length) {
  fail(`Transfer dry run target mapping count must match production file count: ${targetMappings.length}/${cardTransferDryRun.productionFiles.length}`);
}

const mappingSources = targetMappings.map((mapping) => mapping?.source);
const mappingTargets = targetMappings.map((mapping) => mapping?.target);

for (const [index, mapping] of targetMappings.entries()) {
  if (!mapping || !isNonEmptyString(mapping.source) || !isNonEmptyString(mapping.target)) {
    fail(`Transfer dry run target mapping ${index} must contain source and target strings.`);
    continue;
  }

  if (!productionSet.has(mapping.source)) {
    fail(`Transfer dry run target mapping source is not a production file: ${mapping.source}`);
  }

  if (hasPathTraversal(mapping.source) || hasPathTraversal(mapping.target)) {
    fail(`Transfer dry run target mapping must not contain path traversal: ${mapping.source} -> ${mapping.target}`);
  }

  if (!normalize(mapping.target).startsWith(`${normalize(cardTransferDryRun.targetBase)}/`)) {
    fail(`Transfer dry run target must stay below targetBase ${cardTransferDryRun.targetBase}: ${mapping.target}`);
  }

  if (labOnlySet.has(mapping.source) || labOnlySet.has(mapping.target)) {
    fail(`Transfer dry run target mapping must not include lab/debug-only modules: ${mapping.source} -> ${mapping.target}`);
  }
}

const missingMappedSources = cardTransferDryRun.productionFiles.filter((file) => !mappingSources.includes(file));
if (missingMappedSources.length) {
  fail(`Transfer dry run target mappings miss production sources: ${missingMappedSources.join(", ")}`);
}

const duplicateMappingSources = unique(mappingSources.filter((source, index) => mappingSources.indexOf(source) !== index));
if (duplicateMappingSources.length) {
  fail(`Transfer dry run target mappings contain duplicate sources: ${duplicateMappingSources.join(", ")}`);
}

const duplicateMappingTargets = unique(mappingTargets.filter((target, index) => mappingTargets.indexOf(target) !== index));
if (duplicateMappingTargets.length) {
  fail(`Transfer dry run target mappings contain duplicate targets: ${duplicateMappingTargets.join(", ")}`);
}

if (!process.exitCode) {
  console.log(`Card transfer dry run scaffold OK: ${cardTransferDryRun.productionFiles.length} production files, ${cardTransferDryRun.labOnlyFiles.length} lab-only exclusions, ${targetMappings.length} target mappings, active Card renderer unchanged.`);
}
