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

const replacements = [
  [/@material-ui\/core\/styles/g, "@mui/styles"],
  [/@material-ui\/core/g, "@mui/material"],
  [/@material-ui\/icons/g, "@mui/icons-material"],
  [/@material-ui\/lab/g, "@mui/lab"],
  [/@material-ui\/data-grid/g, "@mui/x-data-grid"],
  [/@material-ui\/pickers/g, "@mui/x-date-pickers"],
  [/createMuiTheme/g, "createTheme"],
];

for (const file of walk(SRC)) {
  let content = fs.readFileSync(file, "utf8");
  let next = content;
  for (const [from, to] of replacements) {
    next = next.replace(from, to);
  }
  if (next !== content) {
    fs.writeFileSync(file, next);
    console.log("updated", path.relative(process.cwd(), file));
  }
}
