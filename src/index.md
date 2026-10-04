---
layout: landing
title: The Protocollege
description: Towards a philosophy and ethics of protocolization
# Follow-up questions branching out of the rotating card questions
# (those are in src/_data/questions.json).
branches:
  - label: about
    question: Who thinks about such things anyhow?
    href: /about/
  - label: activities
    question: So, you can research protocols themselves?
    href: /activities/
  - label: library
    question: Where can I learn more?
    href: /library/
---

## Upcoming Events

{% from "components/events.njk" import eventList -%}
{% set upcoming = schedule.events | upcomingEvents -%}
{% if upcoming.length -%}
{{ eventList(upcoming.slice(0, 2), compact=true) }}

[All events →](/events/)
{%- else -%}
Nothing is scheduled right now. Find past sessions on [Internet Archive](https://archive.org/details/@the_protocollege)!
{%- endif %}


## Get Involved

[Join Our Chat](https://chat.whatsapp.com/IgEjOitPo6b28zHJ87bRlT)

OR

{% contribute "Contribute on GitHub", "pr" %}
