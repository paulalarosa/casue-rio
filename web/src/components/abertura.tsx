"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import largo from "../../public/video/abertura.webp";
import retrato from "../../public/video/abertura-retrato.webp";
import { MARCA } from "@/lib/site";
import { arquivo } from "@/lib/caminho";

const LARGURA_RETRATO = 768;

const CONSULTA = `(max-width: ${LARGURA_RETRATO - 1}px)`;

function assinar(avisar: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", avisar);
  return () => mq.removeEventListener("change", avisar);
}

function lerCorte(): "largo" | "retrato" | null {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const poupando = (navigator as Navigator & { connection?: { saveData?: boolean } })
    .connection?.saveData;
  if (poupando) return null;
  return window.matchMedia(CONSULTA).matches ? "retrato" : "largo";
}

export function Abertura({ children }: { children: React.ReactNode }) {
  const corte = useSyncExternalStore(assinar, lerCorte, () => null);
  const [tocando, setTocando] = useState(false);

  const fonte = arquivo(
    corte === "retrato" ? "/video/abertura-retrato.mp4" : "/video/abertura.mp4",
  );

  return (
    <section className="relative">
      <div className="relative min-h-[min(46rem,92svh)] overflow-hidden bg-tinta-900">
        <Image
          src={largo}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center] max-sm:hidden"
        />
        <Image
          src={retrato}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover sm:hidden"
        />

        {corte && (
          <video
            src={fonte}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            onCanPlay={(e) => void e.currentTarget.play().catch(() => undefined)}
            onPlaying={() => setTocando(true)}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-[var(--ease-saida)] ${
              tocando ? "opacity-100" : "opacity-0"
            } ${corte === "largo" ? "object-[62%_center]" : ""}`}
          />
        )}

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 whitespace-nowrap px-4 text-center font-display text-[clamp(2rem,11vw,9.5rem)] font-bold leading-[0.8] tracking-[-0.035em] text-papel/[0.1]"
          style={{ top: "calc(var(--altura-topo) - 0.75rem)" }}
        >
          {MARCA}
        </span>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 sm:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,9,.94) 24%, rgba(10,10,9,.52) 62%, rgba(10,10,9,.12) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 max-sm:hidden"
          style={{
            background:
              "linear-gradient(96deg, rgba(10,10,9,.9) 0%, rgba(10,10,9,.66) 34%, rgba(10,10,9,.04) 62%), linear-gradient(to top, rgba(10,10,9,.66), transparent 46%)",
          }}
        />

        <div
          className="trilho relative flex h-full min-h-[inherit] flex-col justify-end pb-10 sm:pb-14"
          style={{ paddingTop: "calc(var(--altura-topo) + 1.25rem)" }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
