/**
 * Normalizes imports to absolute paths from src/ (jsconfig baseUrl).
 * Run from frontend/: node scripts/fix-imports.js
 */
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "../src");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(jsx?)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function depthFromSrc(filePath) {
  return path.relative(SRC, path.dirname(filePath)).split(path.sep).length;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;
  const rel = path.relative(SRC, filePath).replace(/\\/g, "/");
  const inFeatures = rel.startsWith("features/");

  // api/index.js barrel
  content = content.replace(/from "\.\/features\//g, 'from "features/');

  // Root barrel API (not feature-local api.js)
  content = content.replace(
    /from ['"](\.\.\/)+api['"]/g,
    'from "api"'
  );
  content = content.replace(
    /from ['"](\.\.\/)+api\/(auth|org|attendance|employees|leaves|payroll|users)['"]/g,
    'from "api"'
  );

  // Shared src-level modules -> absolute
  const srcModules = [
    "components",
    "providers",
    "helpers",
    "utils",
    "assets",
    "config",
    "theme",
    "layouts",
    "hooks",
  ];

  for (const mod of srcModules) {
    const re = new RegExp(`from ['"](?:\\.\\./)+${mod}(\\/[^'"]*)?['"]`, "g");
    content = content.replace(re, (_, sub = "") => `from "${mod}${sub || ""}"`);
  }

  // Feature cross-imports: ../../features/X/... -> features/X/...
  content = content.replace(
    /from ['"](?:\.\.\/)+features\/([^'"]+)['"]/g,
    'from "features/$1"'
  );

  // Wrong notification-snackbar / theme under features/
  content = content.replace(
    /from ['"](?:\.\.\/)+features\/notification-snackbar['"]/g,
    'from "providers/notification-snackbar"'
  );
  content = content.replace(
    /from ['"](?:\.\.\/)+features\/theme['"]/g,
    'from "providers/theme"'
  );

  // providers/auth|org at old paths
  content = content.replace(
    /from ['"]\.\.\/providers\/auth['"]/g,
    'from "features/auth/providers"'
  );
  content = content.replace(
    /from ['"](?:\.\.\/)+providers\/(auth|org)['"]/g,
    (_, name) => `from "features/${name}/providers"`
  );
  content = content.replace(
    /from ['"](?:\.\.\/)+providers\/theme['"]/g,
    'from "providers/theme"'
  );

  // Same-feature sibling auth in org provider
  if (rel === "features/org/providers/Provider.js") {
    content = content.replace(
      /from ['"]\.\.\/auth['"]/g,
      'from "features/auth/providers"'
    );
  }

  // Cross-feature relative paths within features tree
  if (inFeatures) {
    content = content.replace(
      /from ['"](?:\.\.\/)+attendance\/([^'"]+)['"]/g,
      'from "features/attendance/views/$1"'
    );
    content = content.replace(
      /from ['"](?:\.\.\/)+org\/providers['"]/g,
      'from "features/org/providers"'
    );
    content = content.replace(
      /from ['"](?:\.\.\/)+auth\/providers['"]/g,
      'from "features/auth/providers"'
    );
    content = content.replace(
      /from ['"](?:\.\.\/)+leave(?:s)?(?:\/providers)?['"]/g,
      'from "features/leaves/providers"'
    );
    content = content.replace(
      /from ['"](?:\.\.\/)+attendance(?:\/providers)?['"]/g,
      'from "features/attendance/providers"'
    );
    content = content.replace(
      /from ['"](?:\.\.\/)+payroll(?:\/providers)?['"]/g,
      'from "features/payroll/providers"'
    );
  }

  // Feature api files importing request client
  if (rel.endsWith("/api.js")) {
    content = content.replace(
      /from ['"](?:\.\.\/)+api\/request['"]/g,
      'from "api/request"'
    );
  }

  // views/errors still at old path
  if (rel.startsWith("views/") || rel.startsWith("components/")) {
    content = content.replace(
      /from ['"](?:\.\.\/)+features\/([^'"]+)['"]/g,
      'from "features/$1"'
    );
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log("fixed:", rel);
    return true;
  }
  return false;
}

const files = walk(SRC);
let changed = 0;
for (const file of files) {
  if (fixFile(file)) changed++;
}
console.log(`\nDone. Updated ${changed} files.`);
