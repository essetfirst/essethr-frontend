#!/usr/bin/env node
/**
 * Migrates simple makeStyles usage to MUI styled() components.
 * Run: node scripts/migrate-makeStyles.mjs
 */
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

function toStyledName(key) {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function convertThemeRefs(styleBody) {
  return styleBody
    .replace(/theme\.spacing\(([^)]+)\)/g, (_, n) => {
      const num = Number(String(n).trim());
      if (!Number.isNaN(num)) return `${num * 8}px`;
      return `theme.spacing(${n})`;
    })
    .replace(/theme\.palette\.([a-zA-Z.]+)/g, "theme.palette.$1");
}

function migrateFile(file) {
  let content = fs.readFileSync(file, "utf8");
  if (!content.includes("makeStyles")) return false;

  const match = content.match(
    /const useStyles = makeStyles\(\(theme\) => \(({[\s\S]*?})\)\);/,
  );
  if (!match) return false;

  const styleObjectRaw = match[1];
  const keys = [...styleObjectRaw.matchAll(/(\w+):\s*\{/g)].map((m) => m[1]);
  if (!keys.length) return false;

  const styledBlocks = [];
  for (const key of keys) {
    const keyMatch = styleObjectRaw.match(
      new RegExp(`${key}:\\s*\\{([\\s\\S]*?)\\}(?=,\\s*\\w+:|\\s*$)`, "m"),
    );
    if (!keyMatch) continue;
    const body = convertThemeRefs(keyMatch[1].trim());
    styledBlocks.push(
      `const Styled${toStyledName(key)} = styled("div")(({ theme }) => ({\n  ${body}\n}));`,
    );
  }

  if (!styledBlocks.length) return false;

  content = content.replace(/import \{ makeStyles \} from "@mui\/styles";\n?/, "");
  content = content.replace(/import \{ makeStyles \} from '@mui\/styles';\n?/, "");

  if (!content.includes('from "@mui/material/styles"') && !content.includes("styled")) {
    content = content.replace(
      /from "@mui\/material";/,
      'from "@mui/material";\nimport { styled } from "@mui/material/styles";',
    );
    if (!content.includes("styled")) {
      content = `import { styled } from "@mui/material/styles";\n${content}`;
    }
  } else if (!content.includes("import { styled }")) {
    content = content.replace(
      /from "@mui\/material\/styles";/,
      'from "@mui/material/styles";\nimport { styled } from "@mui/material/styles";',
    );
  }

  content = content.replace(match[0], styledBlocks.join("\n\n"));
  content = content.replace(/\n\s*const classes = useStyles\(\);\n?/g, "\n");

  for (const key of keys) {
    const styledName = `Styled${toStyledName(key)}`;
    content = content.replace(
      new RegExp(`className=\\{classes\\.${key}\\}`, "g"),
      `component={${styledName}}`,
    );
    content = content.replace(
      new RegExp(`<([A-Za-z][A-Za-z0-9]*)\\s+className=\\{classes\\.${key}\\}`, "g"),
      `<${styledName}`,
    );
  }

  fs.writeFileSync(file, content);
  return true;
}

let count = 0;
for (const file of walk(SRC)) {
  if (migrateFile(file)) {
    count += 1;
    console.log("migrated", path.relative(process.cwd(), file));
  }
}
console.log(`Done. Migrated ${count} files.`);
