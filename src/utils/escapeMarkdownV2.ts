const escapeMarkdownV2 = (text: string) => {
  return text
    .replace(/\\/g, "\\\\") // Escape backslashes
    .replace(/_/g, "\\_") // Escape underscores
    .replace(/\*/g, "\\*") // Escape asterisks
    .replace(/\[/g, "\\[") // Escape opening square brackets
    .replace(/\]/g, "\\]") // Escape closing square brackets
    .replace(/\(/g, "\\(") // Escape opening parentheses
    .replace(/\)/g, "\\)") // Escape closing parentheses
    .replace(/-/g, "\\-") // Escape hyphens
    .replace(/\./g, "\\."); // Escape dots
};
