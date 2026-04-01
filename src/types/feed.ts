export type FeedType = "atom" | "rss1" | "rss2";

export interface Feed {
  type: FeedType;
  title: string;
  description?: string;
  link?: string;
  feedUrl?: string;
  id?: string;
  language?: string;
  copyright?: string;
  authors?: FeedPerson[];
  published?: string;
  updated?: string;
  generator?: string;
  image?: FeedImage;
  categories?: FeedCategory[];
  items: FeedItem[];
}

export interface FeedItem {
  id?: string;
  title?: string;
  link?: string;
  description?: string;
  content?: string;
  authors?: FeedPerson[];
  published?: string;
  updated?: string;
  categories?: FeedCategory[];
  enclosures?: FeedEnclosure[];
  source?: FeedSource;
}

export interface FeedPerson {
  name?: string;
  email?: string;
  uri?: string;
}

export interface FeedImage {
  url: string;
  title?: string;
  link?: string;
}

export interface FeedCategory {
  term: string;
  scheme?: string;
  label?: string;
}

export interface FeedEnclosure {
  url: string;
  type?: string;
  length?: number;
}

export interface FeedSource {
  title?: string;
  url?: string;
  id?: string;
}
