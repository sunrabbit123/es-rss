import type { AtomCategory, AtomEntry, AtomFeed, AtomLink, AtomPerson, AtomSource } from "../types/atom";
import type {
  Feed,
  FeedCategory,
  FeedEnclosure,
  FeedImage,
  FeedItem,
  FeedPerson,
  FeedSource,
} from "../types/feed";
import type { RSS1Feed, RSS1Item } from "../types/rss1";
import type { RSS2Category, RSS2Feed, RSS2Item } from "../types/rss2";

// --- Atom ---

export function normalizeAtom(source: AtomFeed): Feed {
  const feed: Feed = {
    type: "atom",
    title: source.title.value,
    items: source.entries?.map(normalizeAtomEntry) ?? [],
  };

  if (source.subtitle) feed.description = source.subtitle.value;
  feed.id = source.id;
  feed.updated = source.updated;

  if (source.links) {
    const link = findAlternateLink(source.links);
    if (link !== undefined) feed.link = link;
    const feedUrl = findSelfLink(source.links);
    if (feedUrl !== undefined) feed.feedUrl = feedUrl;
  }

  if (source.rights) feed.copyright = source.rights.value;

  if (source.authors && source.authors.length > 0) {
    feed.authors = source.authors.map(atomPersonToFeedPerson);
  }

  if (source.generator) feed.generator = source.generator.value;

  const imageUrl = source.logo || source.icon;
  if (imageUrl) feed.image = { url: imageUrl };

  if (source.categories && source.categories.length > 0) {
    feed.categories = source.categories.map(atomCategoryToFeedCategory);
  }

  return feed;
}

function normalizeAtomEntry(entry: AtomEntry): FeedItem {
  const item: FeedItem = {};

  item.id = entry.id;
  item.title = entry.title.value;
  item.updated = entry.updated;

  if (entry.published !== undefined) item.published = entry.published;

  if (entry.links) {
    const link = findAlternateLink(entry.links);
    if (link !== undefined) item.link = link;

    const enclosures = entry.links
      .filter((l) => l.rel === "enclosure")
      .map(atomLinkToEnclosure);
    if (enclosures.length > 0) item.enclosures = enclosures;
  }

  if (entry.summary) item.description = entry.summary.value;

  const contentValue = entry.content?.value;
  if (contentValue !== undefined) item.content = contentValue;

  if (entry.authors && entry.authors.length > 0) {
    item.authors = entry.authors.map(atomPersonToFeedPerson);
  }

  if (entry.categories && entry.categories.length > 0) {
    item.categories = entry.categories.map(atomCategoryToFeedCategory);
  }

  if (entry.source) item.source = normalizeAtomSource(entry.source);

  return item;
}

function normalizeAtomSource(src: AtomSource): FeedSource {
  const source: FeedSource = {};
  if (src.title) source.title = src.title.value;
  if (src.id !== undefined) source.id = src.id;
  if (src.links) {
    const url = findSelfLink(src.links) ?? findAlternateLink(src.links);
    if (url !== undefined) source.url = url;
  }
  return source;
}

function findAlternateLink(links: AtomLink[]): string | undefined {
  const alt = links.find((l) => l.rel === "alternate" || l.rel === undefined);
  return alt?.href;
}

function findSelfLink(links: AtomLink[]): string | undefined {
  return links.find((l) => l.rel === "self")?.href;
}

function atomPersonToFeedPerson(p: AtomPerson): FeedPerson {
  const person: FeedPerson = { name: p.name };
  if (p.email !== undefined) person.email = p.email;
  if (p.uri !== undefined) person.uri = p.uri;
  return person;
}

function atomCategoryToFeedCategory(c: AtomCategory): FeedCategory {
  const cat: FeedCategory = { term: c.term };
  if (c.scheme !== undefined) cat.scheme = c.scheme;
  if (c.label !== undefined) cat.label = c.label;
  return cat;
}

function atomLinkToEnclosure(link: AtomLink): FeedEnclosure {
  const enc: FeedEnclosure = { url: link.href };
  if (link.type !== undefined) enc.type = link.type;
  if (link.length !== undefined) {
    const len = Number(link.length);
    if (!Number.isNaN(len)) enc.length = len;
  }
  return enc;
}

// --- RSS 2.0 ---

export function normalizeRSS2(source: RSS2Feed): Feed {
  const ch = source.channel;
  const feed: Feed = {
    type: "rss2",
    title: ch.title,
    items: ch.items?.map(normalizeRSS2Item) ?? [],
  };

  feed.description = ch.description;
  feed.link = ch.link;

  if (ch.language !== undefined) feed.language = ch.language;
  if (ch.copyright !== undefined) feed.copyright = ch.copyright;
  if (ch.managingEditor !== undefined) {
    feed.authors = [parseEmailPerson(ch.managingEditor)];
  }
  if (ch.pubDate !== undefined) feed.published = ch.pubDate;
  if (ch.lastBuildDate !== undefined) feed.updated = ch.lastBuildDate;
  if (ch.generator !== undefined) feed.generator = ch.generator;

  if (ch.image) {
    const image: FeedImage = { url: ch.image.url };
    if (ch.image.title) image.title = ch.image.title;
    if (ch.image.link) image.link = ch.image.link;
    feed.image = image;
  }

  if (ch.categories && ch.categories.length > 0) {
    feed.categories = ch.categories.map(rss2CategoryToFeedCategory);
  }

  return feed;
}

function normalizeRSS2Item(item: RSS2Item): FeedItem {
  const result: FeedItem = {};

  const id = item.guid?.value;
  if (id) result.id = id;

  if (item.title !== undefined) result.title = item.title;
  if (item.link !== undefined) result.link = item.link;
  if (item.description !== undefined) result.description = item.description;

  if (item.author !== undefined) {
    result.authors = [parseEmailPerson(item.author)];
  }

  if (item.pubDate !== undefined) result.published = item.pubDate;

  if (item.categories && item.categories.length > 0) {
    result.categories = item.categories.map(rss2CategoryToFeedCategory);
  }

  if (item.enclosure) {
    result.enclosures = [
      {
        url: item.enclosure.url,
        type: item.enclosure.type,
        length: item.enclosure.length,
      },
    ];
  }

  if (item.source) {
    result.source = { title: item.source.value, url: item.source.url };
  }

  return result;
}

function rss2CategoryToFeedCategory(c: RSS2Category): FeedCategory {
  const cat: FeedCategory = { term: c.value };
  if (c.domain !== undefined) cat.scheme = c.domain;
  return cat;
}

function parseEmailPerson(value: string): FeedPerson {
  const match = value.match(/^([^\s(]+)\s*\(([^)]+)\)$/);
  if (match) {
    return { email: match[1]!, name: match[2]! };
  }
  return { email: value };
}

// --- RSS 1.0 ---

export function normalizeRSS1(source: RSS1Feed): Feed {
  const ch = source.channel;
  const feed: Feed = {
    type: "rss1",
    title: ch.title,
    items: source.items.map(normalizeRSS1Item),
  };

  feed.description = ch.description;
  feed.link = ch.link;
  feed.id = ch.about;
  feed.feedUrl = ch.about;

  if (source.image) {
    feed.image = {
      url: source.image.url,
      title: source.image.title,
      link: source.image.link,
    };
  }

  return feed;
}

function normalizeRSS1Item(item: RSS1Item): FeedItem {
  const result: FeedItem = {};
  result.id = item.about;
  result.title = item.title;
  result.link = item.link;
  if (item.description !== undefined) result.description = item.description;
  return result;
}
