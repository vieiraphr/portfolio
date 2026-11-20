"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const POKEMON = [
  { id: 25, name: "pikachu" },
  { id: 6, name: "charizard" },
  { id: 94, name: "gengar" },
  { id: 9, name: "blastoise" },
  { id: 3, name: "venusaur" },
  { id: 150, name: "mewtwo" },
];

const sprite = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;

/** Miniatura da Pokédex do Pedro, trocando de Pokémon sozinha. */
export function PokedexPreview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % POKEMON.length), 2600);
    return () => clearInterval(id);
  }, []);

  const current = POKEMON[index];

  return (
    <div className="float relative mx-auto w-[min(15rem,70%)]" aria-hidden>
      <Image
        src="/projects/pokedex.png"
        alt=""
        width={425}
        height={637}
        className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]"
        priority={false}
      />
      {/* Tela da Pokédex: mesma área do PNG original (425x637) */}
      <div className="absolute left-[15.8%] top-[26.7%] flex h-[26.7%] w-[59.5%] items-end justify-center pb-[4%]">
        {/* eslint-disable-next-line @next/next/no-img-element -- GIF animado vindo da PokéAPI */}
        <img
          key={current.id}
          src={sprite(current.id)}
          alt=""
          className="pixelated poke-in h-[70%] w-auto"
          loading="lazy"
        />
      </div>
      <div className="absolute left-[15.8%] top-[57%] w-[59.5%] text-center font-mono text-[clamp(0.6rem,2.6vw,0.85rem)] font-bold text-[#3a3a3a]">
        <span className="text-[#6b6b6b]">#{String(current.id).padStart(3, "0")}</span>{" "}
        <span className="capitalize">{current.name}</span>
      </div>
    </div>
  );
}
