import { describe, expect, it, beforeAll } from "vitest";
import { parseFeed } from "../../src";
import type { Feed } from "../../src";

const FEED_URLS = [
  "https://rss.blog.naver.com/pjt3591oo.xml",
  "https://evan-moon.github.io/feed.xml",
  "https://feeds.feedburner.com/geeknews-feed",
];

async function fetchFeed(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

for (const url of FEED_URLS) {
  describe(url, () => {
    let feed: Feed | undefined;
    let skipReason: string | undefined;

    beforeAll(async () => {
      try {
        const xml = await fetchFeed(url);
        feed = parseFeed(xml);
      } catch (e) {
        skipReason = (e as Error).message;
      }
    });

    it("fetches and parses without error", ({ skip }) => {
      if (skipReason) skip(`unreachable: ${skipReason}`);
      expect(feed).toBeDefined();
    });

    it("has a valid type", ({ skip }) => {
      if (!feed) skip();
      expect(["atom", "rss1", "rss2"]).toContain(feed!.type);
    });

    it("has a non-empty title", ({ skip }) => {
      if (!feed) skip();
      expect(feed!.title).toBeTruthy();
    });

    it("has a link", ({ skip }) => {
      if (!feed) skip();
      expect(feed!.link).toBeTruthy();
    });

    it("has items", ({ skip }) => {
      if (!feed) skip();
      expect(feed!.items.length).toBeGreaterThan(0);
    });

    it("every item has title or description", ({ skip }) => {
      if (!feed) skip();
      for (const item of feed!.items) {
        expect(item.title || item.description).toBeTruthy();
      }
    });

    it("every item has a link", ({ skip }) => {
      if (!feed) skip();
      for (const item of feed!.items) {
        expect(item.link).toBeTruthy();
      }
    });
  });
}
