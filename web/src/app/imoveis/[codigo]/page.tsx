import { notFound } from "next/navigation";
import { Dados } from "@/components/dados";
import Link from "next/link";
import { MessageCircle, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { Galeria } from "@/components/galeria";
import { Compartilhar } from "@/components/compartilhar";
import { CartaoImovel } from "@/components/cartao-imovel";
import { Painel } from "@/components/painel";
import { IMOVEIS, DISPONIVEIS, BAIRROS, moeda } from "@/lib/imoveis";
import { AcaoZap } from "@/components/acao";
import { SITE, NOME, metaDaPagina } from "@/lib/site";

export function generateStaticParams() {
  return IMOVEIS.map((im) => ({ codigo: im.codigo }));
}

export async function generateMetadata({ params }: PageProps<"/imoveis/[codigo]">) {
  const { codigo } = await params;
  const im = IMOVEIS.find((x) => x.codigo === codigo);
  if (!im) return { title: "Imóvel" };
  const meta = metaDaPagina({
    titulo: `${im.titulo} · ${im.bairro}`,
    descricao: im.resumo,
    caminho: `/imoveis/${im.codigo}`,
  });
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      images: [
        {
          url: `/imoveis/${im.codigo}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: `${im.titulo}, ${im.bairro}`,
        },
      ],
    },
  };
}

const CONFERIDO = [
  "Matrícula atualizada, com a cadeia de proprietários",
  "Ônus, penhora e ação contra o vendedor",
  "Dívida de condomínio e obra em rateio",
  "IPTU e taxas em aberto",
  "Regularidade da planta na Prefeitura",
];

function Item({
  rotulo,
  valor,
  grande,
  fio,
}: {
  rotulo: string;
  valor: string | number | null;
  grande?: boolean;
  fio?: boolean;
}) {
  const vazio = valor === null || valor === undefined || valor === "";
  return (
    <div
      className={`flex flex-col gap-1 ${
        fio ? "sm:border-l sm:border-tinta-800/10 sm:pl-6" : ""
      }`}
    >
      <dt className="rotulo text-tinta-500">{rotulo}</dt>
      <dd
        className={`num ${grande ? "text-2xl font-semibold" : ""} ${
          vazio ? "text-tinta-500" : "text-tinta-800"
        }`}
      >
        {vazio ? "—" : valor}
      </dd>
    </div>
  );
}

export default async function PaginaImovel({ params }: PageProps<"/imoveis/[codigo]">) {
  const { codigo } = await params;
  const im = IMOVEIS.find((x) => x.codigo === codigo);
  if (!im) notFound();
  const parecidos = DISPONIVEIS.filter(
    (x) => x.regiao === im.regiao && x.codigo !== im.codigo,
  ).slice(0, 3);
  const bairro = BAIRROS.find((b) => b.chave === im.regiao);

  const dados = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: im.titulo,
    description: im.resumo,
    url: `${SITE}/imoveis/${im.codigo}`,
    numberOfRooms: im.quartos || undefined,
    numberOfBathroomsTotal: im.banheiros || undefined,
    floorSize: { "@type": "QuantitativeValue", value: im.area, unitCode: "MTK" },
    address: {
      "@type": "PostalAddress",
      addressLocality: im.bairro,
      addressRegion: "RJ",
      addressCountry: "BR",
    },
    offers: {
      "@type": "Offer",
      price: im.preco,
      priceCurrency: "BRL",
      availability: im.fechado
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      seller: { "@type": "RealEstateAgent", name: NOME },
    },
  };

  return (
    <>
      <Dados>{dados}</Dados>
      <Galeria
        im={im}
        capa={
          <>
            <div className="flex flex-wrap items-center gap-2">
              {im.fechado && (
                <span className="tinta rotulo rounded-full px-3 py-1.5">Vendido</span>
              )}
              {im.selos.map((s) => (
                <span key={s} className="tinta rotulo rounded-full px-3 py-1.5">
                  {s}
                </span>
              ))}
            </div>
            <div className="max-w-[46rem]">
              <span className="rotulo text-areia-300">
                {im.bairro}
                {im.bairro !== im.regiao ? ` · ${im.regiao}` : ""} · {im.codigo}
              </span>
              <h1 className="mt-2 font-display text-[clamp(1.7rem,4vw,3.1rem)] leading-[1.05] text-papel">
                {im.titulo}
              </h1>
              <span className="num mt-3 block font-display text-2xl font-bold text-papel sm:text-3xl">
                {moeda(im.preco)}
                {im.porMes && <span className="text-lg"> / mês</span>}
              </span>
            </div>
          </>
        }
      />

      <dl className="trilho mt-10 grid grid-cols-2 gap-y-8 border-y border-tinta-800/12 py-8 sm:grid-cols-3 lg:grid-cols-6">
        {(
          [
            ["Área útil", `${im.area} m²`],
            ["Quartos", im.quartos || null],
            ["Suítes", im.suites || null],
            ["Banheiros", im.banheiros || null],
            ["Vagas", im.vagas || null],
            ["Andar", im.andar],
          ] as const
        ).map(([rotulo, valor], i) => (
          <Item key={rotulo} rotulo={rotulo} valor={valor} grande fio={i > 0} />
        ))}
      </dl>

      <div className="trilho secao grid items-start gap-12 lg:grid-cols-[1.55fr_1fr]">
        <div>
          <p className="max-w-[62ch] text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed text-tinta-500">
            {im.resumo}
          </p>

          <h2 className="mt-14 text-2xl">O que a gente confere antes da proposta</h2>
          <ul className="mt-7 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {CONFERIDO.map((linha) => (
              <li key={linha} className="flex gap-3 border-t border-tinta-800/10 pt-4">
                <Check className="mt-0.5 size-4 shrink-0 text-bronze-500" aria-hidden />
                <span className="text-tinta-500">{linha}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[58ch] text-sm text-tinta-500">
            O resultado sai por escrito, antes de qualquer sinal. Se aparecer
            pendência, você fica sabendo antes de decidir.
          </p>

          {bairro && (
            <>
              <h2 className="mt-14 text-2xl">Sobre o {bairro.nome}</h2>
              <p className="mt-5 max-w-[62ch] text-tinta-500">{bairro.texto}</p>
              <Link
                href={`/bairros/${encodeURIComponent(bairro.chave)}/`}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-tinta-800/20 px-5 py-2.5 text-sm font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
              >
                Ver o {bairro.nome} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </>
          )}
        </div>

        <Painel className="sticky top-28 p-8">
          <span className="font-display text-4xl font-bold text-tinta-800">
            {moeda(im.preco)}
            {im.porMes && <span className="text-lg"> / mês</span>}
          </span>
          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-baseline gap-2">
              <dt className="text-tinta-500">Condomínio</dt>
              <dd className="num text-tinta-600">{moeda(im.condominio || null)}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-tinta-500">IPTU</dt>
              <dd className="num text-tinta-600">{moeda(im.iptu)}</dd>
            </div>
          </dl>

          <AcaoZap
            im={im}
            recuo="/contato/"
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-tinta-800 px-6 py-4 font-semibold text-papel shadow-[var(--shadow-flutua-2)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <MessageCircle className="size-5" aria-hidden /> Falar sobre este imóvel
          </AcaoZap>
          <p className="mt-3 flex items-center gap-2 text-sm text-tinta-500">
            <span className="size-2 rounded-full bg-[#1F6B4A]" aria-hidden />
            Resposta em minutos, das 9h às 19h.
          </p>

          <Compartilhar titulo={`${im.titulo} · ${im.bairro}`} />

          <p className="num mt-6 text-sm text-tinta-500">
            Código {im.codigo}
            {im.ano ? ` · Ano ${im.ano}` : ""}
          </p>

          <div className="mt-7 flex gap-3 rounded-[0.75rem] border-l-4 border-l-tinta-400 bg-tinta-50 p-5 text-sm">
            <ShieldCheck className="size-5 shrink-0 text-tinta-800" aria-hidden />
            <span>
              <b className="block text-tinta-800">
                Condomínio e IPTU informados pelo proprietário.
              </b>
              A gente confere na documentação antes da proposta.
            </span>
          </div>
        </Painel>
      </div>

      {parecidos.length > 0 && (
        <div className="trilho pb-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl">Também em {im.regiao}</h2>
            <Link
              href={`/imoveis?regiao=${encodeURIComponent(im.regiao)}`}
              className="inline-flex items-center gap-2 rounded-full border border-tinta-800/15 px-5 py-2.5 text-sm font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
            >
              Ver todos <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div
            className={
              parecidos.length >= 3
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                : parecidos.length === 2
                  ? "grid gap-6 sm:grid-cols-2"
                  : "grid max-w-md gap-6"
            }
          >
            {parecidos.map((p) => (
              <CartaoImovel key={p.codigo} im={p} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
