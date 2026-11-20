"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { pluck as playPluck } from "./audio";
import type { GuitarScene } from "./guitarScene";
import { MiniGuitar } from "./MiniGuitar";

const FREQS = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];
const RELOAD_FLAG = "pv-guitar-reloaded";

type Notes = { noWebgl: string; failed: string };

/** Erro típico de quando a página foi aberta antes de um deploy e o arquivo antigo do 3D já não existe. */
const isStaleChunk = (error: unknown) =>
  /chunk|dynamically imported module|importing a module script failed|failed to fetch/i.test(String(error));

/**
 * Violão 3D (three.js). O three só é baixado quando o card chega perto da tela.
 * Sem WebGL, ou se o 3D falhar, mostra o violão 2D com o motivo escrito embaixo.
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

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        // detectado no <head> (layout.tsx): sem WebGL 2 não adianta baixar o three.js
        if (document.documentElement.dataset.webgl === "0") {
          console.warn("Violão 3D: este navegador não oferece WebGL 2. Usando a versão 2D.");
          fallBack(notes.noWebgl);
          return;
        }

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
          console.warn("Violão 3D indisponível, usando a versão 2D.", error);
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

  if (status === "fallback") {
    return (
      <div className="relative h-full">
        <MiniGuitar label={label} />
        <p className="absolute inset-x-2 bottom-0 truncate text-center font-mono text-[10px] text-muted" title={reason}>
          {reason}
        </p>
      </div>
    );
  }

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
