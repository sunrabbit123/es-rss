import { describe, expect, it } from "vitest";
import { parseRSS2 } from "../src/parsers/rss2";

const SAMPLE_RSS2 = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>GoUpstate.com News Headlines</title>
    <link>http://www.goupstate.com/</link>
    <description>The latest news from GoUpstate.com</description>
    <language>en-us</language>
    <copyright>Copyright 2002</copyright>
    <managingEditor>geo@herald.com (George Matesky)</managingEditor>
    <webMaster>betty@herald.com (Betty Guernsey)</webMaster>
    <pubDate>Sat, 07 Sep 2002 00:00:01 GMT</pubDate>
    <lastBuildDate>Sat, 07 Sep 2002 09:42:31 GMT</lastBuildDate>
    <generator>MightyInHouse Content System v2.3</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>60</ttl>
    <category>Newspapers</category>
    <category domain="Syndic8">1765</category>
    <cloud domain="rpc.sys.com" port="80" path="/RPC2" registerProcedure="pingMe" protocol="soap"/>
    <image>
      <url>http://www.example.com/image.gif</url>
      <title>GoUpstate.com</title>
      <link>http://www.goupstate.com/</link>
      <width>88</width>
      <height>31</height>
      <description>News</description>
    </image>
    <skipHours>
      <hour>0</hour>
      <hour>1</hour>
      <hour>2</hour>
    </skipHours>
    <skipDays>
      <day>Saturday</day>
      <day>Sunday</day>
    </skipDays>
    <item>
      <title>Venice Film Festival</title>
      <link>http://nytimes.com/2004/12/07FEST.html</link>
      <description>Some of the most heated chatter</description>
      <author>author@example.com</author>
      <category>Film</category>
      <category domain="http://www.fool.com/cusips">MSFT</category>
      <comments>http://example.com/comments</comments>
      <enclosure url="http://example.com/file.mp3" length="12216320" type="audio/mpeg"/>
      <guid isPermaLink="true">http://example.com/item/1</guid>
      <pubDate>Sun, 19 May 2002 15:21:36 GMT</pubDate>
      <source url="http://www.tomalak.org/links2.xml">Tomalak's Realm</source>
    </item>
    <item>
      <title>Second Item</title>
      <link>http://example.com/2</link>
    </item>
  </channel>
</rss>`;

describe("parseRSS2", () => {
  const feed = parseRSS2(SAMPLE_RSS2);

  it("parses version", () => {
    expect(feed.version).toBe("2.0");
  });

  it("parses required channel elements", () => {
    expect(feed.channel.title).toBe("GoUpstate.com News Headlines");
    expect(feed.channel.link).toBe("http://www.goupstate.com/");
    expect(feed.channel.description).toBe("The latest news from GoUpstate.com");
  });

  it("parses optional channel text elements", () => {
    expect(feed.channel.language).toBe("en-us");
    expect(feed.channel.copyright).toBe("Copyright 2002");
    expect(feed.channel.managingEditor).toBe("geo@herald.com (George Matesky)");
    expect(feed.channel.webMaster).toBe("betty@herald.com (Betty Guernsey)");
    expect(feed.channel.pubDate).toBe("Sat, 07 Sep 2002 00:00:01 GMT");
    expect(feed.channel.lastBuildDate).toBe("Sat, 07 Sep 2002 09:42:31 GMT");
    expect(feed.channel.generator).toBe("MightyInHouse Content System v2.3");
    expect(feed.channel.docs).toBe("https://www.rssboard.org/rss-specification");
    expect(feed.channel.ttl).toBe(60);
  });

  it("parses categories", () => {
    expect(feed.channel.categories).toEqual([
      { value: "Newspapers" },
      { domain: "Syndic8", value: "1765" },
    ]);
  });

  it("parses cloud", () => {
    expect(feed.channel.cloud).toEqual({
      domain: "rpc.sys.com",
      port: 80,
      path: "/RPC2",
      registerProcedure: "pingMe",
      protocol: "soap",
    });
  });

  it("parses image", () => {
    expect(feed.channel.image).toEqual({
      url: "http://www.example.com/image.gif",
      title: "GoUpstate.com",
      link: "http://www.goupstate.com/",
      width: 88,
      height: 31,
      description: "News",
    });
  });

  it("parses skipHours and skipDays", () => {
    expect(feed.channel.skipHours).toEqual([0, 1, 2]);
    expect(feed.channel.skipDays).toEqual(["Saturday", "Sunday"]);
  });

  it("parses items", () => {
    expect(feed.channel.items).toHaveLength(2);
  });

  it("parses item with all elements", () => {
    const item = feed.channel.items![0]!;
    expect(item.title).toBe("Venice Film Festival");
    expect(item.link).toBe("http://nytimes.com/2004/12/07FEST.html");
    expect(item.description).toBe("Some of the most heated chatter");
    expect(item.author).toBe("author@example.com");
    expect(item.comments).toBe("http://example.com/comments");
    expect(item.pubDate).toBe("Sun, 19 May 2002 15:21:36 GMT");
  });

  it("parses item categories", () => {
    const item = feed.channel.items![0]!;
    expect(item.categories).toEqual([
      { value: "Film" },
      { domain: "http://www.fool.com/cusips", value: "MSFT" },
    ]);
  });

  it("parses enclosure", () => {
    const item = feed.channel.items![0]!;
    expect(item.enclosure).toEqual({
      url: "http://example.com/file.mp3",
      length: 12216320,
      type: "audio/mpeg",
    });
  });

  it("parses guid", () => {
    const item = feed.channel.items![0]!;
    expect(item.guid).toEqual({
      isPermaLink: true,
      value: "http://example.com/item/1",
    });
  });

  it("parses source", () => {
    const item = feed.channel.items![0]!;
    expect(item.source).toEqual({
      url: "http://www.tomalak.org/links2.xml",
      value: "Tomalak's Realm",
    });
  });

  it("throws on invalid input", () => {
    expect(() => parseRSS2("<feed></feed>")).toThrow("missing <rss> element");
  });
});
