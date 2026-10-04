/**
 * Utility functions for handling image URLs, including converting Google Drive
 * shareable links into directly displayable image URLs.
 */
export function formatImageUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();

  // If it's a Google Drive link, extract file ID and convert to direct CDN url
  if (trimmed.includes("drive.google.com")) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // Google UserContent CDN delivers images directly without redirect loops or auth barriers
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  // Also support dropbox share links by ensuring raw=1
  if (trimmed.includes("dropbox.com") && trimmed.includes("dl=0")) {
    return trimmed.replace("dl=0", "raw=1");
  }

  return trimmed;
}

/**
 * Strips view number prefixes like "VIEW 1 - ", "VIEW 2:", "View 03 - ", etc.
 * so that only the clean, descriptive caption is displayed.
 */
export function formatImageCaption(caption?: string | null): string {
  if (!caption) return "";
  const cleaned = caption.replace(/^view\s*\d+\s*[-:–—]?\s*/i, "").trim();
  if (/^view\s*\d+$/i.test(cleaned)) {
    return "";
  }
  return cleaned;
}
