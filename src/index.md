---
layout: landing
title: The Protocollege
description: Generating proto-knowledge through proto-collage
---

**THE PROTOCOLLEGE** is a loose international assemblage of unruly researchers, coalescing around the study of protocols. 

We combine *readings, case studies* and *collaborative practices* to build shared understanding of protocolization _as a phenomenon_ and establish an empirically-based **Philosophy of Protocols**.

---


## Upcoming Events

{% from "components/events.njk" import eventList -%}
{% set upcoming = schedule.events | upcomingEvents -%}
{% if upcoming.length -%}
{{ eventList(upcoming.slice(0, 2), compact=true) }}

[All events →](/events/)
{%- else -%}
Nothing is scheduled right now. See past all past sessions on [Internet Archive](https://archive.org/details/@the_protocollege)!
{%- endif %}


## Get Involved

[Join Our Chat](https://chat.whatsapp.com/IgEjOitPo6b28zHJ87bRlT)

OR

{% contribute "Contribute on GitHub", "pr" %}
