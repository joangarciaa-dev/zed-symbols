import fs from "node:fs";
import path from "node:path";
import { simpleGit } from "simple-git";
import type { IconTheme } from "./types/icon-theme";
import type { VSCodeIconTheme } from "./types/vscode-icon-theme";

const symbolsRepository = "https://github.com/miguelsolorio/vscode-symbols.git";

const keyMapping: { [key: string]: string } = {
  git: "vcs",
  console: "terminal",
  code: "json",
  coffeescript: "coffee",
  default: "file",
  storage: "database",
  template: "templ",
};

const updateToLatestTag = async (repoDir: string) => {
  const git = simpleGit({
    baseDir: repoDir,
    binary: "git",
    maxConcurrentProcesses: 1,
    trimmed: false,
  });

  const tags = await git.tags();

  const latestTag = tags?.latest;

  console.log(`Updating Symbols Repository to: ${latestTag}`);

  await git.pull(symbolsRepository, latestTag);
};

const getRepoDir = async (): Promise<string> => {
  const baseDir = path.join(import.meta.dirname, "../");

  const repoDir = path.join(baseDir, "./symbols");

  if (!fs.existsSync(repoDir)) {
    const git = simpleGit({
      baseDir: baseDir,
      binary: "git",
      maxConcurrentProcesses: 1,
      trimmed: false,
    });

    console.log(`Cloning Symbols Repository in: ${repoDir}`);

    await git.clone(symbolsRepository, repoDir);
  }

  await updateToLatestTag(repoDir);

  return repoDir;
};

export const repositoryDir = await getRepoDir();

export const getTheme = async (): Promise<IconTheme> => {
  const data = fs.readFileSync(
    path.join(repositoryDir, "./src/symbol-icon-theme.json"),
    "utf-8",
  );
  const symbolsIconTheme = JSON.parse(data) as VSCodeIconTheme;

  const transformedIconDefinitions = Object.fromEntries(
    Object.entries(symbolsIconTheme.iconDefinitions ?? {})
      .filter(([key]) => !key.startsWith("folder"))
      .map(([key, value]) => [
        keyMapping[key] || key, // Apply key renaming if a mapping exists
        {
          path: value.iconPath,
        },
      ]),
  );

  /**
   * Transform fileNames object to be case-insensitive
   * This is necessary because ZED's API is case-sensitive but the manifest is not
   */
  const transformedFileNames = Object.entries(
    symbolsIconTheme.fileNames ?? {},
  ).reduce(
    (acc, [key, value]) => {
      acc[key.toLowerCase()] = value;
      acc[key.toUpperCase()] = value;
      return acc;
    },
    {} as { [key: string]: string },
  );

  return {
    name: "Symbols Icon Theme",
    appearance: "dark",
    file_icons: transformedIconDefinitions,
    directory_icons: {
      collapsed: "./icons/folders/folder.svg",
      expanded: "./icons/folders/folder-open.svg",
    },
    file_suffixes: symbolsIconTheme.fileExtensions ?? {},
    file_stems: transformedFileNames,
  };
};
