"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";

/* Vídeo de fundo: pôster por baixo, sempre, e o vídeo por cima quando pode.

   🔴 Isto nasceu de duplicação: a faixa do slogan e a cabeça das páginas
   internas iam repetir o mesmo bloco de regras de acessibilidade, e regra
   repetida é regra que fica para trás quando muda. A abertura da home NÃO
   usa isto de propósito: lá o arquivo troca por largura de tela (corte em
   retrato) e o pôster também, e enfiar isso aqui deixaria o componente com
   dois modos em vez de um.

   As três regras, num lugar só:
   · Quem pediu menos movimento ou está economizando dados não recebe vídeo
     nenhum. O elemento nem monta, então o `autoPlay` nunca desrespeita.
   · O arquivo só começa a baixar quando a peça chega perto da tela. Numa
     peça que já nasce visível o observador dispara na primeira medição, e
     por isso não existe um atalho para "ligar agora": o atalho seria
     `setState` dentro de efeito, que o lint barra e que pinta a tela uma vez
     a mais sem ganhar nada.
   · Quem dá o play é o ATRIBUTO. A chamada imperativa corria com
     `readyState` 0 e no celular voltava rejeitada em silêncio, então o vídeo
     simplesmente não tocava e nada avisava. `onCanPlay` fica de reserva. */
export function VideoFundo({
  fonte,
  poster,
  alt = "",
  prioridade = false,
  posicao,
  sizes = "100vw",
}: {
  fonte: string;
  poster: StaticImageData;
  alt?: string;
  prioridade?: boolean;
  posicao?: string;
  sizes?: string;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const [ligar, setLigar] = useState(false);
  const [tocando, setTocando] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const poupando = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    if (poupando) return;

    const alvo = caixa.current;
    if (!alvo) return;
    /* Sem `IntersectionObserver` (contexto de pré-visualização, miniatura) o
       pior caso tem de ser a peça mostrar o pôster, nunca ficar vazia. */
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

  return (
    <div ref={caixa} className="absolute inset-0">
      <Image
        src={poster}
        alt={alt}
        fill
        sizes={sizes}
        priority={prioridade}
        className="object-cover"
        style={posicao ? { objectPosition: posicao } : undefined}
      />
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
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-[var(--ease-saida)] ${
            tocando ? "opacity-100" : "opacity-0"
          }`}
          style={posicao ? { objectPosition: posicao } : undefined}
        />
      )}
    </div>
  );
}
