import { en } from "./en";
import { pt, type Dict } from "./pt";

export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

const dictionaries: Record<Locale, Dict> = { pt, en };

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const getDict = (locale: Locale): Dict => dictionaries[locale];

export type { Dict };

/** Dados que não mudam com o idioma. */
export const profile = {
  name: "Pedro Vieira",
  email: "pedrovieira2705@gmail.com",
  github: "https://github.com/vieiraphr",
  linkedin: "https://www.linkedin.com/in/pedro-vieira-212046295",
  stack: {
    main: ["JavaScript", "HTML5", "CSS3"],
    also: ["Python", "MySQL", "Git", "GitHub"],
    next: ["TypeScript", "React", "Next.js", "Node.js"],
  },
  projects: {
    pokedex: {
      tags: ["HTML5", "CSS3", "JavaScript", "PokéAPI", "Fetch API"],
      live: "https://vieiraphr.github.io/pokedex.github.io/",
      code: "https://github.com/vieiraphr/pokedex.github.io",
    },
    estudos: {
      tags: ["Python", "JavaScript", "POO", "HTML5", "CSS3"],
      code: "https://github.com/vieiraphr/estudos-academicos",
    },
    portfolio: {
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "i18n"],
    },
  },
};
