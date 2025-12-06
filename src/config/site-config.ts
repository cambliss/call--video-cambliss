export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "Cambliss Meet",
  description:
    "Instant video meetings for teams, clients, students & enterprises — powered by Cambliss Cloud.",
  url: "https://meet.cambliss.com",
  ogImage: "https://meet.cambliss.com/og-image.png",
  links: {
    twitter: "https://twitter.com/cambliss",
    github: "https://github.com/cambliss",
  },
};
