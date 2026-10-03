#!/usr/bin/env node
// Turns a "New event" issue form (.github/ISSUE_TEMPLATE/new-event.yml) into an
// entry in src/_data/schedule.json. Run by .github/workflows/add-event.yml with
// the issue body in ISSUE_BODY.
//
// An existing event with the same title and date is replaced, so submitting the
// form again edits or cancels an event.

const fs = require("fs");
const os = require("os");
const path = require("path");

const SCHEDULE_PATH = path.join(__dirname, "..", "src", "_data", "schedule.json");
const OUT_DIR = process.env.RUNNER_TEMP || os.tmpdir();

const TYPES = {
  "Reading group": "reading-group",
  "Working group": "working-group",
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

  let time = field("Start time (UTC)").replace(/\s*utc$/i, "");
  const timeMatch = time.match(/^(\d{1,2})[:.](\d{2})$/);
  if (timeMatch && Number(timeMatch[1]) < 24 && Number(timeMatch[2]) < 60) {
    time = `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
  } else {
    errors.push(`**Start time (UTC)** \`${time}\` must be a 24-hour time like 15:45.`);
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

  const access = singleLine("Access note", 200);

  const status = STATUSES[field("Status")];
  if (!status) errors.push(`**Status** must be one of: ${Object.keys(STATUSES).join(", ")}.`);

  if (errors.length) return { errors };

  // Same key order as the existing entries in schedule.json; empty fields are left out.
  const event = { type, title, date, time };
  if (duration) event.duration = duration;
  if (topic) event.topic = topic;
  if (readings.length) event.readings = readings;
  if (link) event.link = link;
  if (access) event.access = access;
  event.status = status;
  return { event };
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

  const before = fs.readFileSync(SCHEDULE_PATH, "utf8");
  const schedule = JSON.parse(before);
  schedule.events = schedule.events || [];

  const existing = schedule.events.findIndex(
    e => e.date === event.date && e.title.toLowerCase() === event.title.toLowerCase()
  );
  if (existing >= 0) schedule.events[existing] = event;
  else schedule.events.push(event);
  schedule.events.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  const after = JSON.stringify(schedule, null, 2) + "\n";
  const changed = after !== before;
  const verb = existing < 0 ? "Add" : event.status === "cancelled" ? "Cancel" : "Update";
  const issue = process.env.ISSUE_NUMBER ? ` from #${process.env.ISSUE_NUMBER}` : "";

  if (changed) fs.writeFileSync(SCHEDULE_PATH, after);

  writeOutputs({
    changed,
    commitMessage: changed && `${verb} event: ${event.title} (${event.date})\n\nSubmitted through the New event form${issue}.\n`,
    comment: changed
      ? [
          `${verb === "Add" ? "Added" : verb === "Cancel" ? "Cancelled" : "Updated"} **${event.title}** on ${event.date} at ${event.time} UTC in \`src/_data/schedule.json\`.`,
          "",
          "It will show on https://proto.college once the site has rebuilt, usually within a few minutes.",
          "",
          "```json",
          JSON.stringify(event, null, 2),
          "```",
        ].join("\n")
      : `**${event.title}** on ${event.date} is already on the schedule with these details, so nothing changed.`,
  });
  console.log(changed ? `${verb}: ${JSON.stringify(event)}` : "No change.");
}

main();
