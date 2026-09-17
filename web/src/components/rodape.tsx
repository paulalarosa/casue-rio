import Link from "next/link";
/* O lucide tirou as marcas do pacote, entao o Instagram entra pelo
   arroba: e sinal de perfil e nao finge ser o logo de terceiro. */
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { Assinatura } from "@/components/assinatura";
import { ENDERECO, SOCIAS, SLOGAN, NOME } from "@/lib/site";

/* Registro profissional em painel próprio. Selo de confiança desenhado não
   prova nada; número de registro prova, porque qualquer pessoa confere no
   conselho. Ficou vazio enquanto os números não chegavam, e agora tem os
   dois de cada sócia. */
function Registro({
  quem,
  creci,
  cnai,
}: {
  quem: string;
  creci: string;
  cnai: string;
}) {
  return (
    <div className="rounded-[0.75rem] border border-white/12 bg-white/6 px-4 py-3">
      <span className="rotulo block text-tinta-200">{quem}</span>
      <span className="num block text-sm text-papel/80">{creci}</span>
      <span className="num block text-sm text-papel/60">{cnai}</span>
    </div>
  );
}

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
      <div className="trilho relative grid gap-12 py-20 md:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
        <div>
          {/* Lockup principal, empilhado e com o descritivo. É o único
              lugar do site onde "Negócios Imobiliários" aparece por extenso
              junto do nome, e é de propósito: no rodapé há largura para a
              caixa alta espaçada, que é o que a barra do topo não tem. */}
          <Assinatura
            className="text-[2.6rem]"
            cores={{ nome: "text-papel", lugar: "text-areia-400", categoria: "text-tinta-200" }}
          />
          <p className="mt-6 font-display text-2xl font-semibold text-papel">
            {SLOGAN}
          </p>
          <p className="mt-4 max-w-[30ch] text-tinta-200">
            Centro, Tijuca, Grajaú e Zona Sul. Das 9h às 19h, de segunda a sexta.
          </p>
        </div>

        <nav aria-label="Navegar">
          <h3 className="rotulo mb-5 text-areia-300">Navegar</h3>
          <ul className="space-y-2 text-tinta-200">
            {[
              ["/imoveis", "Imóveis"],
              ["/bairros", "Bairros"],
              ["/juridico", "Área jurídica"],
              ["/contato", "Contato"],
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
              <Link href="/contato" className="flex items-center gap-2 transition-colors hover:text-papel">
                <MessageCircle className="size-4" aria-hidden /> WhatsApp
              </Link>
            </li>
            <li>
              <Link href="/contato" className="flex items-center gap-2 transition-colors hover:text-papel">
                <Mail className="size-4" aria-hidden /> E-mail
              </Link>
            </li>
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

        <div>
          <h3 className="rotulo mb-5 text-areia-300">Registro</h3>
          <div className="space-y-3">
            {SOCIAS.map((s) => (
              <Registro
                key={s.sobrenome}
                quem={s.sobrenome}
                creci={s.creci}
                cnai={s.cnai}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="trilho relative flex flex-wrap gap-x-8 gap-y-3 border-t border-white/12 py-7 text-sm text-tinta-200">
        <span>{NOME} · Rio de Janeiro</span>
        <span>
          Protótipo de layout. Imóveis, preços, depoimentos e imagens são exemplos.
        </span>
      </div>
    </footer>
  );
}
