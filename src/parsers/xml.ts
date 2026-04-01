import { XMLParser } from "fast-xml-parser";

const ARRAY_TAGS = new Set([
  "item",
  "entry",
  "category",
  "hour",
  "day",
  "li",
]);

export const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  removeNSPrefix: true,
  isArray: (name) => ARRAY_TAGS.has(name),
  textNodeName: "#text",
  trimValues: true,
  parseTagValue: false,
  parseAttributeValue: false,
  processEntities: { enabled: true, maxTotalExpansions: Number.MAX_SAFE_INTEGER },
});
