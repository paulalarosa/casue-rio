"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ===========================================================================
   A DOUTRINA DESTE ARQUIVO, em uma frase: animação nunca pode ser a razão
   de alguém não ver o site.

   Isto já quebrou de dois jeitos diferentes, os dois em produção:

   1. com `ScrollTrigger`, o gatilho não disparou dentro do painel embutido e
      as dezesseis seções da home ficaram TODAS em opacidade zero;
   2. com `IntersectionObserver`, existe contexto (miniatura, pré-render) em
      que o observador nunca entrega entrada, e o efeito é idêntico.

   Daí a regra que divide tudo aqui em duas famílias:

   · 🔴 O que ESCONDE para revelar depois nunca depende do ScrollTrigger. Usa
     `scroll` + `getBoundingClientRect`, que é evento do navegador com medida
     síncrona, e ainda leva um cão de guarda: se em 1,6s o elemento continuar
     escondido e não houver sinal de vida, ele aparece por decreto.
   · O que só MEXE em coisa já visível (paralaxe, zoom lento, deriva) pode
     usar ScrollTrigger à vontade, porque o pior caso dele é a peça ficar
     parada, e peça parada é o site de antes.

   Nada aqui roda com `prefers-reduced-motion: reduce`.
   ======================================================================== */

/** Só arma animação quando existe janela de verdade e quadro andando. Se o
 *  `requestAnimationFrame` não dispara, nada disto roda, e o conteúdo fica
 *  exatamente onde nasceu, visível. Foi a falta desta trava que apagou a
 *  home inteira uma vez. */
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

/** Quebra o texto de um elemento em palavras, cada uma numa máscara própria,
 *  para a palavra poder subir de dentro da linha em vez de só aparecer.
 *
 *  🔴 Só mexe em elemento cujo conteúdo é TEXTO PURO. Título com `<b>`,
 *  `<Link>` ou qualquer marcação dentro sai inteiro daqui, senão a quebra
 *  destruiria o link e a ênfase. */
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
    /* 🔴 A máscara corta o que passa da caixa da linha, e a perna do "g", do
       "q" e a cedilha de "Negócios" passam. Sem esta folga a palavra sobe
       bonita e chega decapitada por baixo. A margem negativa devolve o
       espaço para o layout não crescer. */
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

/* ---------------------------------------------------------------- ABERTURA */

/** Entrada da abertura: o título sobe palavra por palavra de dentro da
 *  própria linha, a busca vem depois e a ficha do imóvel entra por último,
 *  vindo da direita, que é o lado de onde ela pertence ao layout.
 *
 *  🔴 O `y` é o efeito principal e a opacidade é acessório: mesmo que o
 *  cronômetro morra no meio, o pior caso é texto 26px fora do lugar, não
 *  texto invisível. Por isso o `from` sempre parte de `autoAlpha: 0` COM
 *  `y`, e o cão de guarda abaixo fecha a conta. */
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

        /* Cão de guarda: se em 1,6s a linha do tempo não tiver andado, o
           ambiente não está animando, e aí o estado final entra de uma vez.
           É isto que garante que nenhum caminho deste arquivo termine com a
           abertura em branco. */
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

/* ----------------------------------------------------------------- REVELA */

/** Revelação por rolagem, medida.
 *
 *  Quem dispara é `scroll` + `getBoundingClientRect`: evento do navegador com
 *  medida síncrona, sem observador e sem cache de posição, então funciona
 *  com conteúdo que cresce depois (imagem, fonte). Quem anima é o GSAP, que
 *  é o que dá o escalonamento e a saída em escala.
 *
 *  O `h2` da seção, quando é texto puro, sobe palavra por palavra. É o que
 *  faz a landing parecer viva sem encher a tela de movimento: o movimento
 *  fica na hierarquia, no título e nos blocos, não em tudo. */
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

      /* Esconder é a EXCEÇÃO e acontece agora, dentro do quadro, com o
         compositor já provado vivo. */
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
        // Entrou em 88% da tela e ainda não passou por cima: toca.
        if (r.top < window.innerHeight * 0.88 && r.bottom > 0) tocar();
      };

      const desligar = () => {
        window.removeEventListener("scroll", checar);
        window.removeEventListener("resize", checar);
      };

      /* Cão de guarda do bloco: se em 1,6s nada rolou e a seção continua
         escondida, ela aparece. Cobre aba oculta, pré-render e miniatura. */
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
