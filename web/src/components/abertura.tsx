"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import largo from "../../public/video/abertura.webp";
import retrato from "../../public/video/abertura-retrato.webp";
import { MARCA } from "@/lib/site";
import { arquivo } from "@/lib/caminho";

/* A abertura da home: a rua da Zona Sul no fim da tarde, em vídeo.

   🔴 Isto substituiu uma sequência de rolagem em three.js. O que se ganhou e
   o que se perdeu, medido, para ninguém reverter por engano:

   · O 3D custava mais de 400 kB de pacote e só ligava a partir de 768px, com
     movimento reduzido desligando tudo. Ou seja: **quem chegava pelo celular
     nunca via a cena**, e numa imobiliária o celular é a maioria. O vídeo
     pesa 858 kB no corte largo e 390 kB no retrato, mas carrega aos poucos,
     não trava a linha principal, não gasta bateria e TOCA NO CELULAR.
   · Em bytes o vídeo é mais pesado. Em experiência, alcança mais gente.
   · A coreografia presa à rolagem saiu de propósito. MP4 comum tem
     quadro-chave a cada 8–12 quadros: arrastar trava. Para ficar fluido
     seria preciso codificar tudo em quadro-chave, o que triplica o peso.
     Laço simples com o texto por cima entrega o mesmo.

   🔴 Só MP4, sem WebM. Não é preguiça: medi os dois. O VP9 saiu MAIOR que o
   H.264 neste material (930 kB contra 858 kB), porque é plano largo, pouco
   movimento e muita área lisa de céu. Dois formatos onde um é melhor em tudo
   é peso no repositório sem ganho.

   🔴 A marca d'água do gerador foi CORTADA na codificação, não apagada por
   filtro: o `delogo` deixava um borrão visível por cima do gradil. O corte
   tira 160px da base, e é por isso que o arquivo é 1280×560. */

/** Largura abaixo da qual entra o corte em retrato. O mesmo plano cortado em
 *  9:16, porque 2,29:1 numa tela de telefone sobra 28% da largura e a
 *  composição morre. */
const LARGURA_RETRATO = 768;

/* 🔴 `useSyncExternalStore` e nao `useState` + `useEffect`. A escolha do
   corte depende de `matchMedia`, que so existe no navegador, e a versao com
   efeito escrevia estado no primeiro efeito: alem de o lint barrar
   (`set-state-in-effect`), isso pinta a tela uma vez a mais. Aqui o servidor
   devolve `null`, o navegador devolve o corte, e trocar a largura da janela
   reavalia sozinho, porque a assinatura escuta a propria consulta. */
const CONSULTA = `(max-width: ${LARGURA_RETRATO - 1}px)`;

function assinar(avisar: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", avisar);
  return () => mq.removeEventListener("change", avisar);
}

function lerCorte(): "largo" | "retrato" | null {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  /* Dado economizado: quem pediu para o sistema poupar rede nao recebe video
     nenhum, e fica com o poster, que e o primeiro quadro do proprio arquivo. */
  const poupando = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection?.saveData;
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
        {/* O pôster é o primeiro quadro do vídeo e é ele o LCP. Fica por
            baixo sempre: se o vídeo não tocar, por escolha de quem visita ou
            por rede ruim, a abertura continua sendo a cena e não um vazio. */}
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

        {/* Marca d'água: o nome em corpo enorme, cortado pelo topo, atrás da
            cena. Fica ANTES do véu, então some do lado esquerdo, onde está o
            texto, e sobra visível do lado do céu, que é onde não havia nada.

            O corpo é calculado para o nome INTEIRO caber na largura. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 whitespace-nowrap px-4 text-center font-display text-[clamp(2rem,11vw,9.5rem)] font-bold leading-[0.8] tracking-[-0.035em] text-papel/[0.1]"
          style={{ top: "calc(var(--altura-topo) - 0.75rem)" }}
        >
          {MARCA}
        </span>

        {/* Véu, em duas versões, e agora em TINTA e não em azul: o azul era da
            marca velha e deixava a cena com lavagem fria por cima da areia.
            No desktop escurece da esquerda, que é onde mora o texto, e deixa
            a rua limpa à direita. No celular isso apagaria a imagem inteira,
            porque 62% de 390px é quase a tela toda: lá o véu sobe de baixo. */}
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
