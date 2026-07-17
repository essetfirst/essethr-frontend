#!/usr/bin/env node
/**
 * Second pass: fix broken JSX from migrate-makeStyles.mjs / pass1.
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

function fixBrokenPageOpen(content) {
  return content.replace(/<StyledRoot>\s*title=/g, "<StyledRoot title=");
}

function fixDoubleAngle(content) {
  return content.replace(/<StyledRoot title="([^"]+)">>/g, '<StyledRoot title="$1">');
}

function fixLayoutClosingTags(content) {
  // MainLayout / DashboardLayout: replace trailing </div></div></div></div> after StyledContent
  if (
    content.includes("StyledContent") &&
    content.includes("<StyledContent>") &&
    content.includes("</div>")
  ) {
    content = content.replace(
      /(<StyledContent>[\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
      "$1</StyledContent>\n        </StyledContentContainer>\n      </StyledWrapper>\n    </StyledRoot>",
    );
    content = content.replace(
      /(<StyledContent>[\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/,
      "$1</StyledContent>\n        </StyledContentContainer>\n      </StyledWrapper>",
    );
  }
  return content;
}

function fixPageClosingWhenStyledRootOpen(content) {
  if (content.includes("<StyledRoot title=") && content.includes("</Page>")) {
    content = content.replace(/<\/Page>/g, "</StyledRoot>");
  }
  return content;
}

function fixStyledRootToStyledPage(content) {
  if (!content.includes('import Page from')) return content;
  if (!content.includes("const StyledRoot = styled")) return content;

  content = content.replace(
    /const StyledRoot = styled\("div"\)\(\(\{ theme \}\) => \(\{([\s\S]*?)\}\)\);/,
    "const StyledRoot = styled(Page)(({ theme }) => ({$1}));",
  );
  return content;
}

function fixRemainingDivComponent(content) {
  return content.replace(/<div component=\{(Styled\w+)\}/g, "<$1");
}

function fixFile(file) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  content = fixBrokenPageOpen(content);
  content = fixDoubleAngle(content);
  content = fixStyledRootToStyledPage(content);
  content = fixPageClosingWhenStyledRootOpen(content);
  content = fixLayoutClosingTags(content);
  content = fixRemainingDivComponent(content);

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
