// Reading list for /library/, built from the public PROTOCOLLEGE Zotero group.
//
// The group is public, so no API key is involved. Zotero formats the citations
// itself (include=bib), and this file only sorts and groups them.
//
// A successful fetch refreshes data/zotero-library.json. That snapshot is
// committed and used as a fallback, so a Zotero outage during a deploy cannot
// publish an empty library page.

const fs = require("fs");
const path = require("path");

const GROUP_ID = "6024559";
const GROUP_URL = `https://www.zotero.org/groups/${GROUP_ID}/protocollege/library`;
// Any CSL style Zotero knows, e.g. chicago-author-date. If you change it,
// update the wording on src/library/index.md too.
const CITATION_STYLE = "apa";
const PAGE_SIZE = 100; // Zotero's maximum per request
const SNAPSHOT = path.join(__dirname, "..", "..", "data", "zotero-library.json");

const TYPE_LABELS = {
  journalArticle: "Journal article",
  book: "Book",
  bookSection: "Book chapter",
  conferencePaper: "Conference paper",
  thesis: "Thesis",
  report: "Report",
  webpage: "Web page",
  blogPost: "Blog post",
  preprint: "Preprint",
  manuscript: "Manuscript",
  document: "Document",
};

async function fetchPage(start) {
  const url =
    `https://api.zotero.org/groups/${GROUP_ID}/items/top` +
    `?limit=${PAGE_SIZE}&start=${start}&include=bib,data&style=${CITATION_STYLE}` +
    `&sort=date&direction=desc`;
  const response = await fetch(url, {
    headers: { "Zotero-API-Version": "3" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Zotero responded ${response.status}`);
  return response.json();
}

async function fetchAll() {
  const raw = [];
  for (let start = 0; ; start += PAGE_SIZE) {
    const page = await fetchPage(start);
    raw.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return raw.map(toItem);
}

// Zotero wraps each citation as
// <div class="csl-bib-body" style="…"><div class="csl-entry">…</div></div>;
// keep the entry itself and drop Zotero's inline styling.
function citationHtml(bib) {
  const entry = (bib || "").match(/<div class="csl-entry"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*$/);
  return (entry ? entry[1] : bib || "").trim();
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

// Citations arrive as HTML with entities, so the filter box needs them turned
// back into plain text before it can match what someone types.
function plainText(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:#x([0-9a-f]+)|#(\d+)|([a-z]+));/gi, (match, hex, dec, name) => {
      if (hex) return String.fromCodePoint(parseInt(hex, 16));
      if (dec) return String.fromCodePoint(Number(dec));
      return ENTITIES[name.toLowerCase()] !== undefined ? ENTITIES[name.toLowerCase()] : match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function toItem(raw) {
  const data = raw.data || {};
  const citation = citationHtml(raw.bib);
  const year = (data.date || "").match(/\d{4}/);
  const tags = (data.tags || []).map(tag => tag.tag);
  return {
    key: raw.key,
    title: data.title || "Untitled",
    type: data.itemType,
    typeLabel: TYPE_LABELS[data.itemType] || "Reference",
    year: year ? year[0] : null,
    citation,
    url: data.url || (data.DOI ? `https://doi.org/${data.DOI}` : null),
    zoteroUrl: raw.links && raw.links.alternate ? raw.links.alternate.href : null,
    tags,
    // Lowercased plain text, so the page's filter box can match on it.
    search: plainText(`${citation} ${tags.join(" ")}`).toLowerCase(),
  };
}

function groupByYear(items) {
  const groups = new Map();
  for (const item of items) {
    const year = item.year || "Undated";
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(item);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (a === "Undated") return 1;
      if (b === "Undated") return -1;
      return Number(b) - Number(a);
    })
    .map(([year, items]) => ({ year, items }));
}

function saveSnapshot(items) {
  try {
    fs.mkdirSync(path.dirname(SNAPSHOT), { recursive: true });
    fs.writeFileSync(SNAPSHOT, JSON.stringify({ fetched: new Date().toISOString(), items }, null, 2) + "\n");
  } catch (error) {
    console.warn(`[zotero] Could not write the snapshot: ${error.message}`);
  }
}

function readSnapshot() {
  try {
    return JSON.parse(fs.readFileSync(SNAPSHOT, "utf8")).items;
  } catch {
    return null;
  }
}

module.exports = async function () {
  let items;
  try {
    items = await fetchAll();
    saveSnapshot(items);
  } catch (error) {
    console.warn(`[zotero] Could not reach the library: ${error.message}`);
    items = readSnapshot();
    if (items) {
      console.warn(`[zotero] Using the committed snapshot of ${items.length} references.`);
    } else {
      console.warn("[zotero] No snapshot available, so /library/ will show no references.");
      items = [];
    }
  }

  return {
    groupUrl: GROUP_URL,
    style: CITATION_STYLE,
    count: items.length,
    items,
    byYear: groupByYear(items),
  };
};
