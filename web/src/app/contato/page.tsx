import { AtSign, Mail, MapPin, MessageCircle } from "lucide-react";
import { AcaoEmail, AcaoZap } from "@/components/acao";
import Link from "next/link";
import { CabecaPagina } from "@/components/cabeca-pagina";
import calcadao from "../../../public/video/calcadao.webp";
import { Painel } from "@/components/painel";
import { Midia } from "@/components/midia";
import { FormContato } from "@/components/form-contato";
import {
  ENDERECO,
  mapaDoEndereco,
  HORARIO,
  TELEFONE,
  TEM_EMAIL,
  INSTAGRAM,
  INSTAGRAM_URL,
  metaDaPagina,
  QUEM_SOMOS_NO_AR,
} from "@/lib/site";
import { arquivo } from "@/lib/caminho";

export const metadata = metaDaPagina({
  titulo: "Falar com a gente",
  descricao:
    "Fale direto com quem cuida do seu imóvel, no canal único da Casuê Rio. Das 9h às 19h, de segunda a sexta, no Centro do Rio.",
  caminho: "/contato",
});

export default function PaginaContato() {
  return (
    <>
      <CabecaPagina
        titulo="Falar com a gente"
        linha="Você fala direto com quem cuida do seu imóvel. Sem atendente e sem fila."
        video={{ fonte: arquivo("/video/calcadao.mp4"), poster: calcadao }}
        trilha={[{ href: "/", texto: "Início" }, { texto: "Contato" }]}
      />

      <div className="campo-luz trilho relative mt-10">
        <Painel
          variante="claro"
          className="borda-viva grid gap-8 p-8 sm:p-10 md:grid-cols-[1.2fr_1fr] md:items-start"
        >
          <div>
            <h2 className="font-display text-2xl">Um canal só</h2>
            {TELEFONE ? (
              <>
                <p className="mt-3 text-tinta-500">
                  Mesmo número para compra, venda, aluguel e avaliação.
                </p>
                <AcaoZap className="mt-6 flex w-fit items-center gap-2 rounded-full bg-terracota-600 px-7 py-3.5 font-semibold text-papel shadow-[var(--shadow-flutua-1)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-terracota-700">
                  <MessageCircle className="size-5" aria-hidden /> Falar no WhatsApp
                </AcaoZap>
              </>
            ) : (
              <p className="mt-3 max-w-[52ch] text-tinta-500">
                O número único da Casuê Rio está sendo definido. Até ele entrar no ar, o
                e-mail ao lado e o formulário abaixo chegam a quem atende.
              </p>
            )}
            <p className="mt-6 flex items-center gap-2 text-sm text-tinta-500">
              <span className="size-2 rounded-full bg-terracota-600" aria-hidden />
              {HORARIO}
            </p>
          </div>

          <ul className="space-y-3 md:border-l md:border-tinta-800/10 md:pl-8">
            {TEM_EMAIL && (
              <li>
                <AcaoEmail className="flex w-full items-center gap-3 rounded-[0.75rem] border border-tinta-800/10 bg-tinta-50 px-4 py-3 text-left transition-colors hover:bg-tinta-800/6">
                  <Mail className="size-4 shrink-0 text-bronze-500" aria-hidden />
                  <span>
                    <span className="rotulo block text-tinta-500">E-mail</span>
                    <span className="block font-semibold text-tinta-800">
                      Abrir o aplicativo de e-mail
                    </span>
                  </span>
                </AcaoEmail>
              </li>
            )}
            {INSTAGRAM && (
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-[0.75rem] border border-tinta-800/10 bg-tinta-50 px-4 py-3 transition-colors hover:bg-tinta-800/6"
                >
                  <AtSign className="size-4 shrink-0 text-bronze-500" aria-hidden />
                  <span>
                    <span className="rotulo block text-tinta-500">Instagram</span>
                    <span className="block font-semibold text-tinta-800">
                      {INSTAGRAM}
                    </span>
                  </span>
                </a>
              </li>
            )}
          </ul>
        </Painel>
      </div>

      <div className="trilho secao grid gap-12 pb-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <div>
          <h2 className="text-3xl">Ou deixe recado</h2>
          <p className="mt-3 mb-10 text-lg text-tinta-500">
            {TELEFONE
              ? "O WhatsApp é mais rápido. O formulário é para quem não usa."
              : "Enquanto o WhatsApp da empresa não entra no ar, é por aqui e pelo e-mail. Chega às duas, e a resposta sai no mesmo dia."}
          </p>
          <FormContato />
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[0.875rem] p-7 shadow-[var(--shadow-flutua-3)]">
            <div aria-hidden className="absolute inset-0 -z-20">
              <Midia
                cena="predio"
                semente="escritorio-centro"
                rotulo="Ilustração da marca: o escritório no Centro"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,9,.92) 12%, rgba(10,10,9,.5) 52%, rgba(10,10,9,.1) 100%)",
              }}
            />
            <span className="rotulo text-areia-300">Onde ficamos</span>
            <address className="mt-2 not-italic text-[1.15rem] leading-relaxed text-papel">
              {ENDERECO.rua}
              <br />
              {ENDERECO.complemento} · {ENDERECO.bairro}
              <br />
              {ENDERECO.cidade}/{ENDERECO.estado} · {ENDERECO.cep}
            </address>
            <a
              href={mapaDoEndereco()}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-papel/12 px-5 text-sm font-semibold text-papel transition-colors hover:bg-papel/20"
            >
              <MapPin className="size-4 shrink-0" aria-hidden />
              Abrir no mapa
            </a>
          </div>
          {QUEM_SOMOS_NO_AR && (
            <p className="mt-4 text-sm text-tinta-500">
              Quem assina os contratos e o que cada registro autoriza está em{" "}
              <Link
                href="/quem-somos"
                className="font-semibold text-terracota-600 underline underline-offset-4 transition-colors hover:text-terracota-700"
              >
                Quem somos
              </Link>
              .
            </p>
          )}
        </aside>
      </div>
    </>
  );
}
