export interface RSS2Category {
  domain?: string;
  value: string;
}

export interface RSS2Cloud {
  domain: string;
  port: number;
  path: string;
  registerProcedure: string;
  protocol: string;
}

export interface RSS2Image {
  url: string;
  title: string;
  link: string;
  width?: number;
  height?: number;
  description?: string;
}

export interface RSS2TextInput {
  title: string;
  description: string;
  name: string;
  link: string;
}

export interface RSS2Enclosure {
  url: string;
  length: number;
  type: string;
}

export interface RSS2Guid {
  isPermaLink?: boolean;
  value: string;
}

export interface RSS2Source {
  url: string;
  value: string;
}

export interface RSS2Item {
  title?: string;
  link?: string;
  description?: string;
  author?: string;
  categories?: RSS2Category[];
  comments?: string;
  enclosure?: RSS2Enclosure;
  guid?: RSS2Guid;
  pubDate?: string;
  source?: RSS2Source;
}

export interface RSS2Channel {
  title: string;
  link: string;
  description: string;
  language?: string;
  copyright?: string;
  managingEditor?: string;
  webMaster?: string;
  pubDate?: string;
  lastBuildDate?: string;
  categories?: RSS2Category[];
  generator?: string;
  docs?: string;
  cloud?: RSS2Cloud;
  ttl?: number;
  image?: RSS2Image;
  rating?: string;
  textInput?: RSS2TextInput;
  skipHours?: number[];
  skipDays?: string[];
  items?: RSS2Item[];
}

export interface RSS2Feed {
  version: string;
  channel: RSS2Channel;
}
