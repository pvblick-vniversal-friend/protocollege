---
layout: regular
title: Activities
description: Community projects and initiatives
---

{% for activity in activities.activities %}
{% if activity.status == "active" %}
### [{{ activity.title }}]({{ activity.link }})

{{ activity.description }}


{% if activity.tags %}
Tags: {% for tag in activity.tags %}<span class="tag">{{ tag }}</span> {% endfor %}
{% endif %}
{% endif %}
{% endfor %}

## Get Involved

Want to start or join an activity? See our [Contributing Guide](/CONTRIBUTING.md).

## Browse All Activities

{% for item in collections.activities %}
- [{{ item.data.title }}]({{ item.url }})
{% endfor %}

