---
layout: regular
title: Events
description: Upcoming and past Protocollege sessions
---

{% from "components/events.njk" import eventList -%}
{% set upcoming = collections.events | upcomingEvents -%}

Follow the schedule in your own calendar: [subscribe in Google Calendar](https://calendar.google.com/calendar/r?cid={{ ("webcal://" + site.url.replace("https://", "") + "/events.ics") | urlencode }}) or add [{{ site.url }}/events.ics]({{ site.url }}/events.ics) to any calendar app.

## Upcoming

{% if upcoming.length -%}
{{ eventList(upcoming) }}
{%- else -%}
Nothing is scheduled right now.
{%- endif %}

## Past

Recordings of past sessions are on the [Activities](/activities/) page and the [Internet Archive](https://archive.org/details/@the_protocollege).
