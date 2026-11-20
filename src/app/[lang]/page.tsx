import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CopyEmail } from "@/components/CopyEmail";
import { PokedexPreview } from "@/components/PokedexPreview";
import { Background } from "@/components/Spotlight";
import { SkillGraph } from "@/components/SkillGraph";
import { MiniBooks } from "@/components/fun/MiniBooks";
import { MiniGi } from "@/components/fun/MiniGi";
import { MiniGuitar3D } from "@/components/fun/MiniGuitar3D";
import { MiniKeyboard } from "@/components/fun/MiniKeyboard";
import {
  ArrowDown,
  ArrowUpRight,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  PythonIcon,
} from "@/components/icons";
import { getDict, hasLocale, profile, type Dict, type Locale } from "@/content";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDict(lang);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-full bg-accent-strong px-4 py-2 font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {dict.nav.skip}
      </a>
      <Background />
      <Nav dict={dict} lang={lang} />
      <main id="conteudo">
        <Hero dict={dict} />
        <About dict={dict} />
        <Projects dict={dict} lang={lang} />
        <Stack dict={dict} />
        <Journey dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Nav({ dict, lang }: { dict: Dict; lang: Locale }) {
  const other: Locale = lang === "pt" ? "en" : "pt";
  const links = [
    ["#sobre", dict.nav.about],
    ["#projetos", dict.nav.projects],
    ["#stack", dict.nav.stack],
    ["#jornada", dict.nav.journey],
  ] as const;

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-line bg-bg/90 py-2 pl-5 pr-2">
        <a href="#topo" className="font-mono text-sm font-bold tracking-tight">
          <span className="text-accent">&lt;</span>PV<span className="text-accent"> /&gt;</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                className="rounded-full px-4 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-fg"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <div
            className="flex rounded-full border border-line p-1 font-mono text-xs"
            role="group"
            aria-label="Idioma / Language"
          >
            {(["pt", "en"] as const).map((code) => (
              <Link
                key={code}
                href={`/${code}`}
                hrefLang={code === "pt" ? "pt-BR" : "en"}
                aria-current={code === lang ? "true" : undefined}
                aria-label={code === other ? dict.nav.switchLabel : undefined}
                className={`rounded-full px-2.5 py-1 uppercase transition ${
                  code === lang ? "bg-accent-strong text-white" : "text-muted hover:text-fg"
                }`}
              >
                {code}
              </Link>
            ))}
          </div>
          <a
            href="#contato"
            className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent-strong hover:text-white"
          >
            {dict.nav.contact}
          </a>
        </div>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */

function Hero({ dict }: { dict: Dict }) {
  const h = dict.hero;
  return (
    <section id="topo" className="relative mx-auto max-w-6xl px-4 pb-4 pt-28 sm:pt-32">
      {/* celular: nome → foto/grafo → texto; desktop: nome e texto à esquerda, grafo à direita */}
      <div className="grid items-start gap-x-6 gap-y-2 lg:grid-cols-[1fr_1.15fr] lg:grid-rows-[auto_1fr] lg:gap-y-0">
        <div className="lg:col-start-1 lg:row-start-1">
          <h1 id="hero-name" className="hero-name font-bold uppercase leading-[0.85] tracking-[-0.04em]">
            <span className="hero-in block" style={{ animationDelay: "80ms" }}>
              Pedro
            </span>
            <span className="hero-in text-outline block" style={{ animationDelay: "160ms" }}>
              Vieira<span className="text-accent [-webkit-text-stroke:0]">.</span>
            </span>
          </h1>

          <p className="hero-in mt-6 font-mono text-sm text-violet sm:text-base" style={{ animationDelay: "240ms" }}>
            {"// "}
            {h.role}
          </p>
        </div>

        <div className="hero-in lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:-mt-8" style={{ animationDelay: "220ms" }}>
          <SkillGraph
            hubs={h.graph.hubs}
            hard={h.graph.hard}
            ai={h.graph.ai}
            soft={h.graph.soft}
            label={h.graph.label}
            alignTo="#hero-name"
          >
            <div className="relative">
              <div className="portrait relative size-40 overflow-hidden rounded-[1.75rem] sm:size-44 sm:rounded-[2rem] lg:size-56 lg:rounded-[2.25rem]">
                <Image
                  src="/pedro.webp"
                  alt={h.photoAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 224px, 176px"
                  className="object-cover"
                />
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-term/40 bg-bg px-2.5 py-1 font-mono text-[10px] text-term shadow-lg sm:text-xs">
                console.log(&quot;Hello World&quot;);
              </span>
            </div>
          </SkillGraph>
        </div>

        <div className="hero-in lg:col-start-1 lg:row-start-2" style={{ animationDelay: "320ms" }}>
          <p className="mt-8 text-balance text-3xl font-medium leading-tight sm:text-4xl">{h.headline}</p>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">{h.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projetos"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-strong px-6 py-3 font-medium text-white transition hover:shadow-[0_0_40px_-5px] hover:shadow-accent/60"
            >
              {h.ctaPrimary}
              <ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
            </a>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-medium transition hover:border-fg/40"
            >
              {h.ctaSecondary}
            </a>
          </div>
          <div className="mt-8 flex items-center gap-4 text-muted">
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLinks() {
  const items = [
    { href: profile.github, label: "GitHub", icon: <GithubIcon /> },
    { href: profile.linkedin, label: "LinkedIn", icon: <LinkedinIcon /> },
    { href: `mailto:${profile.email}`, label: "E-mail", icon: <MailIcon /> },
  ];
  return (
    <>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          aria-label={item.label}
          className="rounded-full p-2 transition hover:bg-white/5 hover:text-accent"
        >
          {item.icon}
        </a>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */

function SectionHeader({
  index,
  label,
  title,
  intro,
}: {
  index: string;
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <div data-reveal className="mb-8 max-w-3xl">
      <p className="font-mono text-sm text-accent">
        {index} <span className="text-muted">/ {label}</span>
      </p>
      <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">{title}</h2>
      {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
    </div>
  );
}

function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-16 px-4 py-12 sm:py-16">
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */

function About({ dict }: { dict: Dict }) {
  const a = dict.about;
  return (
    <Section id="sobre">
      <SectionHeader index="01" label={a.label} title={a.title} />
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div data-reveal className="space-y-5 text-lg leading-relaxed text-fg/85">
          {a.paragraphs.map((p) => (
            <p key={p} className="text-pretty">
              {p}
            </p>
          ))}
        </div>
        <div data-reveal className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {a.stats.map((s) => (
              <div key={s.label} className="card rounded-2xl p-4">
                {"icon" in s && s.icon === "python" ? (
                  <PythonIcon className="size-9 text-accent sm:size-10" role="img" aria-hidden={false} aria-label="Python" />
                ) : (
                  <p className="text-3xl font-bold text-accent sm:text-4xl">{s.value}</p>
                )}
                <p className="mt-2 text-xs leading-snug text-muted sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="card rounded-2xl p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">{a.softTitle}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {a.soft.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line px-3 py-1.5 text-sm transition hover:border-violet hover:text-violet"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Personal dict={dict} />
    </Section>
  );
}

function Personal({ dict }: { dict: Dict }) {
  const p = dict.about.personal;

  const cards = [
    {
      key: "keyboard",
      title: p.keyboard.title,
      hint: p.keyboard.hint,
      text: p.keyboard.text,
      widget: <MiniKeyboard label={p.keyboard.label} />,
    },
    {
      key: "guitar",
      title: p.guitar.title,
      hint: p.guitar.hint,
      text: p.guitar.text,
      widget: <MiniGuitar3D label={p.guitar.label} loading={p.guitar.loading} />,
    },
    {
      key: "bjj",
      title: p.bjj.title,
      hint: p.bjj.hint,
      text: p.bjj.text,
      badge: `🥋 ${p.bjj.badge}`,
      widget: <MiniGi label={p.bjj.label} bow={p.bjj.bow} />,
    },
    {
      key: "growth",
      title: p.growth.title,
      hint: p.growth.hint,
      text: p.growth.text,
      widget: <MiniBooks books={p.growth.books} pick={p.growth.pick} amazon={p.growth.amazon} />,
      tall: true,
    },
  ];

  return (
    <div className="mt-14">
      <div data-reveal>
        <h3 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{p.title}</h3>
        <p className="mt-2 font-mono text-sm text-muted">
          <span className="text-term">$</span> {p.intro}
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <article key={card.key} data-reveal className="card flex flex-col gap-4 rounded-3xl p-5 sm:p-6">
            <div className={`${card.tall ? "min-h-44" : "h-44"} rounded-2xl border border-line bg-bg/70 p-3`}>{card.widget}</div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-xl font-bold">{card.title}</h4>
              <span className="font-mono text-xs text-muted">↳ {card.hint}</span>
            </div>
            {card.badge && (
              <p className="w-fit rounded-full border border-line px-3 py-1 font-mono text-xs">{card.badge}</p>
            )}
            <p className="text-pretty text-muted">{card.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <li key={t} className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-xs text-fg/80">
          {t}
        </li>
      ))}
    </ul>
  );
}

function ProjectLink({ href, children, primary }: { href: string; children: ReactNode; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
        primary ? "bg-fg text-bg hover:bg-accent-strong hover:text-white" : "border border-line hover:border-fg/40"
      }`}
    >
      {children}
      <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function Projects({ dict, lang }: { dict: Dict; lang: Locale }) {
  const p = dict.projects;
  const { pokedex, estudos, portfolio } = profile.projects;
  const localize = (tags: string[]) => tags.map((t) => (lang === "en" && t === "POO" ? "OOP" : t));

  return (
    <Section id="projetos">
      <SectionHeader index="02" label={p.label} title={p.title} intro={p.intro} />

      {/* Destaque: Pokédex */}
      <article data-reveal className="card group/card grid overflow-hidden rounded-3xl lg:grid-cols-2">
        <div className="pokedex-stage relative flex items-center justify-center overflow-hidden p-10 sm:p-14">
          <span className="absolute left-5 top-5 rounded-full bg-bg/85 px-3 py-1 font-mono text-xs text-accent">
            ★ {p.featured}
          </span>
          <PokedexPreview />
        </div>
        <div className="flex flex-col gap-6 p-6 sm:p-10">
          <div>
            <h3 className="text-3xl font-bold">{p.items.pokedex.title}</h3>
            <p className="mt-3 text-pretty text-muted">{p.items.pokedex.summary}</p>
          </div>
          <dl className="grid gap-4 text-sm">
            {(
              [
                [p.problem, p.items.pokedex.problem],
                [p.solution, p.items.pokedex.solution],
                [p.learned, p.items.pokedex.learned],
              ] as const
            ).map(([term, desc]) => (
              <div key={term} className="border-l-2 border-line pl-4 transition group-hover/card:border-accent/50">
                <dt className="font-mono text-xs uppercase tracking-widest text-accent">{term}</dt>
                <dd className="mt-1 text-fg/85">{desc}</dd>
              </div>
            ))}
          </dl>
          <Tags tags={pokedex.tags} />
          <div className="mt-auto flex flex-wrap gap-3">
            <ProjectLink href={pokedex.live} primary>
              {p.live}
            </ProjectLink>
            <ProjectLink href={pokedex.code}>{p.code}</ProjectLink>
          </div>
        </div>
      </article>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Estudos acadêmicos */}
        <article data-reveal className="card flex flex-col overflow-hidden rounded-3xl">
          <CodeWindow />
          <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
            <h3 className="text-2xl font-bold">{p.items.estudos.title}</h3>
            <p className="text-pretty text-muted">{p.items.estudos.summary}</p>
            <p className="text-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-accent">{p.learned}: </span>
              <span className="text-fg/85">{p.items.estudos.learned}</span>
            </p>
            <Tags tags={localize(estudos.tags)} />
            <div className="mt-auto">
              <ProjectLink href={estudos.code}>{p.code}</ProjectLink>
            </div>
          </div>
        </article>

        {/* Este portfólio */}
        <article data-reveal className="card flex flex-col overflow-hidden rounded-3xl">
          <BrowserWindow here={p.here} />
          <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
            <h3 className="text-2xl font-bold">{p.items.portfolio.title}</h3>
            <p className="text-pretty text-muted">{p.items.portfolio.summary}</p>
            <p className="text-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-accent">{p.learned}: </span>
              <span className="text-fg/85">{p.items.portfolio.learned}</span>
            </p>
            <Tags tags={portfolio.tags} />
            <p className="mt-auto inline-flex items-center gap-2 font-mono text-sm text-accent">
              <span className="pulse-dot" /> {p.here}
            </p>
          </div>
        </article>
      </div>
    </Section>
  );
}

function CodeWindow() {
  return (
    <div className="code-stage border-b border-line p-6 font-mono text-[13px] leading-6" aria-hidden>
      <div className="rounded-xl border border-line bg-bg/80 p-4 shadow-xl">
        <p className="mb-3 text-xs text-muted">poo/javascript/script.js</p>
        <p>
          <span className="text-violet">class</span> <span className="text-accent">Aluno</span>{" "}
          <span className="text-violet">extends</span> <span className="text-accent">Pessoa</span> {"{"}
        </p>
        <p className="pl-4">
          <span className="text-sky-300">apresentar</span>() {"{"}
        </p>
        <p className="pl-8">
          <span className="text-violet">return</span>{" "}
          <span className="text-amber-200">{"`${"}</span>
          <span className="text-violet">super</span>.apresentar()
          <span className="text-amber-200">{"}`"}</span>
        </p>
        <p className="pl-4">{"}"}</p>
        <p>{"}"}</p>
      </div>
    </div>
  );
}

function BrowserWindow({ here }: { here: string }) {
  return (
    <div className="code-stage border-b border-line p-6" aria-hidden>
      <div className="overflow-hidden rounded-xl border border-line bg-bg/80 shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
          <span className="ml-2 flex-1 truncate rounded bg-white/5 px-2 py-0.5 font-mono text-[11px] text-muted">
            ~/pedro/portfolio
          </span>
        </div>
        <div className="relative h-[8.5rem] p-4">
          <p className="text-3xl font-bold uppercase leading-none tracking-tight">Pedro</p>
          <p className="text-outline-sm text-3xl font-bold uppercase leading-none tracking-tight">Vieira</p>
          <div className="mt-3 h-2 w-2/3 rounded bg-white/10" />
          <div className="mt-2 h-2 w-1/2 rounded bg-white/10" />
          <span className="absolute bottom-4 right-4 rounded-full bg-accent-strong px-2.5 py-1 font-mono text-[11px] font-bold text-white">
            ↖ {here}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Stack({ dict }: { dict: Dict }) {
  const s = dict.stack;
  const groups = [
    { title: s.main, items: profile.stack.main, tone: "main" },
    { title: s.also, items: profile.stack.also, tone: "also" },
    { title: s.next, items: profile.stack.next, tone: "next" },
  ] as const;

  return (
    <Section id="stack">
      <SectionHeader index="03" label={s.label} title={s.title} />
      <div className="grid gap-4 md:grid-cols-3">
        {groups.map((g) => (
          <div key={g.title} data-reveal className="card rounded-3xl p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">{g.title}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {g.items.map((item) => (
                <li
                  key={item}
                  className={
                    g.tone === "main"
                      ? "rounded-xl bg-accent-strong px-4 py-2.5 text-lg font-bold text-white"
                      : g.tone === "also"
                        ? "rounded-xl border border-line bg-white/5 px-4 py-2.5 text-lg font-medium"
                        : "rounded-xl border border-dashed border-violet/50 px-4 py-2.5 text-lg font-medium text-violet"
                  }
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

function Journey({ dict }: { dict: Dict }) {
  const j = dict.journey;
  return (
    <Section id="jornada">
      <SectionHeader index="04" label={j.label} title={j.title} />
      <ol className="relative ml-3 border-l border-line">
        {j.items.map((item, i) => {
          const last = i === j.items.length - 1;
          return (
            <li key={item.title} data-reveal className="relative pb-8 pl-8 last:pb-0 sm:pl-12">
              <span
                className={`absolute -left-[7px] top-1.5 size-3.5 rounded-full border-2 ${
                  last ? "pulse-ring border-accent bg-accent" : "border-accent/60 bg-bg"
                }`}
              />
              <p className="font-mono text-sm text-accent">{item.when}</p>
              <h3 className="mt-1 text-xl font-bold sm:text-2xl">{item.title}</h3>
              <p className="mt-2 max-w-2xl text-muted">{item.text}</p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

function Contact({ dict }: { dict: Dict }) {
  const c = dict.contact;
  return (
    <Section id="contato">
      <div data-reveal className="contact-card relative overflow-hidden rounded-[2rem] border border-line p-8 sm:p-14">
        <p className="font-mono text-sm text-accent">
          05 <span className="text-muted">/ {c.label}</span>
        </p>
        <h2 className="mt-6 max-w-4xl text-balance text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
          {c.title}
        </h2>
        <p className="mt-6 max-w-xl text-pretty text-lg text-muted">{c.text}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex max-w-full items-center gap-2 rounded-full bg-accent-strong px-6 py-3 font-medium text-white transition hover:shadow-[0_0_40px_-5px] hover:shadow-accent/60"
          >
            <MailIcon className="size-5 shrink-0" />
            <span className="truncate">{profile.email}</span>
          </a>
          <CopyEmail email={profile.email} label={c.copy} copiedLabel={c.copied} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ProjectLink href={profile.linkedin}>
            <LinkedinIcon className="size-4" /> LinkedIn
          </ProjectLink>
          <ProjectLink href={profile.github}>
            <GithubIcon className="size-4" /> GitHub
          </ProjectLink>
        </div>
      </div>
    </Section>
  );
}

function Footer({ dict }: { dict: Dict }) {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-line px-4 py-10 text-sm text-muted sm:flex-row">
      <p>
        © 2026 · {dict.footer.made}
      </p>
      <a href="#topo" className="font-mono transition hover:text-accent">
        ↑ {dict.footer.top}
      </a>
    </footer>
  );
}
