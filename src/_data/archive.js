// Session recordings for /activities/, read from the Internet Archive.
//
// Items are matched on the "protocollege-" identifier prefix, so other uploads
// that merely mention the collective stay out, and the kind comes from the
// title suffix: "PROTOCOLLEGE #12 | RG" is a reading group.
//
// As with the Zotero data file, a successful fetch refreshes a committed
// snapshot, which is used as a fallback when archive.org cannot be reached
// during a build.

const fs = require("fs");
const path = require("path");

const IDENTIFIER_PREFIX = "protocollege-";
const ACCOUNT_URL = "https://archive.org/details/@the_protocollege";
const SNAPSHOT = path.join(__dirname, "..", "..", "data", "archive-recordings.json");

const KINDS = [
  { kind: "rg", pattern: /\|\s*RG\b/i },
  { kind: "djam", pattern: /\|\s*DJam\b/i },
];

function kindOf(title) {
  const match = KINDS.find(candidate => candidate.pattern.test(title));
  return match ? match.kind : "other";
}

function text(value) {
  const raw = Array.isArray(value) ? value.join(" ") : value || "";
  return raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function summarise(description, limit = 180) {
  const plain = text(description);
  if (plain.length <= limit) return plain;
  const cut = plain.slice(0, limit);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

function dateLabel(date) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

async function fetchRecordings() {
  const params = new URLSearchParams({ q: "protocollege", rows: "200", output: "json" });
  for (const field of ["identifier", "title", "date", "description", "mediatype"]) {
    params.append("fl[]", field);
  }
  params.append("sort[]", "date desc");

  const response = await fetch(`https://archive.org/advancedsearch.php?${params}`, {
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`archive.org responded ${response.status}`);

  const found = (await response.json()).response.docs;
  return found
    .filter(doc => doc.mediatype === "movies" && doc.identifier.startsWith(IDENTIFIER_PREFIX))
    .map(doc => {
      const title = text(doc.title);
      // "PROTOCOLLEGE #12 | RG" is listed as "#12" next to its date.
      const number = title.match(/#\s*(\d+)/);
      return {
        identifier: doc.identifier,
        title,
        label: number ? `#${number[1]}` : title,
        kind: kindOf(title),
        date: doc.date ? doc.date.slice(0, 10) : null,
        dateLabel: dateLabel(doc.date),
        summary: summarise(doc.description),
        url: `https://archive.org/details/${doc.identifier}`,
        embedUrl: `https://archive.org/embed/${doc.identifier}`,
      };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

function saveSnapshot(recordings) {
  try {
    fs.mkdirSync(path.dirname(SNAPSHOT), { recursive: true });
    fs.writeFileSync(
      SNAPSHOT,
      JSON.stringify({ fetched: new Date().toISOString(), recordings }, null, 2) + "\n"
    );
  } catch (error) {
    console.warn(`[archive] Could not write the snapshot: ${error.message}`);
  }
}

function readSnapshot() {
  try {
    return JSON.parse(fs.readFileSync(SNAPSHOT, "utf8")).recordings;
  } catch {
    return null;
  }
}

module.exports = async function () {
  let recordings;
  try {
    recordings = await fetchRecordings();
    saveSnapshot(recordings);
  } catch (error) {
    console.warn(`[archive] Could not reach archive.org: ${error.message}`);
    recordings = readSnapshot();
    if (recordings) {
      console.warn(`[archive] Using the committed snapshot of ${recordings.length} recordings.`);
    } else {
      console.warn("[archive] No snapshot available, so no recordings will be listed.");
      recordings = [];
    }
  }

  const byKind = {};
  for (const recording of recordings) {
    (byKind[recording.kind] = byKind[recording.kind] || []).push(recording);
  }

  return { accountUrl: ACCOUNT_URL, count: recordings.length, all: recordings, byKind };
};
