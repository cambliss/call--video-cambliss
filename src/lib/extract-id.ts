export function extractId(input: string): string {
  // Trim whitespace
  const value = input.trim();

  // ✅ If it looks like a pure ID (no spaces, no `/`, no `http`), return as-is
  if (!value.includes("http") && !value.includes("/") && !value.includes(" ")) {
    return value;
  }

  try {
    // Try to parse as full URL (add protocol if missing)
    const url = value.startsWith("http") ? value : `https://${value}`;
    const urlObject = new URL(url);
    const parts = urlObject.pathname.split("/").filter(Boolean); // remove empty segments
    return parts[parts.length - 1] ?? "";
  } catch {
    // Fallback: last segment after '/'
    const fallbackParts = value.split("/").filter(Boolean);
    return fallbackParts[fallbackParts.length - 1] ?? "";
  }
}
