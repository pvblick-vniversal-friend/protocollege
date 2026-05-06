---
layout: landing
title: The Protocollege
description: Generating proto-knowledge through proto-collage
---

**THE PROTOCOLLEGE** is a loose international assemblage of unruly researchers, coalescing around the study of protocols. 

We combine *readings, case studies* and *collaborative practices* to build shared understanding of protocolization _as a phenomenon_ and establish an empirically-based **Philosophy of Protocols**.

## Explore

- **[Protocollage](/protocollage/)** - Empirical case studies & bespoke protocols 
- **[Activities](/activities/)** - Community projects and initiatives
- **[Blog](/blog/)** - Latest updates and reflections
- **[About](/about/)** - Learn more about the project

---

## Upcoming Events

No online meetups this week, 
Some of us are at [FOR26](https://opensciencestudies.eu/for-2026-conference/)!
**Munich Meetup** this week!
(exact day TBA)

{% for group in schedule.readingGroups %}
{% if group.status == "upcoming" %}
**{{ group.title }}**
{{ group.date }} at {{ group.time }}
**Readings**:
a. {{ group.author1 }}
b. {{ group.author2 }}
{% endif %}
{% endfor %}


{% for group in schedule.sessions %}
{% if group.status == "upcoming" %}
**{{ group.title }}**
{{ group.date }} at {{ group.time }}
{{ group.topic }}
{{ group.pass }}
{% endif %}
{% endfor %}


## Get Involved

[Join Our Chat](https://chat.whatsapp.com/IgEjOitPo6b28zHJ87bRlT)

OR

{% contribute "Contribute on GitHub", "pr" %}
