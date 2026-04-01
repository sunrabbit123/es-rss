# es-rss

A lightweight TypeScript library for parsing RSS and Atom feeds into structured JavaScript objects.

## Features

- **Multi-format support** — RSS 2.0, RSS 1.0, Atom 1.0
- **Structured output** — Parsed feeds returned as plain JS objects
- **Dual module** — Ships both ESM and CJS (bundled with tsup)
- **Type-safe** — Full TypeScript type definitions included

## Install

```bash
npm install es-rss
```

## Usage

```ts
import { parse } from "es-rss";

const feed = parse(xmlString);

console.log(feed.title);
console.log(feed.items); // parsed entries
```

## Output Structure

```ts
interface Feed {
  title: string;
  description?: string;
  link?: string;
  items: FeedItem[];
}

interface FeedItem {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  author?: string;
  categories?: string[];
  guid?: string;
}
```

## Supported Formats

| Format   | Supported |
| -------- | --------- |
| RSS 2.0  | ✅        |
| RSS 1.0  | ✅        |
| Atom 1.0 | ✅        |

## License

MIT