export interface AtomTextConstruct {
  type?: "text" | "html" | "xhtml";
  value: string;
}

export interface AtomPerson {
  name: string;
  uri?: string;
  email?: string;
}

export interface AtomCategory {
  term: string;
  scheme?: string;
  label?: string;
}

export interface AtomGenerator {
  uri?: string;
  version?: string;
  value: string;
}

export interface AtomLink {
  href: string;
  rel?: string;
  type?: string;
  hreflang?: string;
  title?: string;
  length?: string;
}

export interface AtomContent {
  type?: string;
  src?: string;
  value?: string;
}

export interface AtomSource {
  authors?: AtomPerson[];
  categories?: AtomCategory[];
  contributors?: AtomPerson[];
  generator?: AtomGenerator;
  icon?: string;
  id?: string;
  links?: AtomLink[];
  logo?: string;
  rights?: AtomTextConstruct;
  subtitle?: AtomTextConstruct;
  title?: AtomTextConstruct;
  updated?: string;
}

export interface AtomEntry {
  authors?: AtomPerson[];
  categories?: AtomCategory[];
  content?: AtomContent;
  contributors?: AtomPerson[];
  id: string;
  links?: AtomLink[];
  published?: string;
  rights?: AtomTextConstruct;
  source?: AtomSource;
  summary?: AtomTextConstruct;
  title: AtomTextConstruct;
  updated: string;
}

export interface AtomFeed {
  authors?: AtomPerson[];
  categories?: AtomCategory[];
  contributors?: AtomPerson[];
  generator?: AtomGenerator;
  icon?: string;
  id: string;
  links?: AtomLink[];
  logo?: string;
  rights?: AtomTextConstruct;
  subtitle?: AtomTextConstruct;
  title: AtomTextConstruct;
  updated: string;
  entries?: AtomEntry[];
}
