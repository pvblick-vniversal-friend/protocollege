// Events are markdown files in src/events/ (see src/events/_template.md).
// This module turns their front matter into plain event objects for the
// templates, and renders the calendar feed at /events.ics.

const { DateTime } = require("luxon");

const DEFAULT_TIMEZONE = "Europe/Copenhagen";

// Unquoted `time: 16:00` in YAML front matter is read as the base-60 number
// 960, so numbers are turned back into "HH:MM".
function normalizeTime(time) {
  if (time === undefined || time === null || time === "") return "";
  if (typeof time === "number") {
    return `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`;
  }
  const match = String(time).trim().match(/^(\d{1,2})[:.](\d{2})$/);
  return match ? `${match[1].padStart(2, "0")}:${match[2]}` : "";
}

function normalizeDate(date) {
  if (date instanceof Date) return DateTime.fromJSDate(date, { zone: "utc" }).toISODate();
  return String(date || "").trim();
}

function normalizeReadings(readings) {
  if (!readings) return [];
  return [].concat(readings).map(reading =>
    typeof reading === "string" ? { author: reading } : reading
  );
}

// Front matter of one event file → the event object the templates use.
function fromPage(item) {
  const data = item.data;
  const date = normalizeDate(data.date);
  const time = normalizeTime(data.time);
  const end = normalizeTime(data.end);
  const event = {
    type: data.type || "session",
    title: data.title,
    date,
    time,
    timezone: data.timezone || DEFAULT_TIMEZONE,
    topic: data.topic,
    guest: data.guest,
    readings: normalizeReadings(data.readings),
    join: data.join,
    meetingId: data.meetingId,
    passcode: data.passcode,
    status: data.status || "confirmed",
    url: item.url,
    inputPath: item.inputPath,
  };

  const start = startOf(event);
  if (start && end) {
    let finish = DateTime.fromISO(`${date}T${end}`, { zone: event.timezone });
    if (finish <= start) finish = finish.plus({ days: 1 });
    event.duration = Math.round(finish.diff(start, "minutes").minutes);
  } else if (data.duration) {
    event.duration = Number(data.duration);
  }
  return event;
}

function startOf(event) {
  if (!event.time) return null;
  const start = DateTime.fromISO(`${event.date}T${event.time}`, { zone: event.timezone });
  return start.isValid ? start : null;
}

function endOf(event) {
  const start = startOf(event);
  return start && start.plus({ minutes: event.duration || 60 });
}

// "Fri 16 Oct 2026 · 16:00–18:00 (UTC+2)", in the event's own timezone.
function when(event) {
  const start = startOf(event);
  if (!start) return DateTime.fromISO(event.date).toFormat("ccc d LLL yyyy");
  let text = `${start.toFormat("ccc d LLL yyyy")} · ${start.toFormat("HH:mm")}`;
  if (event.duration) text += `–${start.plus({ minutes: event.duration }).toFormat("HH:mm")}`;
  return `${text} (${start.toFormat("ZZZZ").replace(/^GMT/, "UTC")})`;
}

function description(event, siteUrl) {
  const lines = [];
  if (event.guest) lines.push(`With ${event.guest}`);
  if (event.topic) lines.push(event.topic);
  for (const reading of event.readings) {
    lines.push(`Reading: ${reading.author}${reading.title ? ` — ${reading.title}` : ""}${reading.link ? ` ${reading.link}` : ""}`);
  }
  if (event.join) lines.push(`Join: ${event.join}`);
  if (event.meetingId) lines.push(`Meeting ID: ${event.meetingId}`);
  if (event.passcode) lines.push(`Passcode: ${event.passcode}`);
  lines.push(`Details: ${siteUrl}${event.url}`);
  return lines.join("\n");
}

const utcStamp = dt => dt.toUTC().toFormat("yyyyLLdd'T'HHmmss'Z'");
const dayStamp = date => date.replace(/-/g, "");

// "Add to Google Calendar" link for one event.
function googleCalendarUrl(event, siteUrl) {
  const start = startOf(event);
  const dates = start
    ? `${utcStamp(start)}/${utcStamp(endOf(event))}`
    : `${dayStamp(event.date)}/${dayStamp(DateTime.fromISO(event.date).plus({ days: 1 }).toISODate())}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title}${event.topic ? `: ${event.topic}` : ""}`,
    dates,
    details: description(event, siteUrl),
  });
  if (event.join) params.set("location", event.join);
  return `https://calendar.google.com/calendar/render?${params}`;
}

// iCalendar text values escape \ ; , and newlines, and lines fold at 75 octets.
const icsText = text => String(text).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

function fold(line) {
  const parts = [];
  let current = "";
  for (const char of line) {
    if (Buffer.byteLength(current + char) > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = "";
    }
    current += char;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

function toIcs(events, site) {
  const host = new URL(site.url).host;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${host}//Events//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${icsText(site.title)}`,
    "X-PUBLISHED-TTL:PT6H",
  ];
  const stamp = utcStamp(DateTime.utc());
  for (const event of events) {
    const start = startOf(event);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.url.replace(/^\/|\/$/g, "").replace(/\//g, "-")}@${host}`,
      `DTSTAMP:${stamp}`,
      ...(start
        ? [`DTSTART:${utcStamp(start)}`, `DTEND:${utcStamp(endOf(event))}`]
        : [`DTSTART;VALUE=DATE:${dayStamp(event.date)}`]),
      `SUMMARY:${icsText(`${event.title}${event.topic ? `: ${event.topic}` : ""}`)}`,
      `DESCRIPTION:${icsText(description(event, site.url))}`,
      `URL:${site.url}${event.url}`,
      ...(event.join ? [`LOCATION:${icsText(event.join)}`] : []),
      `STATUS:${{ tbc: "TENTATIVE", cancelled: "CANCELLED" }[event.status] || "CONFIRMED"}`,
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

module.exports = { fromPage, when, googleCalendarUrl, toIcs, normalizeTime, DEFAULT_TIMEZONE };
