export interface RSS1Image {
  about: string;
  title: string;
  url: string;
  link: string;
}

export interface RSS1Item {
  about: string;
  title: string;
  link: string;
  description?: string;
}

export interface RSS1TextInput {
  about: string;
  title: string;
  description: string;
  name: string;
  link: string;
}

export interface RSS1Channel {
  about: string;
  title: string;
  link: string;
  description: string;
  image?: { resource: string };
  items: { resource: string }[];
  textInput?: { resource: string };
}

export interface RSS1Feed {
  channel: RSS1Channel;
  image?: RSS1Image;
  items: RSS1Item[];
  textInput?: RSS1TextInput;
}
