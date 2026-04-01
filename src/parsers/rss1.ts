import type {
  RSS1Channel,
  RSS1Feed,
  RSS1Image,
  RSS1Item,
  RSS1TextInput,
} from "../types";
import { type Xml, attr, text, toArray } from "./utils";
import { xmlParser } from "./xml";

export function parseRSS1(xml: string): RSS1Feed {
  const raw = xmlParser.parse(xml) as Xml;
  const rdf = raw["RDF"] as Xml | undefined;
  if (!rdf) throw new Error("Invalid RSS 1.0: missing <rdf:RDF> element");

  const channelRaw = rdf["channel"] as Xml | undefined;
  if (!channelRaw) throw new Error("Invalid RSS 1.0: missing <channel> element");

  const feed: RSS1Feed = {
    channel: parseChannel(channelRaw),
    items: toArray(rdf["item"] as Xml | Xml[] | undefined).map(parseItem),
  };

  if (rdf["image"] != null) {
    feed.image = parseImage(rdf["image"] as Xml);
  }

  if (rdf["textinput"] != null) {
    feed.textInput = parseTextInput(rdf["textinput"] as Xml);
  }

  return feed;
}

function parseChannel(raw: Xml): RSS1Channel {
  const channel: RSS1Channel = {
    about: attr(raw, "about") ?? "",
    title: text(raw["title"]) ?? "",
    link: text(raw["link"]) ?? "",
    description: text(raw["description"]) ?? "",
    items: [],
  };

  if (raw["image"] != null) {
    const resource = attr(raw["image"] as Xml, "resource");
    if (resource !== undefined) channel.image = { resource };
  }

  const itemsNode = raw["items"] as Xml | undefined;
  if (itemsNode) {
    const seq = itemsNode["Seq"] as Xml | undefined;
    if (seq) {
      const lis = seq["li"] as Xml[] | undefined;
      if (lis) {
        channel.items = lis.map((li) => ({
          resource: attr(li, "resource") ?? "",
        }));
      }
    }
  }

  if (raw["textinput"] != null) {
    const resource = attr(raw["textinput"] as Xml, "resource");
    if (resource !== undefined) channel.textInput = { resource };
  }

  return channel;
}

function parseItem(raw: Xml): RSS1Item {
  const item: RSS1Item = {
    about: attr(raw, "about") ?? "",
    title: text(raw["title"]) ?? "",
    link: text(raw["link"]) ?? "",
  };
  const description = text(raw["description"]);
  if (description !== undefined) item.description = description;
  return item;
}

function parseImage(raw: Xml): RSS1Image {
  return {
    about: attr(raw, "about") ?? "",
    title: text(raw["title"]) ?? "",
    url: text(raw["url"]) ?? "",
    link: text(raw["link"]) ?? "",
  };
}

function parseTextInput(raw: Xml): RSS1TextInput {
  return {
    about: attr(raw, "about") ?? "",
    title: text(raw["title"]) ?? "",
    description: text(raw["description"]) ?? "",
    name: text(raw["name"]) ?? "",
    link: text(raw["link"]) ?? "",
  };
}
