export interface RichSegment {
  text: string;
  bold: boolean;
}

/**
 * Parse the CMS's one piece of markup, **bold**, into plain segments.
 * The output is rendered as React text nodes, so nothing in the source can
 * ever become HTML.
 */
export function richSegments(source: string | null | undefined): RichSegment[] {
  const out: RichSegment[] = [];
  for (const part of String(source ?? '').split(/(\*\*[^*]+\*\*)/g)) {
    if (!part) continue;
    const bold = /^\*\*[^*]+\*\*$/.test(part);
    out.push({ text: bold ? part.slice(2, -2) : part, bold });
  }
  return out;
}
