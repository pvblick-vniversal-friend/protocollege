---
# HOW TO ADD AN EVENT
# 1. Copy this file into src/events/ and name it YYYY-MM-DD-short-title.md
#    (for example 2026-11-13-rg-biweekly.md). The name becomes its web address.
# 2. Fill in the fields below. Delete any line you don't need.
# 3. Commit to main. The event shows on the landing page, on /events/ and in
#    the calendar feed (/events.ics) once the site has rebuilt.
# To cancel an event, set `status: cancelled` instead of deleting the file.

title: RG Biweekly
date: 2026-11-13          # YYYY-MM-DD
time: "16:00"             # start, 24-hour clock, in quotes. Leave out if not fixed yet
end: "18:00"              # optional
timezone: Europe/Copenhagen   # optional; Europe/Copenhagen is the default
type: reading-group       # reading-group | working-group | workshop | session | other
status: confirmed         # confirmed | tbc | cancelled
topic: One line on what the session is about
guest: Name of a guest or presenter     # optional
readings:                 # optional, one per line
  - Galloway (2006) Protocol
join: https://ucph-ku.zoom.us/j/9667908137?pwd=Umvk7pdiuDEnmsNJxcTX3FkxMCHQ0C.1&omn=69751443420
meetingId: 966 790 8137
passcode: "903723"
---

Anything written here, in ordinary markdown, appears on the event's own page:
a longer description, links, preparation notes.
