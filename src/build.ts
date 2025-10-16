import fs from "node:fs";
import path from "node:path";
import { getTheme, repositoryDir } from "./theme";

const zedIconTheme = await getTheme();

const zedManifest = {
  $schema: "https://zed.dev/schema/icon_themes/v0.3.0.json",
  name: "Symbols Icon Theme",
  author: "Zed Industries",
  themes: [zedIconTheme],
};

const iconThemesDir = path.join(import.meta.dirname, "../icon_themes");

if (!fs.existsSync(iconThemesDir)) {
  fs.mkdirSync(iconThemesDir, { recursive: true });
}

fs.writeFileSync(
  path.join(iconThemesDir, "symbols-icon-theme.json"),
  JSON.stringify(zedManifest, null, 2),
);

const copyIcons = (sourceDir: string, destDir: string) => {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.readdirSync(sourceDir).forEach((file) => {
    const sourceFile = path.join(sourceDir, file);
    const destFile = path.join(destDir, file);
    fs.copyFileSync(sourceFile, destFile);
  });
};

// Copy icons from repo to the icons directory
copyIcons(
  path.join(repositoryDir, "./src/icons/files"),
  path.join(import.meta.dirname, "../icons/files"),
);

copyIcons(
  path.join(repositoryDir, "./src/icons/folders"),
  path.join(import.meta.dirname, "../icons/folders"),
);

fs.rmSync(repositoryDir, { recursive: true });

console.log("Symbols Icon Theme icons copied successfuly.");
