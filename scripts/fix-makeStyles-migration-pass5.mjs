#!/usr/bin/env node
import fs from "fs";
import path from "path";

const SRC = path.resolve("src");

const PAIRS = [
  ["StyledAvatar", "Avatar"],
  ["StyledPaper", "Paper"],
  ["StyledCard", "Card"],
  ["StyledButton", "Button"],
  ["StyledSubmit", "Button"],
  ["StyledForm", "Box"],
  ["StyledRoot", "Paper"],
  ["StyledRoot", "div"],
  ["StyledRoot", "Card"],
  ["StyledRoot", "Page"],
  ["StyledTitle", "Typography"],
  ["StyledTextWithBorder", "Typography"],
  ["StyledItem", "Paper"],
  ["StyledItemRow", "Box"],
  ["StyledItem", "Box"],
  ["StyledContent", "div"],
  ["StyledActions", "Box"],
  ["StyledProcessStateCard", "Card"],
  ["StyledDialog", "Dialog"],
  ["StyledInput", "TextField"],
  ["StyledImage", "img"],
  ["StyledIcon", "svg"],
  ["StyledLine", "div"],
  ["StyledDot", "div"],
  ["StyledPaper", "Paper"],
  ["StyledCardContent", "CardContent"],
  ["StyledCardMedia", "CardMedia"],
  ["StyledCardHeader", "CardHeader"],
  ["StyledCardPricing", "div"],
  ["StyledHeroButtons", "div"],
  ["StyledHeroContent", "div"],
  ["StyledResetContainer", "div"],
  ["StyledContentArea", "div"],
  ["StyledInstructions", "Typography"],
  ["StyledActionsContainer", "div"],
  ["StyledMetadata", "Card"],
  ["StyledProgress", "Box"],
  ["StyledName", "Typography"],
  ["StyledContactUsButton", "Button"],
  ["StyledFilterField", "TextField"],
  ["StyledToolbar", "Toolbar"],
  ["StyledAppBar", "AppBar"],
  ["StyledDifferenceValue", "Typography"],
  ["StyledBackdrop", "Backdrop"],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(js|jsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function fixClosingTags(content) {
  for (const [styled, original] of PAIRS) {
    if (!content.includes(`<${styled}`)) continue;
    const re = new RegExp(
      `(<${styled}(?:\\s|>|/)[\\s\\S]*?)</${original}>`,
      "g",
    );
    content = content.replace(re, `$1</${styled}>`);
  }
  return content;
}

function fixFile(content) {
  content = fixClosingTags(content);
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
