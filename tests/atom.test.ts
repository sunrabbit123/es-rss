import { describe, expect, it } from "vitest";
import { parseAtom } from "../src/parsers/atom";

const SAMPLE_ATOM = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="text">dive into mark</title>
  <subtitle type="html">
    A &lt;em&gt;lot&lt;/em&gt; of effort went into making this effortless
  </subtitle>
  <updated>2005-07-31T12:29:29Z</updated>
  <id>tag:example.org,2003:3</id>
  <link rel="alternate" type="text/html" hreflang="en" href="http://example.org/"/>
  <link rel="self" type="application/atom+xml" href="http://example.org/feed.atom"/>
  <rights>Copyright (c) 2003, Mark Pilgrim</rights>
  <generator uri="http://www.example.com/" version="1.0">Example Toolkit</generator>
  <icon>http://example.org/icon.png</icon>
  <logo>http://example.org/logo.png</logo>
  <category term="technology" scheme="http://example.org/categories" label="Technology"/>
  <author>
    <name>Mark Pilgrim</name>
    <uri>http://example.org/</uri>
    <email>f8dy@example.com</email>
  </author>
  <contributor>
    <name>Sam Ruby</name>
  </contributor>
  <entry>
    <title>Atom draft-07 snapshot</title>
    <link rel="alternate" type="text/html" href="http://example.org/2005/04/02/atom"/>
    <link rel="enclosure" type="audio/mpeg" length="1337" href="http://example.org/audio/ph34r_my_podcast.mp3"/>
    <id>tag:example.org,2003:3.2397</id>
    <updated>2005-07-31T12:29:29Z</updated>
    <published>2003-12-13T08:29:29-04:00</published>
    <author>
      <name>Mark Pilgrim</name>
    </author>
    <contributor>
      <name>Joe Gregorio</name>
    </contributor>
    <category term="tech"/>
    <content type="html">&lt;p&gt;Hello world&lt;/p&gt;</content>
    <summary type="text">A short summary</summary>
    <rights>Copyright 2005</rights>
    <source>
      <id>tag:example.org,2003:source</id>
      <title>Source Feed</title>
      <updated>2005-07-31T12:29:29Z</updated>
    </source>
  </entry>
</feed>`;

describe("parseAtom", () => {
  const feed = parseAtom(SAMPLE_ATOM);

  it("parses feed id and updated", () => {
    expect(feed.id).toBe("tag:example.org,2003:3");
    expect(feed.updated).toBe("2005-07-31T12:29:29Z");
  });

  it("parses feed title", () => {
    expect(feed.title).toEqual({ type: "text", value: "dive into mark" });
  });

  it("parses subtitle", () => {
    expect(feed.subtitle?.type).toBe("html");
    expect(feed.subtitle?.value).toContain("lot");
  });

  it("parses rights as text construct", () => {
    expect(feed.rights?.value).toBe("Copyright (c) 2003, Mark Pilgrim");
  });

  it("parses generator", () => {
    expect(feed.generator).toEqual({
      uri: "http://www.example.com/",
      version: "1.0",
      value: "Example Toolkit",
    });
  });

  it("parses icon and logo", () => {
    expect(feed.icon).toBe("http://example.org/icon.png");
    expect(feed.logo).toBe("http://example.org/logo.png");
  });

  it("parses links", () => {
    expect(feed.links).toHaveLength(2);
    expect(feed.links![0]).toEqual({
      rel: "alternate",
      type: "text/html",
      hreflang: "en",
      href: "http://example.org/",
    });
    expect(feed.links![1]).toEqual({
      rel: "self",
      type: "application/atom+xml",
      href: "http://example.org/feed.atom",
    });
  });

  it("parses authors", () => {
    expect(feed.authors).toEqual([
      { name: "Mark Pilgrim", uri: "http://example.org/", email: "f8dy@example.com" },
    ]);
  });

  it("parses contributors", () => {
    expect(feed.contributors).toEqual([{ name: "Sam Ruby" }]);
  });

  it("parses categories", () => {
    expect(feed.categories).toEqual([
      { term: "technology", scheme: "http://example.org/categories", label: "Technology" },
    ]);
  });

  it("parses entries", () => {
    expect(feed.entries).toHaveLength(1);
  });

  it("parses entry metadata", () => {
    const entry = feed.entries![0]!;
    expect(entry.id).toBe("tag:example.org,2003:3.2397");
    expect(entry.title).toEqual({ value: "Atom draft-07 snapshot" });
    expect(entry.updated).toBe("2005-07-31T12:29:29Z");
    expect(entry.published).toBe("2003-12-13T08:29:29-04:00");
  });

  it("parses entry links", () => {
    const entry = feed.entries![0]!;
    expect(entry.links).toHaveLength(2);
    expect(entry.links![0]!.href).toBe("http://example.org/2005/04/02/atom");
    expect(entry.links![1]!.length).toBe("1337");
  });

  it("parses entry content", () => {
    const entry = feed.entries![0]!;
    expect(entry.content?.type).toBe("html");
    expect(entry.content?.value).toBe("<p>Hello world</p>");
  });

  it("parses entry summary", () => {
    const entry = feed.entries![0]!;
    expect(entry.summary).toEqual({ type: "text", value: "A short summary" });
  });

  it("parses entry authors and contributors", () => {
    const entry = feed.entries![0]!;
    expect(entry.authors).toEqual([{ name: "Mark Pilgrim" }]);
    expect(entry.contributors).toEqual([{ name: "Joe Gregorio" }]);
  });

  it("parses entry categories", () => {
    const entry = feed.entries![0]!;
    expect(entry.categories).toEqual([{ term: "tech" }]);
  });

  it("parses entry rights", () => {
    const entry = feed.entries![0]!;
    expect(entry.rights?.value).toBe("Copyright 2005");
  });

  it("parses entry source", () => {
    const entry = feed.entries![0]!;
    expect(entry.source?.id).toBe("tag:example.org,2003:source");
    expect(entry.source?.title?.value).toBe("Source Feed");
    expect(entry.source?.updated).toBe("2005-07-31T12:29:29Z");
  });

  it("throws on invalid input", () => {
    expect(() => parseAtom("<rss></rss>")).toThrow("missing <feed> element");
  });
});
