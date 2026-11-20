import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { getDict, hasLocale, locales } from "@/content";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#07060b",
  colorScheme: "dark",
};

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDict(lang);

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    authors: [{ name: "Pedro Vieira" }],
    alternates: {
      canonical: `/${lang}`,
      languages: { "pt-BR": "/pt", en: "/en" },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: "website",
      locale: lang === "pt" ? "pt_BR" : "en_US",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang === "pt" ? "pt-BR" : "en"}
      className={`${grotesk.variable} ${mono.variable} antialiased`}
    >
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
