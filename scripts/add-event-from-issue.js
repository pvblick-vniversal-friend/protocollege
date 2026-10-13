#!/usr/bin/env node
// Turns a "New event" issue form (.github/ISSUE_TEMPLATE/new-event.yml) into a
// markdown file in src/events/. Run by .github/workflows/add-event.yml with the
// issue body in ISSUE_BODY.
//
// An event with the same title and date has the same file name, so submitting
// the form again edits or cancels it. Its description below the front matter is
// kept.

const fs = require("fs");
const os = require("os");
const path = require("path");

const EVENTS_DIR = path.join(__dirname, "..", "src", "events");
const OUT_DIR = process.env.RUNNER_TEMP || os.tmpdir();

const TYPES = {
  "Reading group": "reading-group",
  "Working group": "working-group",
  "Workshop": "workshop",
  "Session": "session",
  "Other": "other",
};

const STATUSES = {
  "Confirmed": "confirmed",
  "To be confirmed": "tbc",
  "Cancelled": "cancelled",
};

// Issue forms render each field as "### <label>\n\n<value>"; empty fields read "_No response_".
function parseIssueForm(body) {
  const fields = {};
  const sections = body.replace(/\r\n/g, "\n").split(/^### /m).slice(1);
  for (const section of sections) {
    const [label, ...rest] = section.split("\n");
    const value = rest.join("\n").trim();
    fields[label.trim()] = value === "_No response_" ? "" : value;
  }
  return fields;
}

function isValidDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !isNaN(parsed) && parsed.toISOString().slice(0, 10) === date;
}

function buildEvent(fields) {
  const errors = [];
  const field = (label) => (fields[label] || "").trim();
  const singleLine = (label, max) => {
    const value = field(label).replace(/\s+/g, " ");
    if (value.length > max) errors.push(`**${label}** is longer than ${max} characters.`);
    return value;
  };

  const type = TYPES[field("Event type")];
  if (!type) errors.push(`**Event type** must be one of: ${Object.keys(TYPES).join(", ")}.`);

  const title = singleLine("Title", 120);
  if (!title) errors.push("**Title** is required.");

  const date = field("Date");
  if (!isValidDate(date)) errors.push(`**Date** \`${date}\` must be a real date written as YYYY-MM-DD, like 2026-10-07.`);

  let time = field("Start time (Copenhagen time)");
  const timeMatch = time.match(/^(\d{1,2})[:.](\d{2})$/);
  if (timeMatch && Number(timeMatch[1]) < 24 && Number(timeMatch[2]) < 60) {
    time = `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
  } else {
    errors.push(`**Start time (Copenhagen time)** \`${time}\` must be a 24-hour time like 16:00.`);
  }

  let duration;
  const durationText = field("Duration (minutes)").replace(/\s*(min|mins|minutes)$/i, "");
  if (durationText) {
    duration = Number(durationText);
    if (!Number.isInteger(duration) || duration < 1 || duration > 24 * 60) {
      errors.push(`**Duration (minutes)** \`${durationText}\` must be a whole number of minutes, like 90.`);
    }
  }

  const topic = singleLine("Topic", 200);

  const readings = field("Readings")
    .split("\n")
    .map(line => line.trim().replace(/^([-*•]|\d+[.)])\s+/, ""))
    .filter(Boolean);
  if (readings.some(reading => reading.length > 300)) errors.push("Each of the **Readings** must be under 300 characters.");

  const link = field("Join link");
  if (link) {
    let url;
    try { url = new URL(link); } catch { /* reported below */ }
    if (!url || url.protocol !== "https:") errors.push(`**Join link** \`${link}\` must be a full https:// address.`);
  }

  const passcode = singleLine("Passcode", 100);

  const status = STATUSES[field("Status")];
  if (!status) errors.push(`**Status** must be one of: ${Object.keys(STATUSES).join(", ")}.`);

  if (errors.length) return { errors };

  // Same field names and order as src/events/_template.md; empty fields are left out.
  const event = { title, date, time };
  if (duration) event.duration = duration;
  event.type = type;
  event.status = status;
  if (topic) event.topic = topic;
  if (readings.length) event.readings = readings;
  if (link) event.join = link;
  if (passcode) event.passcode = passcode;
  return { event };
}

const slugify = text => text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "event";

// Every value is written as a JSON string, which YAML reads back unchanged.
function frontMatter(event) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(event)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`, ...value.map(item => `  - ${JSON.stringify(item)}`));
    } else if (key === "date" || key === "duration") {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }
  lines.push("---");
  return lines.join("\n") + "\n";
}

function writeOutputs({ changed, comment, commitMessage }) {
  fs.writeFileSync(path.join(OUT_DIR, "event-comment.md"), comment);
  if (commitMessage) fs.writeFileSync(path.join(OUT_DIR, "event-commit-message.txt"), commitMessage);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
}

function main() {
  const { event, errors } = buildEvent(parseIssueForm(process.env.ISSUE_BODY || ""));
  if (errors) {
    writeOutputs({
      changed: false,
      comment: [
        "This event couldn't be added yet:",
        "",
        ...errors.map(error => `- ${error}`),
        "",
        "Edit this issue to fix it, and it will be checked again automatically.",
      ].join("\n"),
    });
    console.error(errors.join("\n"));
    process.exit(1);
  }

  const file = path.join(EVENTS_DIR, `${event.date}-${slugify(event.title)}.md`);
  const relative = path.relative(path.join(__dirname, ".."), file);
  const exists = fs.existsSync(file);
  const before = exists ? fs.readFileSync(file, "utf8") : "";
  const body = before.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const after = frontMatter(event) + body;
  const changed = after !== before;
  const verb = !exists ? "Add" : event.status === "cancelled" ? "Cancel" : "Update";
  const issue = process.env.ISSUE_NUMBER ? ` from #${process.env.ISSUE_NUMBER}` : "";

  if (changed) fs.writeFileSync(file, after);

  writeOutputs({
    changed,
    commitMessage: changed && `${verb} event: ${event.title} (${event.date})\n\nSubmitted through the New event form${issue}.\n`,
    comment: changed
      ? [
          `${verb === "Add" ? "Added" : verb === "Cancel" ? "Cancelled" : "Updated"} **${event.title}** on ${event.date} at ${event.time} (Copenhagen time) in \`${relative}\`. Add a longer description below the front matter in that file if you like.`,
          "",
          "It will show on https://proto.college once the site has rebuilt, usually within a few minutes.",
          "",
          "```yaml",
          frontMatter(event).trim(),
          "```",
        ].join("\n")
      : `**${event.title}** on ${event.date} is already on the schedule with these details, so nothing changed.`,
  });
  console.log(changed ? `${verb}: ${JSON.stringify(event)}` : "No change.");
}

main();
