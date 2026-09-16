import Link from "next/link";
import { type StaticImageData } from "next/image";
import { ChevronRight } from "lucide-react";
import { Midia } from "@/components/midia";
import { VideoFundo } from "@/components/video-fundo";
import type { NomeCena } from "@/components/cenas";

/* Cabeça das páginas internas: ilha escura dentro do trilho, em vez de faixa
   colada nas bordas. O fundo dela pode ser três coisas, e é só isso que muda
   de uma página para outra: nada, a ilustração da marca, ou vídeo. */
export function CabecaPagina({
  titulo,
  linha,
  trilha,
  /* Com `cena`, a ilha VIRA a ilustração da marca: nome dentro dela, como
     na ficha do imóvel. Sem nada, fica a ilha lisa. */
  cena,
  semente,
  foto,
  /* Com `video`, a ilha vira o filme. Mesma ilha, mesmo véu, mesmo texto por
     cima: o vídeo entra no lugar da ilustração e nada mais se mexe. */
  video,
  /* Manchete com três números é a abertura de uma das referências que ela
     mandou, e serve onde a ilha lisa estava só com título e uma linha.
     🔴 Só número DERIVADO entra aqui: "4.500 clientes satisfeitos" é o
     tipo de fato que enche essas telas e que aqui seria invento. */
  fatos,
}: {
  titulo: string;
  linha: string;
  trilha: { href?: string; texto: string }[];
  cena?: NomeCena;
  semente?: string;
  foto?: string;
  video?: { fonte: string; poster: StaticImageData; posicao?: string };
  fatos?: { valor: string; rotulo: string }[];
}) {
  return (
    <div className="trilho" style={{ paddingTop: "calc(var(--altura-topo) + 1.75rem)" }}>
      <div
        className={`ilha relative isolate overflow-hidden text-papel ${
          cena || video
            ? "flex min-h-[22rem] flex-col justify-between shadow-[var(--shadow-flutua-3)] sm:min-h-[26rem]"
            : "bg-tinta-800"
        }`}
      >
        {video && (
          <div aria-hidden className="absolute inset-0 -z-20">
            <VideoFundo
              fonte={video.fonte}
              poster={video.poster}
              posicao={video.posicao}
              prioridade
              sizes="100vw"
            />
          </div>
        )}
        {cena && (
          <div aria-hidden className="absolute inset-0 -z-20">
            <Midia
              foto={foto}
              cena={cena}
              semente={semente}
              ancora="base"
              panorama
              rotulo={`Ilustração da marca: ${titulo}`}
              sizes="100vw"
              prioridade
            />
          </div>
        )}
        {/* Véu em gradiente, não desfoque: o custo do desfoque em peça desse
            tamanho já cobrou caro uma vez.
            🔴 Era `rgba(9,22,42,·)`, o azul da marca velha, e ficou para trás
            na troca de identidade: ele lavava de frio uma cena que agora é
            toda areia e tinta. */}
        {(cena || video) && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,9,.94) 8%, rgba(10,10,9,.68) 52%, rgba(10,10,9,.34) 100%)",
            }}
          />
        )}
        {!cena && !video && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(42% 65% at 88% 12%, rgba(221,203,170,.22), transparent 70%), radial-gradient(46% 70% at 6% 95%, rgba(154,135,99,.26), transparent 72%)",
            }}
          />
        )}
        <nav aria-label="Você está aqui" className="mb-7 flex flex-wrap items-center gap-2 text-sm">
          {trilha.map((t, i) => (
            <span key={t.texto} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="size-3.5 text-tinta-300" aria-hidden />}
              {t.href ? (
                <Link href={t.href} className="text-tinta-200 transition-colors hover:text-papel">
                  {t.texto}
                </Link>
              ) : (
                <span aria-current="page" className="text-papel">
                  {t.texto}
                </span>
              )}
            </span>
          ))}
        </nav>
        {/* Sobre imagem, a linha fica EMBAIXO do título, na mesma coluna: à
            direita ela cai na parte clara da ilustração, onde o véu é mais
            fraco, e perde contraste. */}
        <div
          className={
            cena || video
              ? "max-w-[42rem]"
              : "grid items-end gap-6 lg:grid-cols-[1fr_26rem]"
          }
        >
          <h1 className="text-[clamp(2.2rem,4.6vw,3.4rem)] text-papel">{titulo}</h1>
          <p className={`text-lg text-tinta-200 ${cena || video ? "mt-3" : ""}`}>{linha}</p>
        </div>
        {fatos && fatos.length > 0 && (
          <dl className="mt-9 grid max-w-2xl grid-cols-3 gap-5 border-t border-white/18 pt-6">
            {fatos.map((f) => (
              <div key={f.rotulo}>
                <dt className="num text-2xl font-semibold text-papel sm:text-3xl">
                  {f.valor}
                </dt>
                <dd className="rotulo mt-1 text-tinta-200">{f.rotulo}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
