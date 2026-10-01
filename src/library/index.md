---
layout: regular
title: Library
description: The Protocollege reading list, drawing from the public Zotero group
---

> The Protocollege library is a collection of academic articles, books and other media focusing on a general study of protocol practice across domains. The focus is mostly on the life sciences and biomedicine, but extends to distributed networks and indigenous rights.

> Citations are drawn from our [public Zotero group]({{ zotero.groupUrl }}). You can add items, collections and edit tags yourself!

**{{ zotero.count }} references**, APA style, date first.

<div id="library-filter"></div>

{%- for group in zotero.byYear %}

### {{ group.year }}

<ul class="library-list">
{%- for item in group.items %}
<li class="library-item" data-search="{{ item.search }}">
<span class="tag tag-muted">{{ item.typeLabel }}</span>
<div class="library-citation">{{ item.citation | safe }}</div>
{%- if item.url or item.zoteroUrl %}
<p class="library-links">
{%- if item.url %}<a href="{{ item.url }}" target="_blank" rel="noopener noreferrer">Read</a>{% endif %}
{%- if item.url and item.zoteroUrl %} · {% endif %}
{%- if item.zoteroUrl %}<a href="{{ item.zoteroUrl }}" target="_blank" rel="noopener noreferrer">In Zotero</a>{% endif %}
</p>
{%- endif %}
</li>
{%- endfor %}
</ul>
{%- endfor %}

<script>
// Progressive enhancement: the filter box only appears when scripting is on,
// so without it the page is still the full list.
(function () {
    var mount = document.getElementById("library-filter");
    var lists = Array.prototype.slice.call(document.querySelectorAll(".library-list"));
    var items = Array.prototype.slice.call(document.querySelectorAll(".library-item"));
    if (!mount || !items.length) return;

    var input = document.createElement("input");
    input.type = "search";
    input.className = "library-input";
    input.placeholder = "Filter by author, title or tag";
    input.setAttribute("aria-label", "Filter the library");

    var status = document.createElement("p");
    status.className = "library-count";
    status.setAttribute("role", "status");

    mount.appendChild(input);
    mount.appendChild(status);

    input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();
        var shown = 0;

        items.forEach(function (item) {
            var match = !query || item.getAttribute("data-search").indexOf(query) !== -1;
            item.hidden = !match;
            if (match) shown++;
        });

        lists.forEach(function (list) {
            var empty = !list.querySelector(".library-item:not([hidden])");
            list.hidden = empty;
            var heading = list.previousElementSibling;
            if (heading && heading.tagName === "H3") heading.hidden = empty;
        });

        status.textContent = query ? shown + " of " + items.length + " references" : "";
    });
})();
</script>
