---
layout: regular
title: Blog
description: Latest updates and reflections from Protocollege
---

# Recent Posts

{% for post in collections.blog %}
<a href="{{ post.url }}" class="blog-preview-link">
    <article class="blog-preview">
        <h2>{{ post.data.title }}</h2>
        {% if post.data.date %}
        <time datetime="{{ post.data.date | htmlDateString }}">{{ post.data.date | readableDate }}</time>
        {% endif %}
        {% if post.data.description %}
        <p>{{ post.data.description }}</p>
        {% endif %}
    </article>
</a>
{% endfor %}

## RSS Feed

Subscribe to our [RSS feed](/feed.xml) to stay updated.

