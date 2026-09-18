import Link from "next/link";
/* O lucide tirou as marcas do pacote, entao o Instagram entra pelo
   arroba: e sinal de perfil e nao finge ser o logo de terceiro. */
import { MessageCircle, Mail, MapPin, AtSign } from "lucide-react";
import { Assinatura } from "@/components/assinatura";
import { AcaoEmail } from "@/components/acao";
import {
  ENDERECO,
  SOCIAS,
  SLOGAN,
  NOME,
  TEM_EMAIL,
  INSTAGRAM,
  INSTAGRAM_URL,
} from "@/lib/site";

/* 🔴 O rodapé NÃO tem vídeo, e isso é decisão medida, não esquecimento.
   Eu cheguei a pôr o horizonte aqui a 40% de opacidade. Depois desenhei o
   quadro do vídeo num canvas e medi o composto: na média o papel dava
   5,62:1, mas na FAIXA CLARA do céu, que é por onde o texto passa, caía
   para 2,86:1, e o rótulo em areia para 2,23:1. Para o pior caso passar em
   4,5:1 o véu teria de cobrir 65% do vídeo, e aí não sobra vídeo.

   A raiz é simples: rodapé é onde mora texto pequeno em quantidade, e
   texto pequeno sobre imagem com faixa clara não tem conserto barato. */
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
          {/* Montagem 03 · horizontal com descritivo. É o único lugar do site
              onde "Negócios Imobiliários" aparece por extenso e sempre, e é
              de propósito: aqui há largura para a caixa alta espaçada, que é
              o que a barra do topo só tem acima de `lg`. */}
          <Assinatura
            className="text-[2.1rem]"
            cores={{
              nome: "text-papel",
              lugar: "text-areia-400",
              /* Sem acento: a placa ao lado já é a cor da marca. */
              categoria: "text-areia-300",
            }}
          />
          <p className="mt-8 font-display text-2xl font-semibold text-papel">
            {SLOGAN}
          </p>
          <p className="mt-4 max-w-[32ch] text-tinta-200">
            Centro, Tijuca e Zona Sul. Das 9h às 19h, de segunda a sexta.
          </p>
        </div>

        <nav aria-label="Navegar">
          <h3 className="rotulo mb-5 text-areia-300">Navegar</h3>
          <ul className="space-y-2 text-tinta-200">
            {/* Os bairros saíram do menu do topo por redundância com
                "Imóveis", e caíram AQUI, que é o lugar de quem já sabe o que
                procura. As páginas continuam existindo e indexadas. */}
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
          {/* 🔴 Canal ÚNICO da empresa, e não um por sócia: foi decisão
              delas. Por isso aqui não há duas colunas de contato, e nenhum
              botão do site chama uma sócia pelo nome. */}
          <ul className="space-y-2 text-tinta-200">
            <li>
              <Link href="/contato" className="flex items-center gap-2 transition-colors hover:text-papel">
                <MessageCircle className="size-4" aria-hidden /> WhatsApp
              </Link>
            </li>
            {TEM_EMAIL && (
              <li>
                {/* 🔴 O endereço NÃO é escrito, e o elemento continua sendo um
                    link para a página de contato: quem abrir em aba nova, ou
                    estiver sem script, cai num lugar útil em vez de em nada.
                    O aplicativo de e-mail abre no clique, e o endereço só é
                    montado nesse instante. */}
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
        {/* 🔴 O registro profissional virou UMA LINHA, aqui, e some do resto
            do site. Ele estava em quatro pastilhas no rodapé, mais na home,
            mais na página das sócias: o mesmo número repetido em todo canto
            deixa de ser credencial e vira ruído. O lugar de explicar o que
            é CRECI e o que é CNAI é /quem-somos, e é lá que eles aparecem
            com nome e função ao lado. Aqui fica só a prova, curta. */}
        <span className="num">
          {SOCIAS.map((s) => s.creci).join(" · ")}
        </span>
        {/* 🔴 A privacidade mora AQUI, na barra de baixo, e não no menu de
            navegar. Ninguém entra no site para ler política de privacidade:
            ela é procurada quando já se procura, e o rodapé é onde todo
            mundo procura. Pôr no menu do topo seria dar a ela o mesmo peso
            de "Imóveis", o que não é verdade nenhuma. */}
        <Link href="/privacidade" className="underline underline-offset-4 transition-colors hover:text-papel">
          Privacidade
        </Link>
        <span>
          Protótipo de layout. Imóveis, preços e imagens são exemplos.
        </span>
      </div>
    </footer>
  );
}
