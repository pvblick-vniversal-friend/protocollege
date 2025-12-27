---
layout: regular
title: Protocollage
description: Collection of protocols and case studies
---

A collection of protocols and case studies from the Protocollege community.

## Protocols

<div class="protocollage-gallery protocol-gallery">
{% for item in collections.protocols %}
<a href="{{ item.url }}" class="protocollage-item-link">
    <article class="protocollage-item protocol-item">
        {% if item.data.image %}
        <div class="protocollage-image">
            <img src="{{ item.data.image }}" alt="{{ item.data.title }}" loading="lazy">
        </div>
        {% else %}
        <div class="protocollage-image protocollage-image-placeholder">
            <span>No Image</span>
        </div>
        {% endif %}
        <div class="protocollage-content">
            <h3>{{ item.data.title }}</h3>
            {% if item.data.codeName %}
            <p class="protocollage-code-name">{{ item.data.codeName }}</p>
            {% else %}
            <p class="protocollage-code-name">PROTO-{{ forloop.index }}</p>
            {% endif %}
        </div>
    </article>
</a>
{% else %}
<p>No protocols yet. Check back soon!</p>
{% endfor %}
</div>

## Case Studies

<div class="protocollage-gallery case-study-gallery">
{% for item in collections.caseStudies %}
<a href="{{ item.url }}" class="protocollage-item-link">
    <article class="protocollage-item case-study-item">
        {% if item.data.image %}
        <div class="protocollage-image">
            <img src="{{ item.data.image }}" alt="{{ item.data.title }}" loading="lazy">
        </div>
        {% else %}
        <div class="protocollage-image protocollage-image-placeholder">
            <span>No Image</span>
        </div>
        {% endif %}
        <div class="protocollage-content">
            <h3>{{ item.data.title }}</h3>
            {% if item.data.codeName %}
            <p class="protocollage-code-name">{{ item.data.codeName }}</p>
            {% else %}
            <p class="protocollage-code-name">CASE-{{ forloop.index }}</p>
            {% endif %}
        </div>
    </article>
</a>
{% else %}
<p>No case studies yet. Check back soon!</p>
{% endfor %}
</div>

## Contributing

Want to add a protocol or case study? See our [Contributing Guide](/CONTRIBUTING.md).

