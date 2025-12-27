---
layout: landing
title: The Protocollege
description: Generating proto-knowledge through proto-collage
---
The Protocollege is a loose asseblage of unruly researchers, interest3d in the philosophy and ethics of protocols. We combe protocols, case studies, and collaborative practices to build shared understanding.

## Explore

- **[Protocollage](/protocollage/)** - Browse our collection of protocols and case studies 
- **[Activities](/activities/)** - Community projects and initiatives
- **[Blog](/blog/)** - Latest updates and reflections
- **[About](/about/)** - Learn more about the project

## Get Involved

{% contribute "Contribute on GitHub", "pr" %}

## Upcoming Events

{% for group in schedule.readingGroups %}
{% if group.status == "upcoming" %}
**{{ group.title }}**
{{ group.date }} at {{ group.time }}
Topic: {{ group.topic }}
{% endif %}
{% endfor %}

