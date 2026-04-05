/**
 * Collects visible text from typical content tags (headings, paragraphs, lists, etc.)
 * in document order, like reading the page — not raw innerHTML.
 */
const BLOCK_SELECTOR =
  "h1, h2, h3, h4, h5, h6, p, li, blockquote, pre, td, th, figcaption, dd, dt, caption, address";

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function getContentRoot(doc: Document): Element {
  return (
    doc.querySelector(
      "main, article, [role='main'], #main, #content, .article-body, .post-content"
    ) ?? doc.body
  );
}

/** Keep block nodes that are not inside another matched block (avoids duplicating li + inner p). */
function outermostBlocks(nodes: Element[]): Element[] {
  return nodes.filter(
    (el) => !nodes.some((other) => other !== el && other.contains(el))
  );
}

/** Div/section-style wrappers that hold text but no inner block content tags. */
function extraTextContainers(root: Element, exclude: Set<Element>): Element[] {
  const extras = root.querySelectorAll("div, section, aside");
  const out: Element[] = [];

  for (const el of extras) {
    if (exclude.has(el)) continue;
    if (exclude.size > 0) {
      const insideKeptBlock = [...exclude].some((k) => k.contains(el));
      if (insideKeptBlock) continue;
    }

    if (el.querySelector(BLOCK_SELECTOR)) continue;

    const text = normalizeWhitespace((el as HTMLElement).innerText ?? "");
    if (text.length < 24) continue;

    out.push(el);
  }

  return outermostBlocks(out);
}

export function extractReadablePageText(doc: Document = document): string {
  const root = getContentRoot(doc);
  if (!root) return "";

  const blocks = Array.from(root.querySelectorAll(BLOCK_SELECTOR));
  const outerBlocks = outermostBlocks(blocks);
  const blockSet = new Set(outerBlocks);

  const containers = extraTextContainers(root, blockSet);
  const merged: Element[] = [...outerBlocks, ...containers];

  merged.sort((a, b) => {
    const pos = a.compareDocumentPosition(b);
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });

  const lines: string[] = [];
  const seen = new Set<string>();

  for (const el of merged) {
    const text = normalizeWhitespace((el as HTMLElement).innerText ?? "");
    if (!text || seen.has(text)) continue;
    seen.add(text);
    lines.push(text);
  }

  return lines.join("\n\n");
}
