export interface Heading {
  id: string;
  text: string;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) =>
      String.fromCodePoint(parseInt(dec, 10))
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const re = /<h2[^>]*>(.*?)<\/h2>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const text = decodeEntities(match[1].replace(/<[^>]*>/g, "")).trim();
    if (text) {
      headings.push({ id: slugify(text), text });
    }
  }
  return headings;
}

export function addHeadingIds(html: string, headings: Heading[]): string {
  let index = 0;
  return html.replace(/<h2([^>]*)>/gi, (full, attrs) => {
    if (index < headings.length) {
      const heading = headings[index++];
      return `<h2${attrs} id="${heading.id}">`;
    }
    return full;
  });
}
