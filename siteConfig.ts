export type LinkTab = {
  key: string;
  label: string;
  link: string;
  section: HTMLElement | null;
};

export const siteConfig = {
  name: "Unified Online University",
  url: "https://uou.com",
  ogImage: "https://uou.com/og.svg",
  description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, quod.`,

  keywords: [],
};

export type SiteConfig = typeof siteConfig;
