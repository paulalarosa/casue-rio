import Link from "next/link";
import { MessageCircle, Mail, MapPin, AtSign } from "lucide-react";
import { Assinatura } from "@/components/assinatura";
import { AcaoEmail, AcaoZap } from "@/components/acao";
import {
  ENDERECO,
  SOCIAS,
  SLOGAN,
  TEM_EMAIL,
  INSTAGRAM,
  INSTAGRAM_URL,
} from "@/lib/site";

export function Rodape() {
  return (
    <footer className="relative overflow-hidden bg-tinta-800 text-papel">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(50% 60% at 12% 0%, rgba(221,203,170,.14), transparent 70%), radial-gradient(46% 60% at 88% 10%, rgba(154,135,99,.2), transparent 72%)",
        }}
      />
      <div className="trilho relative grid gap-12 py-20 md:grid-cols-[1.5fr_1fr_1.2fr]">
        <div>
          <Assinatura
            className="text-[2.1rem]"
            cores={{
              nome: "text-papel",
              lugar: "text-areia-400",
              categoria: "text-areia-300",
            }}
          />
          <p className="mt-8 font-display text-2xl font-semibold text-papel">{SLOGAN}</p>
          <p className="mt-4 max-w-[32ch] text-tinta-200">
            Centro, Tijuca e Zona Sul. Das 9h às 19h, de segunda a sexta.
          </p>
        </div>

        <nav aria-label="Navegar">
          <h3 className="rotulo mb-5 text-areia-300">Navegar</h3>
          <ul className="space-y-1 text-tinta-200">
            {[
              ["/imoveis", "Imóveis"],
              ["/avaliacao", "Avaliação"],
              ["/quem-somos", "Quem somos"],
              ["/revista", "Revista"],
            ].map(([href, texto]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex min-h-11 items-center transition-colors hover:text-papel md:min-h-8"
                >
                  {texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="rotulo mb-5 text-areia-300">Falar</h3>
          <ul className="space-y-1 text-tinta-200">
            <li>
              <AcaoZap
                recuo="/contato/"
                className="flex min-h-11 items-center gap-2 transition-colors hover:text-papel md:min-h-8"
              >
                <MessageCircle className="size-4" aria-hidden /> WhatsApp
              </AcaoZap>
            </li>
            {TEM_EMAIL && (
              <li>
                <AcaoEmail
                  recuo="/contato/"
                  className="flex min-h-11 items-center gap-2 transition-colors hover:text-papel md:min-h-8"
                >
                  <Mail className="size-4 shrink-0" aria-hidden /> Escrever por e-mail
                </AcaoEmail>
              </li>
            )}
            {INSTAGRAM && (
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center gap-2 transition-colors hover:text-papel md:min-h-8"
                >
                  <AtSign className="size-4 shrink-0" aria-hidden /> {INSTAGRAM}
                </a>
              </li>
            )}
            <li className="flex gap-2 pt-2 text-sm leading-relaxed">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <address className="not-italic">
                {ENDERECO.rua}
                <br />
                {ENDERECO.complemento} · {ENDERECO.bairro}
                <br />
                {ENDERECO.cidade}/{ENDERECO.estado} · {ENDERECO.cep}
              </address>
            </li>
          </ul>
        </div>
      </div>

      <div className="trilho relative flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-white/12 py-7 text-sm text-tinta-200">
        <span className="num">{SOCIAS.map((s) => s.creci).join(" · ")}</span>
        <Link
          href="/privacidade"
          className="inline-flex min-h-11 items-center underline underline-offset-4 transition-colors hover:text-papel md:min-h-0"
        >
          Privacidade
        </Link>
      </div>
    </footer>
  );
}
