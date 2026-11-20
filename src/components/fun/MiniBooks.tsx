"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "@/components/icons";

type Book = { title: string; author: string; note: string; cover: string; url: string };

const SPINE = ["#1d3f8f", "#141320"];

/**
 * Livros em 3D com a capa de verdade. Passar o mouse vira o livro de frente
 * e mostra a anotação; clicar abre a busca do livro na Amazon (nova aba).
 */
export function MiniBooks({ books, pick, amazon }: { books: Book[]; pick: string; amazon: string }) {
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? null : books[active];

  return (
    <div className="@container h-full">
      <div className="flex h-full flex-col items-center gap-4 @sm:flex-row @sm:items-stretch">
        <div className="flex shrink-0 items-end gap-5 border-b-4 border-[#5a3a22] px-3 pb-1 pt-4">
          {books.map((book, i) => (
            <a
              key={book.url}
              href={book.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${book.title}, ${book.author}: ${amazon}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="book3d group relative block rounded outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="book3d-inner" style={{ ["--spine" as string]: SPINE[i % SPINE.length] }}>
                <div className="book3d-face book3d-back" />
                <div className="book3d-face book3d-spine" />
                <div className="book3d-face book3d-pages" />
                <div className="book3d-face book3d-cover">
                  <Image src={book.cover} alt="" fill sizes="80px" className="object-cover" />
                  <span className="book3d-shine" />
                </div>
              </div>
              <span className="pointer-events-none absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent-strong px-2 py-0.5 font-mono text-[10px] font-bold text-white opacity-0 transition group-hover:-top-5 group-hover:opacity-100 group-focus-visible:opacity-100">
                Amazon ↗
              </span>
            </a>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center text-center @sm:text-left" aria-live="polite">
          {current ? (
            <div key={active} className="note-in">
              <p className="text-sm font-bold leading-snug text-fg">{current.title}</p>
              <p className="mt-0.5 font-mono text-[11px] text-accent">{current.author}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">{current.note}</p>
              <a
                href={current.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-term hover:underline"
              >
                {amazon} <ArrowUpRight className="size-3" />
              </a>
            </div>
          ) : (
            <p className="font-mono text-xs text-muted">
              <span className="text-term">$</span> {pick}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
