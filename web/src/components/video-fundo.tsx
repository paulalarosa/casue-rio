"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function VideoFundo({
  fonte,
  poster,
  alt = "",
  prioridade = false,
  posicao,
  sizes = "100vw",
  paralaxe = false,
}: {
  fonte: string;
  poster: StaticImageData;
  alt?: string;
  prioridade?: boolean;
  posicao?: string;
  sizes?: string;
  paralaxe?: boolean;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const trilha = useRef<HTMLDivElement>(null);
  const [ligar, setLigar] = useState(false);
  const [tocando, setTocando] = useState(false);

  useGSAP(
    () => {
      if (!paralaxe) return;
      const alvo = trilha.current;
      if (!alvo) return;
      let vivo = true;
      let matar = () => {};
      requestAnimationFrame(() => {
        if (!vivo) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const t = gsap.fromTo(
          alvo,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: caixa.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
        matar = () => {
          t.scrollTrigger?.kill();
          t.kill();
        };
      });
      return () => {
        vivo = false;
        matar();
      };
    },
    { scope: caixa, dependencies: [paralaxe] },
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const poupando = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    if (poupando) return;

    const alvo = caixa.current;
    if (!alvo) return;
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
    <div ref={caixa} className="absolute inset-0 overflow-hidden">
      <div
        ref={trilha}
        className={paralaxe ? "absolute inset-x-0 -top-[9%] h-[118%]" : "absolute inset-0"}
      >
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
    </div>
  );
}
