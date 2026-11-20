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

/**
 * Roda antes da primeira pintura. Testa se o navegador tem WebGL 2 com aceleração de vídeo (GPU).
 * Sem GPU, o navegador desenha tudo no processador e os efeitos visuais ficam lentos; nesse caso
 * marca o <html> com data-lite="1" e o site desliga os efeitos caros. data-webgl="0" faz o violão
 * ir direto para a versão 2D, com o motivo escrito.
 */
const DETECT_GPU = `(function(){try{
var d=document.documentElement,lite=false;
var c=document.createElement("canvas"),gl=c.getContext("webgl2");
if(!gl){d.setAttribute("data-webgl","0");lite=true;}
else{var e=gl.getExtension("WEBGL_debug_renderer_info");
var r=e?String(gl.getParameter(e.UNMASKED_RENDERER_WEBGL)):"";
if(/swiftshader|llvmpipe|softpipe|software|basic render/i.test(r)){d.setAttribute("data-webgl","soft");lite=true;}
var x=gl.getExtension("WEBGL_lose_context");if(x)x.loseContext();}
if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)lite=true;
if(lite)d.setAttribute("data-lite","1");
}catch(_){}})();`;

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
      // o script abaixo adiciona data-* no <html> antes do React carregar
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: DETECT_GPU }} />
      </head>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
