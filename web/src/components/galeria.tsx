"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { type NomeCena } from "@/components/cenas";
import { Midia } from "@/components/midia";
import type { Imovel } from "@/lib/carteira";
import { arquivo } from "@/lib/caminho";
import { cn } from "@/lib/utils";

type Quadro = { foto?: string; video?: string; cena: NomeCena };

function roteiro(im: Imovel): Quadro[] {
  const tour: Quadro[] = im.video
    ? [{ video: im.video, foto: im.video.replace(/\.mp4$/, ".webp"), cena: im.cena }]
    : [];
  if (im.fotos?.length)
    return [...tour, ...im.fotos.map((f) => ({ foto: f, cena: im.cena }))];
  if (im.foto) return [{ foto: im.foto, cena: im.cena }];
  const lista: Quadro[] = [{ cena: im.cena }];
  if (im.cena !== "interior") lista.push({ cena: "interior" });
  if (im.cena !== "vista" && im.cena !== "comercial") lista.push({ cena: "vista" });
  return lista;
}

function miniatura(foto?: string) {
  if (!foto) return foto;
  return foto.replace(/\.webp$/, "-min.webp");
}

const QUIETO = "(prefers-reduced-motion: reduce)";

function useMovimentoLiberado() {
  return useSyncExternalStore<boolean | null>(
    (avisar) => {
      const m = window.matchMedia(QUIETO);
      m.addEventListener("change", avisar);
      return () => m.removeEventListener("change", avisar);
    },
    () => {
      const poupando = (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData;
      return !window.matchMedia(QUIETO).matches && !poupando;
    },
    () => null,
  );
}

function Tour({
  fonte,
  poster,
  alt,
  filme,
  aoMudar,
}: {
  fonte: string;
  poster: string;
  alt?: string;
  filme: React.RefObject<HTMLVideoElement | null>;
  aoMudar: (tocando: boolean) => void;
}) {
  const ligado = useMovimentoLiberado();

  return (
    <>
      <Midia foto={poster} alt={alt} cena="interior" rotulo="" sizes="100vw" prioridade />
      {ligado !== null && (
        <video
          ref={filme}
          src={arquivo(fonte)}
          poster={arquivo(poster)}
          autoPlay={ligado}
          muted
          loop
          playsInline
          preload={ligado ? "auto" : "none"}
          aria-label={alt ? `Vídeo: ${alt}` : "Vídeo do imóvel"}
          onCanPlay={(e) => {
            if (ligado) void e.currentTarget.play().catch(() => undefined);
          }}
          onPlay={() => aoMudar(true)}
          onPause={() => aoMudar(false)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </>
  );
}

export function Galeria({ im, capa }: { im: Imovel; capa?: React.ReactNode }) {
  const quadros = roteiro(im);
  const [i, setI] = useState(0);
  const filme = useRef<HTMLVideoElement>(null);
  const [tocando, setTocando] = useState(false);
  const noVideo = Boolean(quadros[i].video);

  function alterna() {
    const v = filme.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => undefined);
    else v.pause();
  }
  const toqueX = useRef<number | null>(null);
  const anda = (d: number) => {
    setTocando(false);
    setI((v) => (v + d + quadros.length) % quadros.length);
  };

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
          {quadros[i].video ? (
            <Tour
              fonte={quadros[i].video!}
              poster={quadros[i].foto!}
              alt={im.alt}
              filme={filme}
              aoMudar={setTocando}
            />
          ) : (
            <Midia
              foto={quadros[i].foto}
              alt={im.alt}
              cena={quadros[i].cena}
              semente={im.codigo}
              rotulo={`Ilustração da marca: ${im.titulo}`}
              sizes="100vw"
              prioridade={i === 0}
            />
          )}
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

        <div className="absolute right-5 top-5 flex items-center gap-2">
          {noVideo && (
            <>
              <span className="tinta rotulo hidden rounded-full px-3 py-2 lg:inline">
                Vídeo feito a partir das fotos
              </span>
              <button
                type="button"
                aria-label={tocando ? "Pausar o vídeo" : "Tocar o vídeo"}
                onClick={alterna}
                className="tinta grid size-10 place-items-center rounded-full transition-transform duration-300 hover:scale-105"
              >
                {tocando ? (
                  <Pause className="size-4" aria-hidden />
                ) : (
                  <Play className="size-4" aria-hidden />
                )}
              </button>
            </>
          )}
          <span aria-live="polite" className="tinta num rounded-full px-4 py-2 text-sm">
            {i + 1} / {quadros.length}
          </span>
        </div>
      </div>

      <div className="-mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
        {quadros.map((q, k) => (
          <button
            key={(q.foto ?? q.cena) + k}
            type="button"
            aria-label={q.video ? "Vídeo do imóvel" : `Imagem ${k + 1}`}
            aria-current={k === i}
            onClick={() => {
              if (k !== i) setTocando(false);
              setI(k);
            }}
            className={cn(
              "relative aspect-4/3 w-24 shrink-0 overflow-hidden rounded-[0.75rem] border-2 transition-all duration-300",
              k === i
                ? "border-areia-500"
                : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <Midia
              foto={miniatura(q.foto)}
              cena={q.cena}
              semente={im.codigo}
              rotulo=""
              sizes="6rem"
            />
            {q.video && (
              <span className="tinta absolute inset-0 m-auto grid size-8 place-items-center rounded-full">
                <Play className="size-4" aria-hidden />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
