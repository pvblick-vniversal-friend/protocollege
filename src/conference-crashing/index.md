---
layout: regular
title: Conference Crashing
description: Sessions and symposia where Protocollege members turn up to put protocols on the agenda
---

Members organize and infiltrate sessions at other fields' conferences, to advance discourse on protocolization and standardization where it is not yet a topic. What we have turned up to so far:

{%- for appearance in conferences.appearances %}

<article class="activity-card activity-accent-{{ loop.index0 % 6 + 1 }} crash-card">
<span class="tag">{{ appearance.type }}</span>
<h3 class="activity-title">{{ appearance.session }}</h3>
<p class="crash-meta">{{ appearance.event }}{% if appearance.location %} · {{ appearance.location }}{% endif %}{% if appearance.dateLabel %} · {{ appearance.dateLabel }}{% endif %}</p>
{%- if appearance.eventFull %}
<p class="crash-event">{{ appearance.eventFull }}</p>
{%- endif %}
{%- if appearance.members %}
<p class="crash-members"><strong>From the Protocollege:</strong> {% for member in appearance.members %}{{ member.name }}{% if member.role %} ({{ member.role }}){% endif %}{% if not loop.last %}, {% endif %}{% endfor %}</p>
{%- endif %}
<p>{{ appearance.description }}</p>
{%- if appearance.talks %}
<p class="activity-label">Talks</p>
<ol class="crash-talks">
{%- for talk in appearance.talks %}
<li>{{ talk.title }}{% if talk.speakers %} <span class="crash-speakers">— {{ talk.speakers }}</span>{% endif %}</li>
{%- endfor %}
</ol>
{%- endif %}
{%- if appearance.link %}
<p class="activity-more"><a href="{{ appearance.link }}" target="_blank" rel="noopener noreferrer">Programme and abstracts →</a></p>
{%- endif %}
</article>
{%- endfor %}

Going somewhere we should crash, or already have? [Tell us](https://chat.whatsapp.com/IgEjOitPo6b28zHJ87bRlT).
