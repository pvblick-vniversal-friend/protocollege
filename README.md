# Protocollege

> Generating proto-knowledge through proto-collage

The Protocollege is a community around the study of the epistemology and ethics of protocols, focusing on scientific practice.

This is the community's website, to serve as public repository of activities, projects and sessions.
The static site is built with [Eleventy (11ty)](https://www.11ty.dev/).

---

The goal of this website is to not only create a container for our small group's activities, but a template for other PROTOCOLLEGES to fork and customize. This is the first step to the making of *an institution, not an institute*.

You are free to clone the repository and copy any of the pages and templates for your own website (under the AGPL-3.0 license, see [LICENSE](LICENSE)).

## Version

**v2.0**

## Features

- 📝 **Wiki-style pages** with internal linking (`[[Page Name]]`) in protocollage
- 📰 **Blog** with RSS feed support
- 🎨 **Mermaid diagrams** support
- 🔗 **Auto-embed** external content (YouTube, Twitter, etc.)
- 📅 **Schedule** for reading groups and sessions
- 🎯 **Activities** gallery for community projects
- 🎨 **Customizable design** with minimal CSS
- ⚡ **Minimal JavaScript** built on pure HTML/CSS, inspired by (HTML energy)[https://html.energy/] and (Liberatory Computing)[https://github.com/libcomp/libcomp-website].

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the site:**
   ```bash
   npm run build
   ```

3. **Serve locally (with auto-reload):**
   ```bash
   npm run serve
   ```

   The site will be available at `http://localhost:8080`


## Usage

### Creating Content

#### Wiki Pages (Protocollage)

Create markdown files in `src/protocollage/` with wiki-style frontmatter:

```markdown
---
layout: wiki
title: My Protocol
pageType: wiki
tags: protocol
date: 2025-01-15
---

# My Protocol

Use [[Internal Link]] to link to other pages.
```

#### Blog Posts

Create markdown files in `src/blog/posts/`:

```markdown
---
layout: blog
title: My Blog Post
date: 2025-01-15
tags: announcement
---

# My Blog Post

Content here...
```

#### Activities

Add activities to `src/_data/activities.json` or create markdown files in `src/activities/`.

#### Section Breaks

- `---` - Plain break
- `--- {.rule-ring}` - Break through a finder pattern, as on the landing page (`<hr class="rule-ring">` in templates)

### Shortcodes

- `{% embed "url" %}` - Embed external content
- `{% tldraw "board-id" %}` - Embed tldraw board
- `{% contribute "text" "pr" %}` - Contribution button
- `{% mermaid %}` - Mermaid diagram

### Wiki Links

In protocollage pages, use:
- `[[Page Name]]` - Internal link
- `[[Page Name|Custom Text]]` - Custom display text

## Development

### Scripts

- `npm run build` - Build the site
- `npm run serve` - Build and serve with auto-reload
- `npm run dev` - Development mode (with CSS watching)

### Customization

- **Styles**: Edit `src/css/style.css`
- **Layouts**: Modify files in `src/_includes/layouts/`
- **Components**: Update files in `src/_includes/components/`
- **Site data**: Edit `src/_data/site.json`

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

See [LICENSE](LICENSE) for details.

## Links

- [GitHub Repository](https://github.com/pvblick-vniversal-friend/protocollege)
- [RSS Feed](/feed.xml)
