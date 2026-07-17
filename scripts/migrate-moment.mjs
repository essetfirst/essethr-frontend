#!/usr/bin/env node
/**
 * Replaces moment.js usage with utils/date helpers.
 * Run from frontend/: node scripts/migrate-moment.mjs
 */
import fs from "fs";
import path from "path";

const SRC = path.resolve("src");

const FORMAT_MAP = {
  "DD/MM/YYYY": "dd/MM/yyyy",
  "DD MMM YYYY": "dd MMM yyyy",
  "YYYY-MM-DD": "yyyy-MM-dd",
  "DD-MM-YYYY": "dd-MM-yyyy",
  "hh:mm A": "hh:mm a",
  "HH:mm": "HH:mm",
  "MMM D, YYYY": "MMM d, yyyy",
  "MMM D, YYYY h:mm A": "MMM d, yyyy h:mm a",
  "MMMM Do": "MMMM do",
  "MMMM, Do YYYY": "MMMM, do yyyy",
  "MMM D": "MMM d",
  "MMM DD,  Y": "MMM dd, yyyy",
  "MMM D, YYYY HH:mm": "MMM d, yyyy HH:mm",
  dddd: "EEEE",
};

const HELPERS = new Set([
  "fmt",
  "fmtNow",
  "fromNow",
  "toDate",
  "parseTime",
  "addDays",
  "subDays",
  "startOfMonth",
  "endOfMonth",
  "startOfWeek",
  "startOfIsoWeek",
  "monthBounds",
  "differenceInDays",
  "differenceInHours",
  "diffDays",
  "diffHours",
  "formatDuration",
  "format",
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(js|jsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function mapFormat(momentPattern) {
  return FORMAT_MAP[momentPattern] || momentPattern
    .replace(/YYYY/g, "yyyy")
    .replace(/DD/g, "dd")
    .replace(/\bDo\b/g, "do")
    .replace(/\bD\b/g, "d")
    .replace(/A/g, "a");
}

function migrateContent(content) {
  if (!content.includes("moment")) return { content, changed: false };

  let next = content;
  const used = new Set();

  const mark = (name) => used.add(name);

  // moment().startOf("month").format("...")
  next = next.replace(
    /moment\(\)\.startOf\(["']month["']\)\.format\(["']([^"']+)["']\)/g,
    (_, p) => {
      mark("monthBounds");
      return `monthBounds().start`;
    },
  );
  next = next.replace(
    /moment\(\)\.endOf\(["']month["']\)\.format\(["']([^"']+)["']\)/g,
    () => {
      mark("monthBounds");
      return `monthBounds().end`;
    },
  );
  next = next.replace(/moment\(\)\.startOf\(["']isoWeek["']\)\.format\(["']YYYY-MM-DD["']\)/g, () => {
    mark("startOfIsoWeek");
    return `startOfIsoWeek()`;
  });
  next = next.replace(/moment\(\)\.startOf\(["']week["']\)/g, () => {
    mark("startOfWeek");
    return `startOfWeek(new Date(), { weekStartsOn: 1 })`;
  });

  // moment().subtract(30, "days").format
  next = next.replace(/moment\(\)\.subtract\((\d+),\s*["']days["']\)\.format\(["']([^"']+)["']\)/g, (_, n, p) => {
    mark("subDays");
    mark("fmt");
    return `fmt(subDays(new Date(), ${n}), "${mapFormat(p)}")`;
  });

  // moment(x).add(n, "days").format
  next = next.replace(/moment\(([^)]+)\)\.add\((\d+),\s*["']days["']\)\.format\(["']([^"']+)["']\)/g, (_, v, n, p) => {
    mark("addDays");
    mark("fmt");
    return `fmt(addDays(toDate(${v}) || new Date(), ${n}), "${mapFormat(p)}")`;
  });
  next = next.replace(/moment\(\)\.add\((\d+),\s*["']days["']\)\.format\(["']([^"']+)["']\)/g, (_, n, p) => {
    mark("addDays");
    mark("fmtNow");
    return `fmt(addDays(new Date(), ${n}), "${mapFormat(p)}")`;
  });
  next = next.replace(/moment\(([^)]+)\)\.add\((\d+),\s*["']days["']\)/g, (_, v, n) => {
    mark("addDays");
    mark("toDate");
    return `addDays(toDate(${v}) || new Date(), ${n})`;
  });

  // moment().format
  next = next.replace(/moment\(\)\.format\(["']([^"']+)["']\)/g, (_, p) => {
    mark("fmtNow");
    return `fmtNow("${mapFormat(p)}")`;
  });

  // moment(x).format with time parse pattern
  next = next.replace(/moment\(([^,]+),\s*["']HH:mm["']\)\.format\(["']([^"']+)["']\)/g, (_, v, p) => {
    mark("parseTime");
    mark("fmt");
    return `fmt(parseTime(${v}), "${mapFormat(p)}")`;
  });

  // moment(x).format
  next = next.replace(/moment\(([^)]+)\)\.format\(["']([^"']+)["']\)/g, (_, v, p) => {
    mark("fmt");
    return `fmt(${v}, "${mapFormat(p)}")`;
  });

  // moment(x).fromNow()
  next = next.replace(/moment\(([^)]+)\)\.fromNow\(\)/g, (_, v) => {
    mark("fromNow");
    return `fromNow(${v})`;
  });

  // moment(x).diff(y, "days")
  next = next.replace(/moment\(([^)]+)\)\.diff\(([^,]+),\s*["']days["']\)/g, (_, a, b) => {
    mark("diffDays");
    return `diffDays(${a}, ${b})`;
  });
  next = next.replace(/moment\(([^)]+)\)\.diff\(([^,]+),\s*["']hours["']\)/g, (_, a, b) => {
    mark("diffHours");
    return `diffHours(${a}, ${b})`;
  });
  next = next.replace(/moment\(([^)]+)\)\.diff\((moment\([^)]+\))\)/g, (_, a, b) => {
    mark("diffHours");
    mark("toDate");
    return `diffHours(${a}, toDate(${b})) * 3600000`;
  });

  // moment(x) standalone in filters
  next = next.replace(/\bmoment\(([^)]+)\)/g, (_, v) => {
    mark("toDate");
    return `toDate(${v})`;
  });

  // Remove moment import
  next = next.replace(/import moment from ["']moment["'];?\n?/g, "");
  next = next.replace(/\/\/ import moment from ["']moment["'];?\n?/g, "");

  if (used.size === 0 && !content.includes("moment")) {
    return { content: next, changed: next !== content };
  }

  const imports = [...used].sort().join(", ");
  const importLine = `import { ${imports} } from "utils/date";\n`;

  if (!next.includes('from "utils/date"')) {
    const firstImport = next.search(/^import /m);
    if (firstImport >= 0) {
      next = next.slice(0, firstImport) + importLine + next.slice(firstImport);
    } else {
      next = importLine + next;
    }
  }

  return { content: next, changed: next !== content };
}

for (const file of walk(SRC)) {
  const content = fs.readFileSync(file, "utf8");
  const { content: next, changed } = migrateContent(content);
  if (changed) {
    fs.writeFileSync(file, next);
    console.log("updated", path.relative(process.cwd(), file));
  }
}

console.log("done");
