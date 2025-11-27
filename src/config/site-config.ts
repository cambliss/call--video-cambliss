export type SiteConfig = {
    name: string
    description: string
    url: string
    ogImage: string
    links: {
      twitter: string
      github: string
    }
}

export const siteConfig: SiteConfig = {
  name: "Cambliss cloud",
  description:
    "Instant video meetings for teams, clients & classes.",
  url: "https://callsquare.jaleelbennett.com",
  ogImage: "https://callsquare.jaleelbennett.com/web-shot.png",
  links: {
    twitter: "https://twitter.com/jal_eelll",
    github: "https://github.com/JaleelB/callsquare",
  },
}

// No favicon is set in this file, so no changes are needed.