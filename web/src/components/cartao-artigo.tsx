import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { dataPorExtenso, type Artigo } from "@/lib/revista";
import { imagem } from "@/lib/sanity";

function Assinaturas({ materia }: { materia: Artigo }) {
  return (
    <span className="rotulo flex flex-wrap items-center gap-x-2 text-bronze-500">
      <time dateTime={materia.data} className="num">
        {dataPorExtenso(materia.data)}
      </time>
      <span aria-hidden className="text-tinta-300">
        ·
      </span>
      <span>{materia.autora}</span>
    </span>
  );
}

export function CartaoArtigo({ materia }: { materia: Artigo }) {
  const capa = materia.capa ? imagem(materia.capa, 800, 500) : null;

  return (
    <Link href={`/revista/${materia.slug}/`} data-revela className="group flex flex-col">
      {capa && (
        <div className="relative mb-5 aspect-16/10 overflow-hidden rounded-[0.875rem] shadow-[var(--shadow-flutua-1)]">
          <Image
            src={capa}
            alt={materia.capa?.alt ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-saida)] group-hover:scale-105"
          />
        </div>
      )}
      <div className="border-t border-tinta-800/15 pt-5 transition-colors group-hover:border-terracota-600">
        <Assinaturas materia={materia} />
        <h2 className="mt-3 font-display text-2xl leading-tight text-tinta-800">
          {materia.titulo}
        </h2>
        <p className="mt-3 text-tinta-500">{materia.linha}</p>
      </div>
    </Link>
  );
}

export function DestaqueArtigo({ materia }: { materia: Artigo }) {
  const capa = materia.capa ? imagem(materia.capa, 1400, 1050) : null;

  return (
    <Link
      href={`/revista/${materia.slug}/`}
      data-revela
      className="group grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14"
    >
      {capa && (
        <div className="relative aspect-4/3 overflow-hidden rounded-[1rem] shadow-[var(--shadow-flutua-3)]">
          <Image
            src={capa}
            alt={materia.capa?.alt ?? ""}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-saida)] group-hover:scale-105"
          />
        </div>
      )}
      <div>
        <Assinaturas materia={materia} />
        <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(1.75rem,3.2vw,2.6rem)] leading-[1.1] text-tinta-800">
          {materia.titulo}
        </h2>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-tinta-500">
          {materia.linha}
        </p>
        <span className="mt-7 inline-flex items-center gap-2 font-semibold text-terracota-600">
          Ler a matéria
          <ArrowRight
            className="size-4 transition-transform duration-300 ease-[var(--ease-saida)] group-hover:translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
