---
layout: regular
title: Activities & Projects
description: The sessions we run, the projects we are building, and what might come next
---

---

## Sessions

<div class="activity-grid">
{%- for session in activities.sessions %}
{%- set recordings = archive.byKind[session.recordings] if session.recordings else [] %}
{%- if session.link %}
<a class="activity-link" href="{{ session.link }}">
{%- endif %}
<article class="activity-card activity-accent-{{ loop.index0 % 6 + 1 }}">
<h3 class="activity-title">{{ session.title }}{% if session.short %} <span class="activity-short">{{ session.short }}</span>{% endif %}</h3>
<p>{{ session.description }}</p>
{%- if recordings.length %}
<p class="activity-recordings">{{ recordings.length }} recording{% if recordings.length != 1 %}s{% endif %}:
{%- for recording in recordings.slice(0, 3) %} <a href="{{ recording.url }}" target="_blank" rel="noopener noreferrer">{{ recording.label }}</a><span class="activity-date"> {{ recording.dateLabel }}</span>{% if not loop.last %} · {% endif %}{% endfor %}
</p>
{%- endif %}
{%- if session.artifacts %}
<p class="activity-artifacts">{% for artifact in session.artifacts %}<a href="{{ artifact.url }}" target="_blank" rel="noopener noreferrer">{{ artifact.title }}</a>{% if not loop.last %} · {% endif %}{% endfor %}</p>
{%- endif %}
{%- if session.tags %}
<p class="activity-tags">{% for tag in session.tags %}<span class="tag">{{ tag }}</span> {% endfor %}</p>
{%- endif %}
{%- if session.linkText %}
<p class="activity-more">{{ session.linkText }} →</p>
{%- endif %}
</article>
{%- if session.link %}
</a>
{%- endif %}
{%- endfor %}
</div>

---

## Projects

### Ongoing

<div class="activity-grid">
{%- for project in activities.projects %}{% if project.status == "ongoing" %}
{%- if project.link %}
<a class="activity-link" href="{{ project.link }}"{% if project.link.startsWith("http") %} target="_blank" rel="noopener noreferrer"{% endif %}>
{%- endif %}
<article class="activity-card activity-accent-{{ loop.index0 % 6 + 1 }}">
<h3 class="activity-title">{{ project.title }}</h3>
<p>{{ project.description }}</p>
{%- if project.note %}
<p class="activity-note">{{ project.note }}</p>
{%- endif %}
{%- if project.tags %}
<p class="activity-tags">{% for tag in project.tags %}<span class="tag">{{ tag }}</span> {% endfor %}</p>
{%- endif %}
{%- if project.linkText %}
<p class="activity-more">{{ project.linkText }} →</p>
{%- endif %}
</article>
{%- if project.link %}
</a>
{%- endif %}
{%- endif %}{% endfor %}
</div>

### Forming

<div class="activity-grid">
{%- for project in activities.projects %}{% if project.status == "forming" %}
<article class="activity-card activity-accent-{{ loop.index0 % 6 + 1 }}">
<h3 class="activity-title">{{ project.title }}</h3>
<p>{{ project.description }}</p>
{%- if project.note %}
<p class="activity-note">{{ project.note }}</p>
{%- endif %}
{%- if project.tags %}
<p class="activity-tags">{% for tag in project.tags %}<span class="tag">{{ tag }}</span> {% endfor %}</p>
{%- endif %}
{%- if project.link %}
<p class="activity-more"><a href="{{ project.link }}"{% if project.link.startsWith("http") %} target="_blank" rel="noopener noreferrer"{% endif %}>{{ project.linkText or "More" }} →</a></p>
{%- endif %}
{%- if project.interest %}
<p><a class="btn-interest" href="mailto:protocollege@proton.me?subject={{ ((project.title | replace('SIG: ', 'SIG ')) + ' Interest') | urlencode }}">Share your interest</a></p>
{%- endif %}
</article>
{%- endif %}{% endfor %}
</div>

<p class="activity-actions"><a class="btn-interest-alt" href="https://chat.whatsapp.com/IgEjOitPo6b28zHJ87bRlT" target="_blank" rel="noopener noreferrer">Or speak about your own</a></p>

---
