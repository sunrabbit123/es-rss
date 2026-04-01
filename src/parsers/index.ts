import type { Feed } from "../types/feed";
import type { Xml } from "./utils";
import { parseAtom } from "./atom";
import { normalizeAtom, normalizeRSS1, normalizeRSS2 } from "./normalize";
import { parseRSS1 } from "./rss1";
import { parseRSS2 } from "./rss2";
import { xmlParser } from "./xml";

export { parseAtom, parseRSS1, parseRSS2 };

export function parseFeed(xml: string): Feed {
  const raw = xmlParser.parse(xml) as Xml;

  if (raw["rss"] != null) return normalizeRSS2(parseRSS2(xml));
  if (raw["RDF"] != null) return normalizeRSS1(parseRSS1(xml));
  if (raw["feed"] != null) return normalizeAtom(parseAtom(xml));

  throw new Error("Unknown feed format");
}
