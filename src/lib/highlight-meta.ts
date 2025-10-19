// src/lib/highlight-meta.ts

/**
 * Parse highlight meta string to extract line numbers to highlight
 * Supports formats like:
 * - {1} - highlight line 1
 * - {1,3} - highlight lines 1 and 3
 * - {1-3} - highlight lines 1 through 3
 * - {1-3,5,7-9} - combination of ranges and individual lines
 */
export function parseHighlightMeta(
  meta: string | undefined,
  totalLines: number
): Set<number> {
  const highlighted = new Set<number>();

  if (!meta) return highlighted;

  // Extract content within curly braces
  const match = meta.match(/\{([^}]+)\}/);
  if (!match) return highlighted;

  const ranges = match[1].split(',');

  for (const range of ranges) {
    const trimmed = range.trim();

    // Handle range (e.g., "1-3")
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(n => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end && i <= totalLines; i++) {
          if (i > 0) highlighted.add(i);
        }
      }
    }
    // Handle single line number
    else {
      const lineNum = parseInt(trimmed, 10);
      if (!isNaN(lineNum) && lineNum > 0 && lineNum <= totalLines) {
        highlighted.add(lineNum);
      }
    }
  }

  return highlighted;
}