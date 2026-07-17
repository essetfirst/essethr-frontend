#!/usr/bin/env node
import fs from "fs";
import path from "path";

const SRC = path.resolve("src");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(js|jsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function fixFile(content) {
  content = content.replace(/>>/g, ">");
  content = content.replace(
    /(<StyledBackdrop open[^>]*>[\s\S]*?)<\/Backdrop>/g,
    "$1</StyledBackdrop>",
  );
  content = content.replace(
    /<StyledBackdrop open\s*\n/g,
    "<StyledBackdrop open>\n",
  );
  return content;
}

let count = 0;
for (const file of walk(SRC)) {
  let content = fs.readFileSync(file, "utf8");
  const fixed = fixFile(content);
  if (fixed !== content) {
    fs.writeFileSync(file, fixed);
    count += 1;
    console.log("fixed", path.relative(process.cwd(), file));
  }
}
console.log(`Done. Fixed ${count} files.`);
