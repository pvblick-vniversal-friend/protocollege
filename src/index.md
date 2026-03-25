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

{% for group in schedule.readingGroups %}
{% if group.status == "upcoming" %}
**{{ group.title }}**
{{ group.date }} at {{ group.time }}
{{ group.topic }}
{{ group.authors }}
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

**[JOIN SESSION HERE](https://ucph-ku.zoom.us/j/68514109036?pwd=Z106s2QI4Tl5LVlVuqKhU6OXGwUENY.1)**
pass: 082179


## Get Involved

[Join Our Chat](https://chat.whatsapp.com/IgEjOitPo6b28zHJ87bRlT)

OR

{% contribute "Contribute on GitHub", "pr" %}
