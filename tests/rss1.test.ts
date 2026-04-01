import { describe, expect, it } from "vitest";
import { parseRSS1 } from "../src/parsers/rss1";

const SAMPLE_RSS1 = `<?xml version="1.0"?>
<rdf:RDF
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns="http://purl.org/rss/1.0/"
>
  <channel rdf:about="http://www.xml.com/xml/news.rss">
    <title>XML.com</title>
    <link>http://xml.com/pub</link>
    <description>XML.com features a rich mix of information and services for the XML community.</description>

    <image rdf:resource="http://xml.com/universal/images/xml_tiny.gif" />

    <items>
      <rdf:Seq>
        <rdf:li resource="http://xml.com/pub/2000/08/09/xslt/xslt.html" />
        <rdf:li resource="http://xml.com/pub/2000/08/09/rdfdb/index.html" />
      </rdf:Seq>
    </items>

    <textinput rdf:resource="http://search.xml.com" />
  </channel>

  <image rdf:about="http://xml.com/universal/images/xml_tiny.gif">
    <title>XML.com</title>
    <link>http://www.xml.com</link>
    <url>http://xml.com/universal/images/xml_tiny.gif</url>
  </image>

  <item rdf:about="http://xml.com/pub/2000/08/09/xslt/xslt.html">
    <title>Processing Inclusions with XSLT</title>
    <link>http://xml.com/pub/2000/08/09/xslt/xslt.html</link>
    <description>Processing document inclusions with general XML tools can be problematic.</description>
  </item>

  <item rdf:about="http://xml.com/pub/2000/08/09/rdfdb/index.html">
    <title>Putting RDF to Work</title>
    <link>http://xml.com/pub/2000/08/09/rdfdb/index.html</link>
  </item>

  <textinput rdf:about="http://search.xml.com">
    <title>Search XML.com</title>
    <description>Search XML.com's XML collection</description>
    <name>s</name>
    <link>http://search.xml.com</link>
  </textinput>
</rdf:RDF>`;

describe("parseRSS1", () => {
  const feed = parseRSS1(SAMPLE_RSS1);

  it("parses channel metadata", () => {
    expect(feed.channel.about).toBe("http://www.xml.com/xml/news.rss");
    expect(feed.channel.title).toBe("XML.com");
    expect(feed.channel.link).toBe("http://xml.com/pub");
    expect(feed.channel.description).toContain("XML.com features");
  });

  it("parses channel image reference", () => {
    expect(feed.channel.image).toEqual({
      resource: "http://xml.com/universal/images/xml_tiny.gif",
    });
  });

  it("parses channel items sequence", () => {
    expect(feed.channel.items).toEqual([
      { resource: "http://xml.com/pub/2000/08/09/xslt/xslt.html" },
      { resource: "http://xml.com/pub/2000/08/09/rdfdb/index.html" },
    ]);
  });

  it("parses channel textinput reference", () => {
    expect(feed.channel.textInput).toEqual({
      resource: "http://search.xml.com",
    });
  });

  it("parses top-level image", () => {
    expect(feed.image).toEqual({
      about: "http://xml.com/universal/images/xml_tiny.gif",
      title: "XML.com",
      link: "http://www.xml.com",
      url: "http://xml.com/universal/images/xml_tiny.gif",
    });
  });

  it("parses items", () => {
    expect(feed.items).toHaveLength(2);
    expect(feed.items[0]).toEqual({
      about: "http://xml.com/pub/2000/08/09/xslt/xslt.html",
      title: "Processing Inclusions with XSLT",
      link: "http://xml.com/pub/2000/08/09/xslt/xslt.html",
      description: "Processing document inclusions with general XML tools can be problematic.",
    });
  });

  it("parses item without description", () => {
    expect(feed.items[1]!.title).toBe("Putting RDF to Work");
    expect(feed.items[1]!.description).toBeUndefined();
  });

  it("parses textInput", () => {
    expect(feed.textInput).toEqual({
      about: "http://search.xml.com",
      title: "Search XML.com",
      description: "Search XML.com's XML collection",
      name: "s",
      link: "http://search.xml.com",
    });
  });

  it("throws on invalid input", () => {
    expect(() => parseRSS1("<rss></rss>")).toThrow("missing <rdf:RDF> element");
  });
});
