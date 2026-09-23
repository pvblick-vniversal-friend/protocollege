---
layout: landing
title: The Protocollege
description: Generating proto-knowledge through proto-collage
---

**THE PROTOCOLLEGE** is a loose international assemblage of unruly researchers, coalescing around the study of protocols. 

We combine *readings, case studies* and *collaborative practices* to build shared understanding of protocolization _as a phenomenon_ and establish an empirically-based **Philosophy of Protocols**.

---

All recorded sessions are now on [Internet Archive](https://archive.org/details/@the_protocollege)!

---

## Upcoming Events

{% for group in schedule.readingGroups %}
{% if group.status == "upcoming" %}
**{{ group.topic }}**
{% if group.guest %}with {{ group.guest }}{% endif %}
{{ group.date }} at **{{ group.time }}**

**Reading**
**[{{ group.author1 }}]({{ group.link }})**

**[JOIN SESSION HERE]({{ group.zoom }})**
{{ group.pass }}
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
