#!/usr/bin/env node
/**
 * Fixes common issues from migrate-makeStyles.mjs:
 * - unquoted px values
 * - extra closing braces in styled() blocks
 * - invalid component={StyledX} on div/span elements
 * - Card/Avatar/Typography/Button component={StyledX} -> styled(MuiComponent)
 */
import fs from "fs";
import path from "path";

const SRC = path.resolve("src");

const SPACING_MAP = {
  0: 0,
  8: 1,
  16: 2,
  24: 3,
  32: 4,
  40: 5,
  48: 6,
  56: 7,
  64: 8,
};

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(js|jsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function pxToSpacing(prop, px) {
  const n = Number(px);
  if (SPACING_MAP[n] !== undefined) {
    if (SPACING_MAP[n] === 0) return `${prop}: 0`;
    return `${prop}: theme.spacing(${SPACING_MAP[n]})`;
  }
  return `${prop}: "${px}px"`;
}

function fixPxValues(content) {
  return content.replace(
    /(\b(?:margin|padding|marginTop|marginBottom|marginLeft|marginRight|paddingTop|paddingBottom|paddingLeft|paddingRight|gap|top|bottom|left|right)):\s*(\d+)px/g,
    (_, prop, px) => pxToSpacing(prop, px),
  );
}

function fixStyledExtraBrace(content) {
  return content.replace(
    /(const Styled\w+ = styled[\s\S]*?\(\{ theme \}\) => \(\{[\s\S]*?)\n  \},\n\}\)\);/g,
    "$1\n}));",
  );
}

function fixDivComponentProp(content) {
  let result = content;
  const divPattern = /<div component=\{(Styled\w+)\}>/g;
  const replacements = [];
  let match;
  while ((match = divPattern.exec(content)) !== null) {
    replacements.push({ from: match[0], to: `<${match[1]}>`, styled: match[1] });
  }
  for (const { from, to } of replacements) {
    result = result.replace(from, to);
  }
  return result;
}

const MUI_COMPONENT_MAP = {
  Card: "Card",
  Avatar: "Avatar",
  Typography: "Typography",
  Button: "Button",
  Paper: "Paper",
  Box: "Box",
  Backdrop: "Backdrop",
  TextField: "TextField",
  FormControl: "FormControl",
  AppBar: "AppBar",
  Toolbar: "Toolbar",
  TableCell: "TableCell",
  TableRow: "TableRow",
  IconButton: "IconButton",
  ListItem: "ListItem",
  Tab: "Tab",
  Tabs: "Tabs",
  Chip: "Chip",
  Page: "Page",
};

function fixMuiComponentProp(content) {
  let result = content;
  for (const [tag, muiName] of Object.entries(MUI_COMPONENT_MAP)) {
    const pattern = new RegExp(`<${tag}([^>]*)\\scomponent=\\{(Styled\\w+)\\}`, "g");
    result = result.replace(pattern, (full, attrs, styledName) => {
      result = result.replace(
        new RegExp(`const ${styledName} = styled\\("(?:div|span)"\\)`),
        `const ${styledName} = styled(${muiName})`,
      );
      return `<${styledName}${attrs}>`;
    });
  }
  return result;
}

function fixDuplicateComponentProp(content) {
  return content.replace(
    /component="([^"]+)"\s+component=\{(Styled\w+)\}/g,
    "component={$2}",
  );
}

function fixSpanComponentProp(content) {
  return content.replace(/<span component=\{(Styled\w+)\}/g, "<$1");
}

function fixIconComponentProp(content) {
  return content.replace(
    /<(\w+Icon)\s+component=\{(Styled\w+)\}/g,
    "<$2 as={$1}",
  );
}

function fixFile(file) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  if (!content.includes("Styled") && !content.includes("@mui/styles")) {
    return false;
  }

  content = fixPxValues(content);
  content = fixStyledExtraBrace(content);
  content = fixMuiComponentProp(content);
  content = fixDivComponentProp(content);
  content = fixSpanComponentProp(content);
  content = fixIconComponentProp(content);
  content = fixDuplicateComponentProp(content);

  if (content !== original) {
    fs.writeFileSync(file, content);
    return true;
  }
  return false;
}

let count = 0;
for (const file of walk(SRC)) {
  if (fixFile(file)) {
    count += 1;
    console.log("fixed", path.relative(process.cwd(), file));
  }
}
console.log(`Done. Fixed ${count} files.`);
