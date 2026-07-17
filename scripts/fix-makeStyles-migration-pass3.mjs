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
  content = content.replace(/<StyledRootView\s*\n\s*>/g, "<PageView");
  content = content.replace(/<StyledRootView>>/g, "<PageView>");
  content = content.replace(/<StyledBackdrop>\s*open>/g, "<StyledBackdrop open");
  content = content.replace(
    /const StyledBackdrop = styled\("div"\)/g,
    "const StyledBackdrop = styled(Backdrop)",
  );
  content = content.replace(/<StyledProgress>>/g, "<Box");
  content = content.replace(
    /(<StyledBackdrop open>[\s\S]*?)<\/Backdrop>/g,
    "$1</StyledBackdrop>",
  );

  // Dialog component={StyledDialog} -> use styled Dialog
  content = content.replace(
    /const StyledDialog = styled\("div"\)/g,
    "const StyledDialog = styled(Dialog)",
  );
  content = content.replace(
    /<Dialog([^>]*)\scomponent=\{StyledDialog\}/g,
    "<StyledDialog$1",
  );

  // PageView component={StyledRoot} -> PageView sx
  content = content.replace(
    /<PageView\s+component=\{StyledRoot\}/g,
    "<PageView",
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
