import type {
  AtomCategory,
  AtomContent,
  AtomEntry,
  AtomFeed,
  AtomGenerator,
  AtomLink,
  AtomPerson,
  AtomSource,
  AtomTextConstruct,
} from "../types";
import { type Xml, attr, text, toArray } from "./utils";
import { xmlParser } from "./xml";

export function parseAtom(xml: string): AtomFeed {
  const raw = xmlParser.parse(xml) as Xml;
  const feedRaw = raw["feed"] as Xml | undefined;
  if (!feedRaw) throw new Error("Invalid Atom: missing <feed> element");

  const feed: AtomFeed = {
    id: text(feedRaw["id"]) ?? "",
    title: parseTextConstruct(feedRaw["title"]),
    updated: text(feedRaw["updated"]) ?? "",
  };

  const authors = toArray(feedRaw["author"]);
  if (authors.length > 0) feed.authors = authors.map((a) => parsePerson(a as Xml));

  const categories = feedRaw["category"] as Xml[] | undefined;
  if (categories != null && categories.length > 0) {
    feed.categories = categories.map(parseCategory);
  }

  const contributors = toArray(feedRaw["contributor"]);
  if (contributors.length > 0) {
    feed.contributors = contributors.map((c) => parsePerson(c as Xml));
  }

  if (feedRaw["generator"] != null) {
    feed.generator = parseGenerator(feedRaw["generator"]);
  }

  const icon = text(feedRaw["icon"]);
  if (icon !== undefined) feed.icon = icon;

  const links = toArray(feedRaw["link"]);
  if (links.length > 0) feed.links = links.map((l) => parseLink(l as Xml));

  const logo = text(feedRaw["logo"]);
  if (logo !== undefined) feed.logo = logo;

  if (feedRaw["rights"] != null) {
    feed.rights = parseTextConstruct(feedRaw["rights"]);
  }

  if (feedRaw["subtitle"] != null) {
    feed.subtitle = parseTextConstruct(feedRaw["subtitle"]);
  }

  const entries = feedRaw["entry"] as Xml[] | undefined;
  if (entries != null && entries.length > 0) {
    feed.entries = entries.map(parseEntry);
  }

  return feed;
}

function parseTextConstruct(raw: unknown): AtomTextConstruct {
  if (raw == null) return { value: "" };
  if (typeof raw === "string") return { value: raw };
  const node = raw as Xml;
  const construct: AtomTextConstruct = { value: text(node["#text"]) ?? "" };
  const type = attr(node, "type") as AtomTextConstruct["type"] | undefined;
  if (type !== undefined) construct.type = type;
  return construct;
}

function parsePerson(raw: Xml): AtomPerson {
  const person: AtomPerson = { name: text(raw["name"]) ?? "" };
  const uri = text(raw["uri"]);
  if (uri !== undefined) person.uri = uri;
  const email = text(raw["email"]);
  if (email !== undefined) person.email = email;
  return person;
}

function parseCategory(raw: Xml): AtomCategory {
  const category: AtomCategory = { term: attr(raw, "term") ?? "" };
  const scheme = attr(raw, "scheme");
  if (scheme !== undefined) category.scheme = scheme;
  const label = attr(raw, "label");
  if (label !== undefined) category.label = label;
  return category;
}

function parseGenerator(raw: unknown): AtomGenerator {
  if (typeof raw === "string") return { value: raw };
  const node = raw as Xml;
  const generator: AtomGenerator = { value: text(node["#text"]) ?? "" };
  const uri = attr(node, "uri");
  if (uri !== undefined) generator.uri = uri;
  const version = attr(node, "version");
  if (version !== undefined) generator.version = version;
  return generator;
}

function parseLink(raw: Xml): AtomLink {
  const link: AtomLink = { href: attr(raw, "href") ?? "" };
  const rel = attr(raw, "rel");
  if (rel !== undefined) link.rel = rel;
  const type = attr(raw, "type");
  if (type !== undefined) link.type = type;
  const hreflang = attr(raw, "hreflang");
  if (hreflang !== undefined) link.hreflang = hreflang;
  const title = attr(raw, "title");
  if (title !== undefined) link.title = title;
  const length = attr(raw, "length");
  if (length !== undefined) link.length = length;
  return link;
}

function parseContent(raw: unknown): AtomContent {
  if (raw == null) return {};
  if (typeof raw === "string") return { value: raw };
  const node = raw as Xml;
  const content: AtomContent = {};
  const type = attr(node, "type");
  if (type !== undefined) content.type = type;
  const src = attr(node, "src");
  if (src !== undefined) content.src = src;
  const value = text(node["#text"]);
  if (value !== undefined) content.value = value;
  return content;
}

function parseSource(raw: Xml): AtomSource {
  const source: AtomSource = {};

  const authors = toArray(raw["author"]);
  if (authors.length > 0) source.authors = authors.map((a) => parsePerson(a as Xml));

  const categories = raw["category"] as Xml[] | undefined;
  if (categories != null && categories.length > 0) {
    source.categories = categories.map(parseCategory);
  }

  const contributors = toArray(raw["contributor"]);
  if (contributors.length > 0) {
    source.contributors = contributors.map((c) => parsePerson(c as Xml));
  }

  if (raw["generator"] != null) source.generator = parseGenerator(raw["generator"]);

  const icon = text(raw["icon"]);
  if (icon !== undefined) source.icon = icon;

  const id = text(raw["id"]);
  if (id !== undefined) source.id = id;

  const links = toArray(raw["link"]);
  if (links.length > 0) source.links = links.map((l) => parseLink(l as Xml));

  const logo = text(raw["logo"]);
  if (logo !== undefined) source.logo = logo;

  if (raw["rights"] != null) source.rights = parseTextConstruct(raw["rights"]);
  if (raw["subtitle"] != null) source.subtitle = parseTextConstruct(raw["subtitle"]);
  if (raw["title"] != null) source.title = parseTextConstruct(raw["title"]);

  const updated = text(raw["updated"]);
  if (updated !== undefined) source.updated = updated;

  return source;
}

function parseEntry(raw: Xml): AtomEntry {
  const entry: AtomEntry = {
    id: text(raw["id"]) ?? "",
    title: parseTextConstruct(raw["title"]),
    updated: text(raw["updated"]) ?? "",
  };

  const authors = toArray(raw["author"]);
  if (authors.length > 0) entry.authors = authors.map((a) => parsePerson(a as Xml));

  const categories = raw["category"] as Xml[] | undefined;
  if (categories != null && categories.length > 0) {
    entry.categories = categories.map(parseCategory);
  }

  if (raw["content"] != null) entry.content = parseContent(raw["content"]);

  const contributors = toArray(raw["contributor"]);
  if (contributors.length > 0) {
    entry.contributors = contributors.map((c) => parsePerson(c as Xml));
  }

  const links = toArray(raw["link"]);
  if (links.length > 0) entry.links = links.map((l) => parseLink(l as Xml));

  const published = text(raw["published"]);
  if (published !== undefined) entry.published = published;

  if (raw["rights"] != null) entry.rights = parseTextConstruct(raw["rights"]);
  if (raw["source"] != null) entry.source = parseSource(raw["source"] as Xml);
  if (raw["summary"] != null) entry.summary = parseTextConstruct(raw["summary"]);

  return entry;
}
