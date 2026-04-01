import type {
  RSS2Category,
  RSS2Channel,
  RSS2Cloud,
  RSS2Enclosure,
  RSS2Feed,
  RSS2Guid,
  RSS2Image,
  RSS2Item,
  RSS2Source,
  RSS2TextInput,
} from "../types";
import { type Xml, attr, text, toArray } from "./utils";
import { xmlParser } from "./xml";

export function parseRSS2(xml: string): RSS2Feed {
  const raw = xmlParser.parse(xml) as Xml;
  const rss = raw["rss"] as Xml | undefined;
  if (!rss) throw new Error("Invalid RSS 2.0: missing <rss> element");

  const channelRaw = rss["channel"] as Xml | undefined;
  if (!channelRaw) throw new Error("Invalid RSS 2.0: missing <channel> element");

  return {
    version: attr(rss, "version") ?? "2.0",
    channel: parseChannel(channelRaw),
  };
}

function parseChannel(raw: Xml): RSS2Channel {
  const channel: RSS2Channel = {
    title: text(raw["title"]) ?? "",
    link: text(raw["link"]) ?? "",
    description: text(raw["description"]) ?? "",
  };

  const language = text(raw["language"]);
  if (language !== undefined) channel.language = language;

  const copyright = text(raw["copyright"]);
  if (copyright !== undefined) channel.copyright = copyright;

  const managingEditor = text(raw["managingEditor"]);
  if (managingEditor !== undefined) channel.managingEditor = managingEditor;

  const webMaster = text(raw["webMaster"]);
  if (webMaster !== undefined) channel.webMaster = webMaster;

  const pubDate = text(raw["pubDate"]);
  if (pubDate !== undefined) channel.pubDate = pubDate;

  const lastBuildDate = text(raw["lastBuildDate"]);
  if (lastBuildDate !== undefined) channel.lastBuildDate = lastBuildDate;

  const generator = text(raw["generator"]);
  if (generator !== undefined) channel.generator = generator;

  const docs = text(raw["docs"]);
  if (docs !== undefined) channel.docs = docs;

  const rating = text(raw["rating"]);
  if (rating !== undefined) channel.rating = rating;

  if (raw["ttl"] != null) channel.ttl = Number(raw["ttl"]);

  if (raw["category"] != null) {
    channel.categories = (raw["category"] as unknown[]).map(parseCategory);
  }

  if (raw["cloud"] != null) {
    channel.cloud = parseCloud(raw["cloud"] as Xml);
  }

  if (raw["image"] != null) {
    channel.image = parseImage(raw["image"] as Xml);
  }

  if (raw["textInput"] != null) {
    channel.textInput = parseTextInput(raw["textInput"] as Xml);
  }

  if (raw["skipHours"] != null) {
    const hours = (raw["skipHours"] as Xml)["hour"];
    if (hours != null) channel.skipHours = toArray(hours).map(Number);
  }

  if (raw["skipDays"] != null) {
    const days = (raw["skipDays"] as Xml)["day"];
    if (days != null) channel.skipDays = toArray(days).map(String);
  }

  if (raw["item"] != null) {
    channel.items = (raw["item"] as Xml[]).map(parseItem);
  }

  return channel;
}

function parseCategory(raw: unknown): RSS2Category {
  if (typeof raw === "string") return { value: raw };
  const node = raw as Xml;
  const category: RSS2Category = { value: text(node["#text"]) ?? "" };
  const domain = attr(node, "domain");
  if (domain !== undefined) category.domain = domain;
  return category;
}

function parseCloud(raw: Xml): RSS2Cloud {
  return {
    domain: attr(raw, "domain") ?? "",
    port: Number(attr(raw, "port") ?? "0"),
    path: attr(raw, "path") ?? "",
    registerProcedure: attr(raw, "registerProcedure") ?? "",
    protocol: attr(raw, "protocol") ?? "",
  };
}

function parseImage(raw: Xml): RSS2Image {
  const image: RSS2Image = {
    url: text(raw["url"]) ?? "",
    title: text(raw["title"]) ?? "",
    link: text(raw["link"]) ?? "",
  };
  if (raw["width"] != null) image.width = Number(raw["width"]);
  if (raw["height"] != null) image.height = Number(raw["height"]);
  const description = text(raw["description"]);
  if (description !== undefined) image.description = description;
  return image;
}

function parseTextInput(raw: Xml): RSS2TextInput {
  return {
    title: text(raw["title"]) ?? "",
    description: text(raw["description"]) ?? "",
    name: text(raw["name"]) ?? "",
    link: text(raw["link"]) ?? "",
  };
}

function parseEnclosure(raw: Xml): RSS2Enclosure {
  return {
    url: attr(raw, "url") ?? "",
    length: Number(attr(raw, "length") ?? "0"),
    type: attr(raw, "type") ?? "",
  };
}

function parseGuid(raw: unknown): RSS2Guid {
  if (typeof raw === "string") return { value: raw };
  const node = raw as Xml;
  const guid: RSS2Guid = { value: text(node["#text"]) ?? "" };
  const isPermaLink = attr(node, "isPermaLink");
  if (isPermaLink !== undefined) guid.isPermaLink = isPermaLink === "true";
  return guid;
}

function parseSource(raw: unknown): RSS2Source {
  if (typeof raw === "string") return { url: "", value: raw };
  const node = raw as Xml;
  return {
    url: attr(node, "url") ?? "",
    value: text(node["#text"]) ?? "",
  };
}

function parseItem(raw: Xml): RSS2Item {
  const item: RSS2Item = {};

  const title = text(raw["title"]);
  if (title !== undefined) item.title = title;

  const link = text(raw["link"]);
  if (link !== undefined) item.link = link;

  const description = text(raw["description"]);
  if (description !== undefined) item.description = description;

  const author = text(raw["author"]);
  if (author !== undefined) item.author = author;

  if (raw["category"] != null) {
    item.categories = (raw["category"] as unknown[]).map(parseCategory);
  }

  const comments = text(raw["comments"]);
  if (comments !== undefined) item.comments = comments;

  if (raw["enclosure"] != null) {
    item.enclosure = parseEnclosure(raw["enclosure"] as Xml);
  }

  if (raw["guid"] != null) {
    item.guid = parseGuid(raw["guid"]);
  }

  const pubDate = text(raw["pubDate"]);
  if (pubDate !== undefined) item.pubDate = pubDate;

  if (raw["source"] != null) {
    item.source = parseSource(raw["source"]);
  }

  return item;
}
