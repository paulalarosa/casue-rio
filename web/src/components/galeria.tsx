"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type NomeCena } from "@/components/cenas";
import { Midia } from "@/components/midia";
import type { Imovel } from "@/lib/carteira";
import { cn } from "@/lib/utils";

type Quadro = { foto?: string; cena: NomeCena };

function roteiro(im: Imovel): Quadro[] {
  if (im.fotos?.length) return im.fotos.map((f) => ({ foto: f, cena: im.cena }));
  if (im.foto) return [{ foto: im.foto, cena: im.cena }];
  const lista: Quadro[] = [{ cena: im.cena }];
  if (im.cena !== "interior") lista.push({ cena: "interior" });
  if (im.cena !== "vista" && im.cena !== "comercial") lista.push({ cena: "vista" });
  return lista;
}

export function Galeria({ im, capa }: { im: Imovel; capa?: React.ReactNode }) {
  const quadros = roteiro(im);
  const [i, setI] = useState(0);
  const toqueX = useRef<number | null>(null);
  const anda = (d: number) => setI((v) => (v + d + quadros.length) % quadros.length);

  useEffect(() => {
    function tecla(e: KeyboardEvent) {
      const emCampo = (e.target as HTMLElement)?.closest("input, textarea, select");
      if (emCampo) return;
      if (e.key === "ArrowRight") anda(1);
      if (e.key === "ArrowLeft") anda(-1);
    }
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  });

  function inicio(e: React.PointerEvent) {
    toqueX.current = e.clientX;
  }
  function fim(e: React.PointerEvent) {
    if (toqueX.current === null) return;
    const d = e.clientX - toqueX.current;
    toqueX.current = null;
    if (Math.abs(d) > 40) anda(d < 0 ? 1 : -1);
  }

  return (
    <div className="trilho" style={{ paddingTop: "calc(var(--altura-topo) + 1.75rem)" }}>
      <div
        className="relative isolate touch-pan-y overflow-hidden rounded-[1rem] shadow-[var(--shadow-flutua-3)]"
        role="group"
        aria-roledescription="galeria"
        aria-label={`Imagens de ${im.titulo}`}
        onPointerDown={inicio}
        onPointerUp={fim}
      >
        <div className="relative aspect-[16/9] w-full max-md:aspect-4/5">
          <Midia
            foto={quadros[i].foto}
            alt={im.alt}
            cena={quadros[i].cena}
            semente={im.codigo}
            rotulo={`Ilustração da marca: ${im.titulo}`}
            sizes="100vw"
            prioridade={i === 0}
          />
        </div>

        {capa && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,9,.86) 0%, rgba(10,10,9,.42) 34%, rgba(10,10,9,0) 62%), linear-gradient(to bottom, rgba(10,10,9,.5), transparent 34%)",
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-papel sm:p-9">
              {capa}
            </div>
          </>
        )}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-5">
          {[
            { d: -1, rot: "Imagem anterior", Ic: ChevronLeft },
            { d: 1, rot: "Próxima imagem", Ic: ChevronRight },
          ].map(({ d, rot, Ic }) => (
            <button
              key={rot}
              type="button"
              aria-label={rot}
              onClick={() => anda(d)}
              className="tinta pointer-events-auto grid size-12 place-items-center rounded-full transition-transform duration-300 hover:scale-105"
            >
              <Ic className="size-5" aria-hidden />
            </button>
          ))}
        </div>

        <span
          aria-live="polite"
          className="tinta num absolute right-5 top-5 rounded-full px-4 py-2 text-sm"
        >
          {i + 1} / {quadros.length}
        </span>
      </div>

      <div className="mt-4 flex gap-3">
        {quadros.map((q, k) => (
          <button
            key={(q.foto ?? q.cena) + k}
            type="button"
            aria-label={`Imagem ${k + 1}`}
            aria-current={k === i}
            onClick={() => setI(k)}
            className={cn(
              "relative aspect-4/3 w-24 overflow-hidden rounded-[0.75rem] border-2 transition-all duration-300",
              k === i
                ? "border-areia-500"
                : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <Midia
              foto={q.foto}
              cena={q.cena}
              semente={im.codigo}
              rotulo=""
              sizes="6rem"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
