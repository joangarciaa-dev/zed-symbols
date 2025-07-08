interface VSCodeIconTheme {
  iconDefinitions: Record<string, IconDefinition>;

  // Default icons
  file?: string;
  folder?: string;
  folderExpanded?: string;
  rootFolder?: string;
  rootFolderExpanded?: string;

  // File mappings
  fileNames?: Record<string, string>;
  fileExtensions?: Record<string, string>;

  // Folder mappings
  folderNames?: Record<string, string>;
  folderNamesExpanded?: Record<string, string>;

  // Theme variants
  light?: Partial<ThemeVariant>;
  highContrast?: Partial<ThemeVariant>;
}

interface IconDefinition {
  iconPath: string; // relative path to icon file
  fontCharacter?: string;
  fontColor?: string;
  fontSize?: string;
}

interface ThemeVariant {
  file?: string;
  folder?: string;
  folderExpanded?: string;
  rootFolder?: string;
  rootFolderExpanded?: string;
  fileNames?: Record<string, string>;
  fileExtensions?: Record<string, string>;
  folderNames?: Record<string, string>;
  folderNamesExpanded?: Record<string, string>;
}

export type { VSCodeIconTheme, IconDefinition, ThemeVariant };
