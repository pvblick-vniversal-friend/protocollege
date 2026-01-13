---
layout: landing
title: The Protocollege
description: Generating proto-knowledge through proto-collage
---
The Protocollege is a loose asseblage of unruly researchers, interested in the philosophy and ethics of protocols. We combine protocols, case studies, and collaborative practices to build shared understanding of protocolization as a phenomenon.

## Explore

- **[Protocollage](/protocollage/)** - Browse our assemblage of case studies and protocols 
- **[Activities](/activities/)** - Community projects and initiatives
- **[Blog](/blog/)** - Latest updates and reflections
- **[About](/about/)** - Learn more about the project

---

## Upcoming Events

<!--

{% for group in schedule.readingGroups %}
{% if group.status == "upcoming" %}
**{{ group.title }}**
{{ group.date }} at {{ group.time }}
Topic: {{ group.topic }}
{% endif %}
{% endfor %}

-->

{% for group in schedule.sessions %}
{% if group.status == "upcoming" %}
**{{ group.title }}**
{{ group.date }} at {{ group.time }}
Idea Jamming with Diagrams
{% endif %}
{% endfor %}

**[JOIN US HERE!](https://tum-conf.zoom-x.de/j/63725445133?pwd=LIJsIR2TiLQocqhsxa3lPXjq9Z7gxS.1)**

## Get Involved

{% contribute "Contribute on GitHub", "pr" %}
