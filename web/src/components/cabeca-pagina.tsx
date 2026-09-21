import Link from "next/link";
import { type StaticImageData } from "next/image";
import { ChevronRight } from "lucide-react";
import { Midia } from "@/components/midia";
import { VideoFundo } from "@/components/video-fundo";
import type { NomeCena } from "@/components/cenas";

export function CabecaPagina({
  titulo,
  linha,
  trilha,
  cena,
  semente,
  foto,
  video,
}: {
  titulo: string;
  linha: string;
  trilha: { href?: string; texto: string }[];
  cena?: NomeCena;
  semente?: string;
  foto?: string;
  video?: { fonte: string; poster: StaticImageData; posicao?: string };
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
        <nav
          aria-label="Você está aqui"
          className="mb-7 flex flex-wrap items-center gap-2 text-sm"
        >
          {trilha.map((t, i) => (
            <span key={t.texto} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="size-3.5 text-tinta-300" aria-hidden />}
              {t.href ? (
                <Link
                  href={t.href}
                  className="text-tinta-200 transition-colors hover:text-papel"
                >
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
        <div
          className={
            cena || video
              ? "max-w-[42rem]"
              : "grid items-end gap-6 lg:grid-cols-[1fr_26rem]"
          }
        >
          <h1 className="text-[clamp(2.2rem,4.6vw,3.4rem)] text-papel">{titulo}</h1>
          <p className={`text-lg text-tinta-200 ${cena || video ? "mt-3" : ""}`}>
            {linha}
          </p>
        </div>
      </div>
    </div>
  );
}
