import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { CorpoArtigo } from "@/components/corpo-artigo";
import { listarArtigos, lerArtigo, dataPorExtenso } from "@/lib/revista";
import { imagem } from "@/lib/sanity";
import { Dados } from "@/components/dados";
import { artigo as dadosDoArtigo, trilha, grafo } from "@/lib/dados-estruturados";
import { metaDaPagina } from "@/lib/site";

/* A página de um artigo.

   🔴 ESTA PASTA COMEÇA COM UNDERSCORE, e por isso o Next NÃO a trata como
   rota. É de propósito, e eu descobri o motivo quebrando o build:

     Error: Page "/revista/[slug]" returned an empty array from
     "generateStaticParams()". With "output: export", at least one route
     must be generated.

   Eu tinha suposto que devolver lista vazia deixaria a rota simplesmente não
   existir. Não deixa: em exportação estática isso é erro duro, sem escape.
   Ou seja, este arquivo não pode morar em `[slug]/` enquanto não houver
   nenhum artigo publicado, porque hoje ele derrubaria toda publicação do
   site por causa de uma página que ninguém pediu.

   🔴 QUEM LIGA E DESLIGA É `scripts/preparar-revista.mjs`, que roda antes
   de todo build e copia esta pasta para `[slug]/` quando há artigo com a
   hora vencida, apagando-a quando não há.

   Aqui morava a instrução de fazer isso À MÃO, com um `mv`. Estava errada
   como automação: dependia de alguém lembrar, num dia em que essa pessoa
   não estaria por perto, e o preço de esquecer era o site inteiro parar de
   publicar. Instrução que depende de memória humana não é automação, é uma
   armadilha com manual.

   As peças de Instagram vivem aqui dentro pelo mesmo motivo: `cartao/` e
   `citacao/` ligam e desligam junto com o artigo, sem uma segunda regra. */
export async function generateStaticParams() {
  const artigos = await listarArtigos();
  return artigos.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artigo = await lerArtigo(slug);
  if (!artigo) return {};
  return metaDaPagina({
    titulo: artigo.titulo,
    descricao: artigo.linha,
    caminho: `/revista/${slug}`,
  });
}

export default async function PaginaArtigo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artigo = await lerArtigo(slug);
  if (!artigo) notFound();

  const capa = artigo.capa ? imagem(artigo.capa, 1800, 1000) : null;

  return (
    <article className="trilho" style={{ paddingTop: "calc(var(--altura-topo) + 1.75rem)" }}>
      {/* 🔴 O artigo aponta para a AUTORA por `@id`, e a autora é declarada
          uma vez no layout com CRECI e CNAI. É essa cadeia que separa "um
          texto sobre ITBI na internet" de "uma corretora registrada
          escreveu sobre ITBI", que é a diferença entre ser parafraseado e
          ser citado pelo nome. */}
      <Dados>
        {grafo(
          dadosDoArtigo(artigo, capa),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Revista", caminho: "/revista/" },
            { nome: artigo.titulo, caminho: `/revista/${slug}/` },
          ]),
        )}
      </Dados>
      <nav aria-label="Trilha" className="text-sm text-tinta-500">
        <Link href="/revista" className="inline-flex items-center gap-2 transition-colors hover:text-tinta-800">
          <ArrowLeft className="size-4" aria-hidden />
          Revista
        </Link>
      </nav>

      <header className="mt-8 max-w-[22ch] sm:max-w-[26ch]">
        <h1 className="text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05]">{artigo.titulo}</h1>
      </header>
      <p className="mt-6 max-w-[55ch] text-xl leading-relaxed text-tinta-500">
        {artigo.linha}
      </p>
      {/* Quem escreveu e quando, na mesma linha e em rótulo: é dado, não
          texto, e é o que dá a um texto de imobiliária o peso de ter dono. */}
      <p className="rotulo mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-bronze-500">
        <span>{artigo.autora}</span>
        <span aria-hidden className="text-tinta-300">·</span>
        <time dateTime={artigo.data} className="num">
          {dataPorExtenso(artigo.data)}
        </time>
      </p>

      {capa && (
        <div className="relative mt-12 aspect-16/9 overflow-hidden rounded-[1rem] shadow-[var(--shadow-flutua-3)]">
          <Image
            src={capa}
            alt={artigo.capa?.alt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="secao pt-12">
        {artigo.corpo && <CorpoArtigo blocos={artigo.corpo} />}
      </div>

      <div className="ilha relative isolate mb-8 overflow-hidden bg-tinta-800 text-papel">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="max-w-[22ch] text-[clamp(1.6rem,3vw,2.3rem)] text-papel">
              Tem um caso parecido com esse?
            </h2>
            <p className="mt-4 max-w-[46ch] text-tinta-200">
              Conte o seu. A resposta chega no mesmo dia, com o que dá para fazer
              e com o que não dá.
            </p>
          </div>
          <Link
            href="/contato"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-terracota-600 px-7 py-4 font-semibold text-papel shadow-[var(--shadow-flutua-2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-terracota-700"
          >
            <MessageCircle className="size-5" aria-hidden />
            Falar com a gente
          </Link>
        </div>
      </div>
    </article>
  );
}
