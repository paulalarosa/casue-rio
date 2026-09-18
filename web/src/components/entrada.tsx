"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);


function comQuadro(armar: () => (() => void) | void) {
  let cancelado = false;
  let desfazer: (() => void) | void;
  requestAnimationFrame(() => {
    if (cancelado) return;
    const alt = window.innerHeight;
    if (!alt || alt < 200) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    desfazer = armar();
  });
  return () => {
    cancelado = true;
    desfazer?.();
  };
}

function emPalavras(el: HTMLElement): HTMLElement[] {
  if (el.children.length > 0) return [];
  const texto = el.textContent ?? "";
  if (!texto.trim()) return [];
  el.textContent = "";
  const palavras: HTMLElement[] = [];
  for (const [i, p] of texto.trim().split(/\s+/).entries()) {
    const mascara = document.createElement("span");
    mascara.style.display = "inline-block";
    mascara.style.overflow = "hidden";
    mascara.style.verticalAlign = "top";
    mascara.style.paddingBottom = "0.16em";
    mascara.style.marginBottom = "-0.16em";
    const dentro = document.createElement("span");
    dentro.style.display = "inline-block";
    dentro.textContent = p;
    mascara.append(dentro);
    el.append(mascara);
    if (i < texto.trim().split(/\s+/).length - 1) el.append(document.createTextNode(" "));
    palavras.push(dentro);
  }
  return palavras;
}


export function EntradaAbertura({ children }: { children: React.ReactNode }) {
  const raiz = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const no = raiz.current;
      if (!no) return;
      return comQuadro(() => {
        const titulo = no.querySelector<HTMLElement>("[data-entra='titulo']");
        const palavras = titulo ? emPalavras(titulo) : [];

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (palavras.length) {
          tl.from(palavras, {
            yPercent: 115,
            duration: 0.9,
            stagger: 0.055,
          });
        } else if (titulo) {
          tl.from(titulo, { y: 26, duration: 0.7 });
        }

        tl.from("[data-entra='busca']", { y: 26, autoAlpha: 0, duration: 0.6 }, "-=0.45")
          .from(
            "[data-entra='ficha']",
            { x: 44, y: 16, autoAlpha: 0, duration: 0.7 },
            "-=0.42",
          );

        const cao = window.setTimeout(() => {
          if (tl.progress() < 1) tl.progress(1);
        }, 1600);

        return () => window.clearTimeout(cao);
      });
    },
    { scope: raiz },
  );

  return (
    <div ref={raiz} className="contents">
      {children}
    </div>
  );
}


export function Revela({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const no = raiz.current;
    if (!no) return;

    return comQuadro(() => {
      const blocos = Array.from(no.querySelectorAll<HTMLElement>("[data-revela]"));
      const titulo = no.querySelector<HTMLElement>("h2");
      const palavras = titulo ? emPalavras(titulo) : [];
      if (!blocos.length && !palavras.length) return;

      if (palavras.length) gsap.set(palavras, { yPercent: 110 });
      if (blocos.length) gsap.set(blocos, { y: 34, autoAlpha: 0 });

      let tocou = false;
      const tocar = () => {
        if (tocou) return;
        tocou = true;
        desligar();
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (palavras.length) {
          tl.to(palavras, { yPercent: 0, duration: 0.85, stagger: 0.04 });
        }
        if (blocos.length) {
          tl.to(
            blocos,
            { y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.09 },
            palavras.length ? "-=0.6" : 0,
          );
        }
        window.setTimeout(() => {
          if (tl.progress() < 1) tl.progress(1);
        }, 2400);
      };

      const checar = () => {
        const r = no.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.88 && r.bottom > 0) tocar();
      };

      const desligar = () => {
        window.removeEventListener("scroll", checar);
        window.removeEventListener("resize", checar);
      };

      const cao = window.setTimeout(tocar, 1600);

      checar();
      window.addEventListener("scroll", checar, { passive: true });
      window.addEventListener("resize", checar);

      return () => {
        window.clearTimeout(cao);
        desligar();
      };
    });
  }, []);

  return (
    <div ref={raiz} id={id} className={className}>
      {children}
    </div>
  );
}
