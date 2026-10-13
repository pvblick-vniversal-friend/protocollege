const { DateTime } = require("luxon");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const interlinker = require("@photogabble/eleventy-plugin-interlinker");
const pluginMermaid = require("@kevingimbel/eleventy-plugin-mermaid");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const events = require("./lib/events");
const site = require("./src/_data/site.json");

module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/**/*.png");
  eleventyConfig.addPassthroughCopy("src/**/*.jpg");
  eleventyConfig.addPassthroughCopy("src/**/*.svg");
  eleventyConfig.addPassthroughCopy("src/**/*.webp");

  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginMermaid);
  
  // Wiki-link plugin - process wiki links in protocollage directory
  eleventyConfig.addPlugin(interlinker, {
    wikiLinkDirectories: ['src/protocollage'],
  });

  // Markdown configuration
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAttrs);
  
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("sortByDate", (array) => {
    return array.sort((a, b) => {
      return (b.data.date || 0) - (a.data.date || 0);
    });
  });

  // Events are the markdown files in src/events/ (copy _template.md to add one).
  // Upcoming = today (UTC) or later, soonest first; past = before today, most
  // recent first.
  eleventyConfig.ignores.add("src/events/_template.md");

  eleventyConfig.addCollection("events", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/events/*.md")
      .filter(item => !item.inputPath.endsWith("/index.md") && !item.data.draft)
      .map(events.fromPage);
  });

  const isUpcoming = event => event.date >= DateTime.utc().toISODate();
  eleventyConfig.addFilter("isUpcoming", isUpcoming);

  const byDateTime = (a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);

  eleventyConfig.addFilter("upcomingEvents", (list = []) => {
    return list.filter(isUpcoming).sort(byDateTime);
  });

  eleventyConfig.addFilter("pastEvents", (list = []) => {
    return list.filter(event => !isUpcoming(event)).sort((a, b) => byDateTime(b, a));
  });

  eleventyConfig.addFilter("eventForPage", (list = [], url) => list.find(event => event.url === url));
  eleventyConfig.addFilter("eventWhen", events.when);
  eleventyConfig.addFilter("googleCalendarUrl", event => events.googleCalendarUrl(event, site.url));
  eleventyConfig.addFilter("toIcs", events.toIcs);

  // Collections
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/posts/*.md").sort((a, b) => {
      return (b.data.date || 0) - (a.data.date || 0);
    });
  });

  eleventyConfig.addCollection("protocollage", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/protocollage/*.md").filter(item => {
      return !item.data.draft && item.data.title !== "Protocollage";
    });
  });

  eleventyConfig.addCollection("protocols", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/protocollage/*.md").filter(item => {
      if (item.data.draft || item.data.title === "Protocollage") return false;
      const tags = item.data.tags || [];
      return Array.isArray(tags) ? tags.includes("protocol") : tags === "protocol";
    });
  });

  eleventyConfig.addCollection("caseStudies", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/protocollage/*.md").filter(item => {
      if (item.data.draft || item.data.title === "Protocollage") return false;
      const tags = item.data.tags || [];
      return Array.isArray(tags) ? tags.includes("case-study") : tags === "case-study";
    });
  });

  eleventyConfig.addCollection("activities", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/activities/*.md").filter(item => {
      return !item.data.draft && item.data.title !== "Activities";
    });
  });

  // Shortcodes
  eleventyConfig.addShortcode("embed", function(url, width = "100%", height = "600px") {
    return `<div class="embed-container"><iframe src="${url}" width="${width}" height="${height}" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`;
  });

  eleventyConfig.addShortcode("tldraw", function(boardId) {
    return `<div class="embed-container tldraw-embed"><iframe src="https://www.tldraw.com/v/${boardId}" width="100%" height="600px" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`;
  });

  eleventyConfig.addShortcode("contribute", function(text = "Contribute", type = "pr") {
    const repoUrl = "https://github.com/pvblick-vniversal-friend/protocollege";
    const url = type === "pr" ? `${repoUrl}/compare` : `${repoUrl}/issues/new`;
    return `<a href="${url}" class="btn-contribute" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });

  eleventyConfig.addShortcode("mermaid", function(diagram) {
    return `<div class="mermaid">${diagram}</div>`;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
      output: "dist"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html", "liquid"]
  };
};