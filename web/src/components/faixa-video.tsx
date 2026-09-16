"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

/* Faixa de largura total com vídeo no fundo e conteúdo por cima.

   🔴 O vídeo só começa a baixar quando a faixa CHEGA PERTO da tela. Numa
   página com três faixas, `preload` em todas custaria a soma dos arquivos no
   primeiro carregamento, e a pessoa pode nem descer até lá. O observador
   liga a fonte 300px antes, que é perto o bastante para já estar tocando
   quando aparece e longe o bastante para não pesar na abertura.

   Mesma regra da abertura: pôster é o primeiro quadro do próprio vídeo, e
   quem pediu menos movimento ou está economizando dados fica só com ele. */
export function FaixaVideo({
  fonte,
  poster,
  children,
  className,
  altura = "min-h-[26rem] sm:min-h-[34rem]",
  veu = "linear-gradient(to top, rgba(10,10,9,.82), rgba(10,10,9,.42) 60%, rgba(10,10,9,.62))",
}: {
  fonte: string;
  poster: StaticImageData;
  children: React.ReactNode;
  className?: string;
  altura?: string;
  veu?: string;
}) {
  const secao = useRef<HTMLDivElement>(null);
  const [ligar, setLigar] = useState(false);
  const [tocando, setTocando] = useState(false);

  useEffect(() => {
    const alvo = secao.current;
    if (!alvo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const poupando = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    if (poupando) return;
    /* Sem `IntersectionObserver` (contexto de pré-visualização, miniatura) o
       pior caso tem de ser a faixa mostrar o pôster, nunca ficar vazia. */
    if (typeof IntersectionObserver === "undefined") return;
    const olho = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setLigar(true);
          olho.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    olho.observe(alvo);
    return () => olho.disconnect();
  }, []);

  /* 🔴 Quem dá o play é o ATRIBUTO `autoPlay`, não uma chamada nossa. A
     chamada imperativa corria no mesmo instante em que o <video> montava,
     com `readyState` 0, e no celular a promessa voltava rejeitada; como eu
     capturava a rejeição em silêncio, o vídeo simplesmente não tocava e nada
     avisava. `autoPlay` é o caminho do próprio navegador, e o `onCanPlay`
     fica de reserva para o caso de a primeira tentativa ter sido descartada.

     Só monta quando o movimento é permitido, então `autoPlay` aqui nunca
     desrespeita quem pediu menos movimento: o elemento nem existe. */
  return (
    <section ref={secao} className={cn("relative overflow-hidden bg-tinta-900", altura, className)}>
      <Image src={poster} alt="" fill sizes="100vw" className="object-cover" />
      {ligar && (
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
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-700 ease-[var(--ease-saida)]",
            tocando ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: veu }} />
      <div className="trilho relative flex h-full min-h-[inherit] flex-col items-center justify-center py-20 text-center">
        {children}
      </div>
    </section>
  );
}
