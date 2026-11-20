"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { pluck as playPluck } from "./audio";
import type { GuitarScene } from "./guitarScene";
import { MiniGuitarImage } from "./MiniGuitarImage";

const FREQS = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];
const RELOAD_FLAG = "pv-guitar-reloaded";

type Notes = { noWebgl: string; failed: string };

/** Erro típico de quando a página foi aberta antes de um deploy e o arquivo antigo do 3D já não existe. */
const isStaleChunk = (error: unknown) =>
  /chunk|dynamically imported module|importing a module script failed|failed to fetch/i.test(String(error));

/**
 * Violão 3D (three.js). O three só é baixado quando o card chega perto da tela.
 * Sem WebGL, ou se o 3D falhar, mostra uma foto do próprio violão 3D com as cordas tocáveis
 * (o motivo fica no title e no console).
 */
export function MiniGuitar3D({ label, loading, notes }: { label: string; loading: string; notes: Notes }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<GuitarScene | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [reason, setReason] = useState("");

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;

    const fallBack = (text: string) => {
      if (cancelled) return;
      setReason(text);
      setStatus("fallback");
    };

    // sem WebGL 2 (detectado no <head>, em layout.tsx) não há nada para baixar: mostra a foto na hora
    if (document.documentElement.dataset.webgl === "0") {
      console.warn("Violão 3D: este navegador não oferece WebGL 2. Usando a foto do violão.");
      const t = setTimeout(() => fallBack(notes.noWebgl), 0);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        try {
          const [THREE, { RoomEnvironment }, { createGuitarScene }] = await Promise.all([
            import("three"),
            import("three/examples/jsm/environments/RoomEnvironment.js"),
            import("./guitarScene"),
          ]);
          if (cancelled) return;
          sceneRef.current = createGuitarScene(THREE, RoomEnvironment, stage, (i) => playPluck(FREQS[i]));
          setStatus("ready");
          try {
            sessionStorage.removeItem(RELOAD_FLAG);
          } catch {
            /* sem sessionStorage: tudo bem */
          }
        } catch (error) {
          console.warn("Violão 3D indisponível, usando a foto do violão.", error);
          // página aberta antes de um deploy: recarrega uma única vez para pegar a versão nova
          if (isStaleChunk(error)) {
            try {
              if (!sessionStorage.getItem(RELOAD_FLAG)) {
                sessionStorage.setItem(RELOAD_FLAG, "1");
                window.location.reload();
                return;
              }
            } catch {
              /* sem sessionStorage: segue para o 2D */
            }
          }
          const detail = error instanceof Error ? error.message : String(error);
          fallBack(`${notes.failed} (${detail.slice(0, 80)})`);
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(stage);

    return () => {
      cancelled = true;
      io.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [notes]);

  const onKeyDown = (event: KeyboardEvent) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const n = Number(event.key);
    if (n >= 1 && n <= 6) scene.pluck(n - 1);
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      FREQS.forEach((_, i) => setTimeout(() => scene.pluck(i), i * 35));
    }
  };

  if (status === "fallback") return <MiniGuitarImage label={label} title={reason} />;

  return (
    <div
      className="guitar-glow relative h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
      role="group"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div ref={stageRef} className="absolute inset-0" />
      {status === "loading" && (
        <p className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted">
          <span className="text-term">$</span>&nbsp;{loading}
          <span className="caret" />
        </p>
      )}
    </div>
  );
}
