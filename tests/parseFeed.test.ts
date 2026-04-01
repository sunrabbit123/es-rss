import { describe, expect, it } from "vitest";
import { parseFeed } from "../src/parsers";

const RSS2_XML = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>RSS 2.0 Feed</title>
    <link>http://example.com</link>
    <description>A test RSS 2.0 feed</description>
    <language>en-us</language>
    <copyright>Copyright 2024</copyright>
    <managingEditor>editor@example.com (John Doe)</managingEditor>
    <pubDate>Sat, 07 Sep 2024 00:00:01 GMT</pubDate>
    <lastBuildDate>Sat, 07 Sep 2024 09:42:31 GMT</lastBuildDate>
    <generator>TestGen v1.0</generator>
    <category>Tech</category>
    <image>
      <url>http://example.com/logo.png</url>
      <title>Example</title>
      <link>http://example.com</link>
    </image>
    <item>
      <title>First Post</title>
      <link>http://example.com/1</link>
      <description>Summary of first post</description>
      <author>author@example.com (Jane)</author>
      <guid isPermaLink="true">http://example.com/1</guid>
      <pubDate>Fri, 06 Sep 2024 12:00:00 GMT</pubDate>
      <category domain="tech">TypeScript</category>
      <enclosure url="http://example.com/file.mp3" length="12345" type="audio/mpeg"/>
      <source url="http://other.com/feed.xml">Other Blog</source>
    </item>
  </channel>
</rss>`;

const RSS1_XML = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://purl.org/rss/1.0/">
  <channel rdf:about="http://example.com/feed.rdf">
    <title>RSS 1.0 Feed</title>
    <link>http://example.com</link>
    <description>A test RSS 1.0 feed</description>
    <items><rdf:Seq><rdf:li resource="http://example.com/1" /></rdf:Seq></items>
  </channel>
  <image rdf:about="http://example.com/logo.png">
    <title>Example</title>
    <url>http://example.com/logo.png</url>
    <link>http://example.com</link>
  </image>
  <item rdf:about="http://example.com/1">
    <title>First Post</title>
    <link>http://example.com/1</link>
    <description>Summary of first post</description>
  </item>
</rdf:RDF>`;

const ATOM_XML = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="text">Atom Feed</title>
  <subtitle type="html">A test Atom feed</subtitle>
  <id>urn:uuid:feed-1</id>
  <updated>2024-09-07T12:00:00Z</updated>
  <link rel="alternate" type="text/html" href="http://example.com/"/>
  <link rel="self" href="http://example.com/feed.atom"/>
  <rights>Copyright 2024</rights>
  <generator uri="http://example.com/gen" version="1.0">TestGen</generator>
  <logo>http://example.com/logo.png</logo>
  <author>
    <name>John Doe</name>
    <email>john@example.com</email>
    <uri>http://example.com/john</uri>
  </author>
  <category term="tech" scheme="http://example.com/cat" label="Technology"/>
  <entry>
    <title>First Post</title>
    <id>urn:uuid:entry-1</id>
    <updated>2024-09-07T12:00:00Z</updated>
    <published>2024-09-06T12:00:00Z</published>
    <link rel="alternate" href="http://example.com/1"/>
    <link rel="enclosure" type="audio/mpeg" length="12345" href="http://example.com/file.mp3"/>
    <summary type="text">Summary of first post</summary>
    <content type="html">&lt;p&gt;Full content&lt;/p&gt;</content>
    <author><name>Jane</name></author>
    <category term="typescript"/>
    <source>
      <id>urn:uuid:source-feed</id>
      <title>Source Blog</title>
      <link rel="self" href="http://source.com/feed.atom"/>
      <link rel="alternate" href="http://source.com/"/>
    </source>
  </entry>
