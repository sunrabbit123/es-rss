# es-rss

A lightweight TypeScript library for parsing RSS and Atom feeds into structured JavaScript objects.

## Features

- **Multi-format support** — RSS 2.0, RSS 1.0, Atom 1.0
- **Auto-detection** — Automatically detects feed format and returns a unified object
- **Structured output** — Parsed feeds returned as plain JS objects
- **Dual module** — Ships both ESM and CJS (bundled with tsup)
- **Type-safe** — Full TypeScript type definitions included

## Install

```bash
npm install es-rss
```

## Usage

### Unified parsing (auto-detect format)

```ts
import { parseFeed } from "es-rss";

const feed = parseFeed(xmlString);

console.log(feed.type);        // "atom" | "rss1" | "rss2"
console.log(feed.title);       // feed title
console.log(feed.link);        // website URL
console.log(feed.items);       // normalized entries

for (const item of feed.items) {
  console.log(item.title);
  console.log(item.link);
  console.log(item.description);
  console.log(item.content);     // Atom only
  console.log(item.published);
  console.log(item.authors);
  console.log(item.categories);
  console.log(item.enclosures);
}
```

### Format-specific parsing

```ts
import { parseAtom, parseRSS1, parseRSS2 } from "es-rss";

const atom = parseAtom(atomXml);   // AtomFeed
const rss1 = parseRSS1(rss1Xml);  // RSS1Feed
const rss2 = parseRSS2(rss2Xml);  // RSS2Feed
```

## Unified Feed Model

`parseFeed()` normalizes all three formats into a single `Feed` type:

### Feed

| Field        | Type             | Atom                  | RSS 2.0                | RSS 1.0            |
|--------------|------------------|-----------------------|------------------------|---------------------|
| `type`       | `FeedType`       | `"atom"`              | `"rss2"`               | `"rss1"`            |
| `title`      | `string`         | `title`               | `title`                | `title`             |
| `description`| `string?`        | `subtitle`            | `description`          | `description`       |
| `link`       | `string?`        | `link[rel=alternate]` | `link`                 | `link`              |
| `feedUrl`    | `string?`        | `link[rel=self]`      | —                      | `rdf:about`         |
| `id`         | `string?`        | `id`                  | —                      | `rdf:about`         |
| `language`   | `string?`        | —                     | `language`             | —                   |
| `copyright`  | `string?`        | `rights`              | `copyright`            | —                   |
| `authors`    | `FeedPerson[]?`  | `author`              | `managingEditor`       | —                   |
| `published`  | `string?`        | —                     | `pubDate`              | —                   |
| `updated`    | `string?`        | `updated`             | `lastBuildDate`        | —                   |
| `generator`  | `string?`        | `generator`           | `generator`            | —                   |
| `image`      | `FeedImage?`     | `logo` / `icon`       | `image`                | `image`             |
| `categories` | `FeedCategory[]?`| `category`            | `category`             | —                   |
| `items`      | `FeedItem[]`     | `entry`               | `item`                 | `item`              |

### FeedItem

| Field        | Type              | Atom                  | RSS 2.0          | RSS 1.0       |
|--------------|-------------------|-----------------------|------------------|---------------|
| `id`         | `string?`         | `id`                  | `guid`           | `rdf:about`   |
| `title`      | `string?`         | `title`               | `title`          | `title`       |
| `link`       | `string?`         | `link[rel=alternate]` | `link`           | `link`        |
| `description`| `string?`         | `summary`             | `description`    | `description` |
| `content`    | `string?`         | `content`             | —                | —             |
| `authors`    | `FeedPerson[]?`   | `author`              | `author`         | —             |
| `published`  | `string?`         | `published`           | `pubDate`        | —             |
| `updated`    | `string?`         | `updated`             | —                | —             |
| `categories` | `FeedCategory[]?` | `category`            | `category`       | —             |
| `enclosures` | `FeedEnclosure[]?`| `link[rel=enclosure]` | `enclosure`      | —             |
| `source`     | `FeedSource?`     | `source`              | `source`         | —             |

## Supported Formats

| Format   | Supported |
|----------|-----------|
| RSS 2.0  | ✅        |
| RSS 1.0  | ✅        |
| Atom 1.0 | ✅        |

## License

MIT
