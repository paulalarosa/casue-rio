import Image from "next/image";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { imagem } from "@/lib/sanity";

/* O texto do artigo, desenhado pelo site.

   🔴 O painel guarda só o PAPEL de cada trecho: isto é parágrafo, isto é
   subtítulo, isto é citação. Quem decide a aparência é este arquivo, e é por
   isso que um texto colado do Word não consegue trazer Calibri para dentro
   de um site em Unbounded. É a mesma razão de o painel não oferecer escolha
   de cor nem de tamanho: a escolha mora aqui, uma vez, para todos os textos.

   🔴 A coluna tem `65ch` e não é arbitrário: é a medida em que a linha de
   texto longo cansa menos o olho. Largura de coluna é a única decisão de
   leitura que um blog realmente tem para tomar. */

const COMPONENTES = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mt-6 text-lg leading-relaxed text-tinta-700">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-14 text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-10 font-display text-xl font-semibold text-tinta-800">{children}</h3>
    ),
    /* A citação usa o fio de terracota à esquerda, que é o mesmo recurso do
       painel de aviso da página de avaliação: um elemento de marca, não uma
       decoração nova. */
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="mt-10 border-l-4 border-terracota-600 pl-6 font-display text-xl leading-relaxed font-semibold text-tinta-800">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mt-6 list-disc space-y-2 pl-6 text-lg leading-relaxed text-tinta-700 marker:text-terracota-600">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mt-6 list-decimal space-y-2 pl-6 text-lg leading-relaxed text-tinta-700 marker:text-bronze-500">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <b className="font-semibold text-tinta-800">{children}</b>
    ),
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: { href?: string };
    }) => {
      const href = value?.href ?? "#";
      /* Link para fora leva `noreferrer`, e para dentro não abre aba nova:
         abrir aba para o próprio site é o tique que faz a pessoa perder o
         botão de voltar. */
      const fora = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(fora ? { target: "_blank", rel: "noreferrer" } : {})}
          className="font-semibold text-terracota-600 underline underline-offset-4 transition-colors hover:text-terracota-700"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({
      value,
    }: {
      value: { alt?: string; legenda?: string };
    }) => {
      /* 🔴 Largura de 1600 e não a original: foto de celular tem 4000px de
         largura e três megabytes, e o texto seria lido no telefone de quem
         está dentro do ônibus. A Sanity redimensiona e converte o formato na
         entrega, então a origem pode ser pesada sem custo para quem lê. */
      const url = imagem(value as never, 1600, 1000);
      if (!url) return null;
      return (
        <figure className="mt-12">
          <div className="relative aspect-16/10 overflow-hidden rounded-[0.875rem] shadow-[var(--shadow-flutua-2)]">
            <Image
              src={url}
              alt={value.alt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 65ch"
              className="object-cover"
            />
          </div>
          {value.legenda && (
            <figcaption className="mt-3 text-sm text-tinta-500">{value.legenda}</figcaption>
          )}
        </figure>
      );
    },
  },
};

export function CorpoArtigo({ blocos }: { blocos: PortableTextBlock[] }) {
  return (
    <div className="max-w-[65ch]">
      <PortableText value={blocos} components={COMPONENTES} />
    </div>
  );
}