</feed>`;

describe("parseFeed - unified output", () => {
  describe("common fields across all formats", () => {
    const rss2 = parseFeed(RSS2_XML);
    const rss1 = parseFeed(RSS1_XML);
    const atom = parseFeed(ATOM_XML);

    it("detects format type", () => {
      expect(rss2.type).toBe("rss2");
      expect(rss1.type).toBe("rss1");
      expect(atom.type).toBe("atom");
    });

    it("extracts title from all formats", () => {
      expect(rss2.title).toBe("RSS 2.0 Feed");
      expect(rss1.title).toBe("RSS 1.0 Feed");
      expect(atom.title).toBe("Atom Feed");
    });

    it("extracts description from all formats", () => {
      expect(rss2.description).toBe("A test RSS 2.0 feed");
      expect(rss1.description).toBe("A test RSS 1.0 feed");
      expect(atom.description).toBe("A test Atom feed");
    });

    it("extracts link from all formats", () => {
      expect(rss2.link).toBe("http://example.com");
      expect(rss1.link).toBe("http://example.com");
      expect(atom.link).toBe("http://example.com/");
    });

    it("extracts image from all formats", () => {
      expect(rss2.image?.url).toBe("http://example.com/logo.png");
      expect(rss1.image?.url).toBe("http://example.com/logo.png");
      expect(atom.image?.url).toBe("http://example.com/logo.png");
    });

    it("extracts items from all formats", () => {
      expect(rss2.items).toHaveLength(1);
      expect(rss1.items).toHaveLength(1);
      expect(atom.items).toHaveLength(1);
    });

    it("extracts item title from all formats", () => {
      expect(rss2.items[0]!.title).toBe("First Post");
      expect(rss1.items[0]!.title).toBe("First Post");
      expect(atom.items[0]!.title).toBe("First Post");
    });

    it("extracts item link from all formats", () => {
      expect(rss2.items[0]!.link).toBe("http://example.com/1");
      expect(rss1.items[0]!.link).toBe("http://example.com/1");
      expect(atom.items[0]!.link).toBe("http://example.com/1");
    });

    it("extracts item description from all formats", () => {
      expect(rss2.items[0]!.description).toBe("Summary of first post");
      expect(rss1.items[0]!.description).toBe("Summary of first post");
      expect(atom.items[0]!.description).toBe("Summary of first post");
    });
  });

  describe("RSS 2.0 specific mappings", () => {
    const feed = parseFeed(RSS2_XML);

    it("maps language", () => {
      expect(feed.language).toBe("en-us");
    });

    it("maps copyright", () => {
      expect(feed.copyright).toBe("Copyright 2024");
    });

    it("maps managingEditor to authors", () => {
      expect(feed.authors).toEqual([
        { email: "editor@example.com", name: "John Doe" },
      ]);
    });

    it("maps pubDate to published", () => {
      expect(feed.published).toBe("Sat, 07 Sep 2024 00:00:01 GMT");
    });

    it("maps lastBuildDate to updated", () => {
      expect(feed.updated).toBe("Sat, 07 Sep 2024 09:42:31 GMT");
    });

    it("maps generator", () => {
      expect(feed.generator).toBe("TestGen v1.0");
    });

    it("maps categories", () => {
      expect(feed.categories).toEqual([{ term: "Tech" }]);
    });

    it("maps image with title and link", () => {
      expect(feed.image).toEqual({
        url: "http://example.com/logo.png",
        title: "Example",
        link: "http://example.com",
      });
    });

    it("maps item guid to id", () => {
      expect(feed.items[0]!.id).toBe("http://example.com/1");
    });

    it("maps item author", () => {
      expect(feed.items[0]!.authors).toEqual([
        { email: "author@example.com", name: "Jane" },
      ]);
    });

    it("maps item pubDate to published", () => {
      expect(feed.items[0]!.published).toBe("Fri, 06 Sep 2024 12:00:00 GMT");
    });

    it("maps item categories", () => {
      expect(feed.items[0]!.categories).toEqual([
        { term: "TypeScript", scheme: "tech" },
      ]);
    });

    it("maps item enclosure", () => {
      expect(feed.items[0]!.enclosures).toEqual([
        { url: "http://example.com/file.mp3", length: 12345, type: "audio/mpeg" },
      ]);
    });

    it("maps item source", () => {
      expect(feed.items[0]!.source).toEqual({
        title: "Other Blog",
        url: "http://other.com/feed.xml",
      });
    });
  });

  describe("Atom specific mappings", () => {
    const feed = parseFeed(ATOM_XML);

    it("maps id", () => {
      expect(feed.id).toBe("urn:uuid:feed-1");
    });

    it("maps feedUrl from self link", () => {
      expect(feed.feedUrl).toBe("http://example.com/feed.atom");
    });

    it("maps rights to copyright", () => {
      expect(feed.copyright).toBe("Copyright 2024");
    });

    it("maps authors with full person info", () => {
      expect(feed.authors).toEqual([
        { name: "John Doe", email: "john@example.com", uri: "http://example.com/john" },
      ]);
    });

    it("maps generator", () => {
      expect(feed.generator).toBe("TestGen");
    });

    it("maps categories with scheme and label", () => {
      expect(feed.categories).toEqual([
        { term: "tech", scheme: "http://example.com/cat", label: "Technology" },
      ]);
    });

    it("maps entry content separately from description", () => {
      const item = feed.items[0]!;
      expect(item.description).toBe("Summary of first post");
      expect(item.content).toBe("<p>Full content</p>");
    });

    it("maps entry published and updated", () => {
      const item = feed.items[0]!;
      expect(item.published).toBe("2024-09-06T12:00:00Z");
      expect(item.updated).toBe("2024-09-07T12:00:00Z");
    });

    it("maps enclosure from link rel=enclosure", () => {
      expect(feed.items[0]!.enclosures).toEqual([
        { url: "http://example.com/file.mp3", type: "audio/mpeg", length: 12345 },
      ]);
    });

    it("maps entry source", () => {
      expect(feed.items[0]!.source).toEqual({
        id: "urn:uuid:source-feed",
        title: "Source Blog",
        url: "http://source.com/feed.atom",
      });
    });
  });

  describe("RSS 1.0 specific mappings", () => {
    const feed = parseFeed(RSS1_XML);

    it("maps rdf:about to id and feedUrl", () => {
      expect(feed.id).toBe("http://example.com/feed.rdf");
      expect(feed.feedUrl).toBe("http://example.com/feed.rdf");
    });

    it("maps image with full info", () => {
      expect(feed.image).toEqual({
        url: "http://example.com/logo.png",
        title: "Example",
        link: "http://example.com",
      });
    });

    it("maps item rdf:about to id", () => {
      expect(feed.items[0]!.id).toBe("http://example.com/1");
    });
  });

  it("throws on unknown format", () => {
    expect(() => parseFeed("<html></html>")).toThrow("Unknown feed format");
  });
});
