import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve, relative, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const versionMatch = String(packageJson.version || "").match(/-(b\d+)$/);
const version = versionMatch ? versionMatch[1] : packageJson.version;
const entry = resolve(root, "src/tuev-card-entry.js");
const dist = resolve(root, "dist");
const bundlePath = resolve(dist, "tuev-card.js");
const moduleIds = new Map();
const modules = [];

function withoutQuery(spec) {
  return spec.split("?")[0];
}

function moduleName(path) {
  return "__m_" + relative(root, path).replace(/[^A-Za-z0-9_$]/g, "_");
}

function resolveModule(current, spec) {
  return resolve(dirname(current), withoutQuery(spec));
}

function collect(path) {
  path = resolve(path);
  if (moduleIds.has(path)) return;
  moduleIds.set(path, moduleName(path));
  const code = readFileSync(path, "utf8");

  for (const match of code.matchAll(/import\s*\{[\s\S]*?\}\s*from\s*["']([^"']+)["']\s*;/g)) {
    collect(resolveModule(path, match[1]));
  }

  for (const match of code.matchAll(/export\s*\{[\s\S]*?\}\s*from\s*["']([^"']+)["']\s*;/g)) {
    collect(resolveModule(path, match[1]));
  }

  modules.push(path);
}

function parseNamedList(text) {
  return text.replace(/\n/g, " ").split(",").map((part) => part.trim()).filter(Boolean).map((part) => {
    if (part.includes(" as ")) {
      const [imported, local] = part.split(" as ").map((item) => item.trim());
      return { imported, local };
    }
    return { imported: part, local: part };
  });
}

function transformModule(path, isEntry) {
  let code = readFileSync(path, "utf8");
  const exportedPairs = [];
  const declared = new Set();

  code = code.replace(/import\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']\s*;/g, (_match, body, spec) => {
    const dep = moduleIds.get(resolveModule(path, spec));
    const destructured = parseNamedList(body).map(({ imported, local }) => {
      declared.add(local);
      return imported === local ? imported : `${imported}: ${local}`;
    });
    return `const { ${destructured.join(", ")} } = ${dep};`;
  });

  code = code.replace(/export\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']\s*;/g, (_match, body, spec) => {
    const dep = moduleIds.get(resolveModule(path, spec));
    const destructured = parseNamedList(body).map(({ imported, local: exported }) => {
      const local = declared.has(exported) ? `__reexport_${exported}` : exported;
      declared.add(local);
      exportedPairs.push({ exported, local });
      return imported === local ? imported : `${imported}: ${local}`;
    });
    return `const { ${destructured.join(", ")} } = ${dep};`;
  });

  code = code.replace(/export\s+(const|let|var|async function|function|class)\s+([A-Za-z_$][\w$]*)/g, (_match, kind, name) => {
    declared.add(name);
    exportedPairs.push({ exported: name, local: name });
    return `${kind} ${name}`;
  });

  code = code.replace(/export\s*\{([\s\S]*?)\}\s*;/g, (_match, body) => {
    for (const { imported: local, local: exported } of parseNamedList(body)) {
      exportedPairs.push({ exported, local });
    }
    return "";
  });

  if (isEntry) return `${code}\nreturn {};\n`;

  const seen = new Set();
  const exports = [];
  for (const { exported, local } of exportedPairs) {
    if (seen.has(exported)) continue;
    seen.add(exported);
    exports.push(`${exported}: ${local}`);
  }

  return `${code}\nreturn { ${exports.join(", ")} };\n`;
}

function isFontBinary(path) {
  return /\.(ttf|otf|woff2?)$/i.test(path);
}

function copyDirectoryContents(sourceDir, targetDir) {
  if (!existsSync(sourceDir)) return { files: 0, fontBinaries: 0 };

  mkdirSync(targetDir, { recursive: true });

  let files = 0;
  let fontBinaries = 0;

  for (const entryName of readdirSync(sourceDir)) {
    const sourcePath = join(sourceDir, entryName);
    const targetPath = join(targetDir, entryName);
    const stat = statSync(sourcePath);

    if (stat.isDirectory()) {
      const child = copyDirectoryContents(sourcePath, targetPath);
      files += child.files;
      fontBinaries += child.fontBinaries;
      continue;
    }

    copyFileSync(sourcePath, targetPath);
    files += 1;
    if (isFontBinary(sourcePath)) fontBinaries += 1;
  }

  return { files, fontBinaries };
}

collect(entry);

let bundled = `// TÜV Card bundled ${version}\n`;
bundled += "// This file is generated from the modular source files. Do not edit manually.\n";

for (const path of modules) {
  const id = moduleIds.get(path);
  const rel = relative(root, path).replace(/\\/g, "/");
  bundled += `\n// ---- ${rel} ----\nconst ${id} = (() => {\n${transformModule(path, path === entry)}\n})();\n`;
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
writeFileSync(bundlePath, bundled);
const copiedFonts = copyDirectoryContents(resolve(root, "fonts"), resolve(dist, "fonts"));
console.log(`Built dist/tuev-card.js for ${version}.`);
console.log(`Copied ${copiedFonts.files} file(s) from fonts/ to dist/fonts/ (${copiedFonts.fontBinaries} font binary file(s)).`);
if (copiedFonts.fontBinaries === 0) {
  console.warn("No font binary files were copied. This is expected for ChatGPT ZIPs, but local GitHub/HACS release builds should include the GL font files.");
}
