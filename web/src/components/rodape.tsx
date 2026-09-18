import Link from "next/link";
import { MessageCircle, Mail, MapPin, AtSign } from "lucide-react";
import { Assinatura } from "@/components/assinatura";
import { AcaoEmail, AcaoZap } from "@/components/acao";
import {
  ENDERECO,
  SOCIAS,
  SLOGAN,
  NOME,
  TEM_EMAIL,
  INSTAGRAM,
  INSTAGRAM_URL,
} from "@/lib/site";

export function Rodape() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-tinta-800 text-papel">
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
          <ul className="space-y-2 text-tinta-200">
            {[
              ["/imoveis", "Imóveis"],
              ["/bairros", "Bairros"],
              ["/avaliacao", "Avaliação"],
              ["/quem-somos", "Quem somos"],
              ["/revista", "Revista"],
            ].map(([href, texto]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-papel">
                  {texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="rotulo mb-5 text-areia-300">Falar</h3>
          <ul className="space-y-2 text-tinta-200">
            <li>
              <AcaoZap
                recuo="/contato/"
                className="flex items-center gap-2 transition-colors hover:text-papel"
              >
                <MessageCircle className="size-4" aria-hidden /> WhatsApp
              </AcaoZap>
            </li>
            {TEM_EMAIL && (
              <li>
                <AcaoEmail
                  recuo="/contato/"
                  className="flex items-center gap-2 transition-colors hover:text-papel"
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
                  className="flex items-center gap-2 transition-colors hover:text-papel"
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

      <div className="trilho relative flex flex-wrap gap-x-8 gap-y-3 border-t border-white/12 py-7 text-sm text-tinta-200">
        <span>{NOME} · Rio de Janeiro</span>
        <span className="num">{SOCIAS.map((s) => s.creci).join(" · ")}</span>
        <Link
          href="/privacidade"
          className="underline underline-offset-4 transition-colors hover:text-papel"
        >
          Privacidade
        </Link>
        <span>Protótipo de layout. Imóveis, preços e imagens são exemplos.</span>
      </div>
    </footer>
  );
}
