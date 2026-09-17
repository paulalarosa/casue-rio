"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AssinaturaFaixa, AssinaturaNome } from "@/components/assinatura";
import { cn } from "@/lib/utils";

/* 🔴 O menu perdeu duas entradas em 17/09/2026, e as duas por REDUNDÂNCIA,
   não por falta de conteúdo:

   · "Bairros" saiu porque ela e "Imóveis" mandavam para a mesma coisa vista
     de dois jeitos, e quem chega não sabe qual das duas abrir. Os bairros
     agora moram DENTRO de /imoveis, numa faixa própria, e as páginas de cada
     bairro continuam existindo e continuam indexadas.
   · "Contato" saiu porque o botão ao lado já é o contato. Duas portas para a
     mesma conversa, uma escrita e uma pintada, é o tipo de repetição que faz
     a pessoa procurar a diferença entre elas.

   "Jurídico" saiu por decisão dela, e a página junto.

   O que sobrou são quatro assuntos que não se confundem: o que tem à venda,
   quanto vale, quem são elas, e o que escrevem. */
const LINKS = [
  { href: "/imoveis", texto: "Imóveis" },
  { href: "/avaliacao", texto: "Avaliação" },
  { href: "/quem-somos", texto: "Quem somos" },
  { href: "/revista", texto: "Revista" },
];

/* Barra que flutua destacada do topo, em vez de colar na borda da tela.

   Sobre a abertura ela usa a receita TINGIDA, e não a clara: atrás dela
   passa a fachada iluminada do prédio, e medido no enquadramento de tela
   baixa os links em azul claro sobre vidro claro ficavam ilegíveis quando a
   parte clara da cena entrava. Vidro sobre imagem precisa de tinta, igual
   à etiqueta de preço no cartão. Depois da rolagem vira vidro claro,
   porque aí atrás é o off-white. */
export function Topo() {
  const caminho = usePathname();
  const [rolou, setRolou] = useState(false);
  const [menu, setMenu] = useState(false);
  const sobreCena = caminho === "/" && !rolou;

  /* Trocar de página fecha o menu: gaveta aberta sobre a página nova é o
     defeito clássico de menu em rota do lado do cliente.

     🔴 Isto era um `useEffect` com `setMenu(false)` dentro, e o lint barra
     com razão: fechar o menu não é sincronizar com sistema externo, é
     estado derivado do caminho. Ajustar durante a renderização é o jeito
     que o React documenta, e ainda economiza uma pintura, porque o menu
     nunca chega a aparecer aberto na página nova. */
  const [ondeAbriu, setOndeAbriu] = useState(caminho);
  if (ondeAbriu !== caminho) {
    setOndeAbriu(caminho);
    setMenu(false);
  }

  useEffect(() => {
    const medir = () => setRolou(window.scrollY > 120);
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    return () => window.removeEventListener("scroll", medir);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-60 pt-3 sm:pt-4">
      {/* Primeiro alvo do Tab: sem ele, quem navega por teclado atravessa o
          menu inteiro em toda página antes de chegar ao conteúdo. */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-70 focus:rounded-full focus:bg-tinta-800 focus:px-5 focus:py-3 focus:font-semibold focus:text-papel"
      >
        Pular para o conteúdo
      </a>

      <div
        className={cn(
          "trilho flex items-center gap-4 rounded-full py-2 pl-4 pr-2 sm:pl-6 sm:gap-8",
          "transition-[background-color,box-shadow,border-color] duration-500 ease-[var(--ease-saida)]",
          sobreCena ? "vidro-tinta" : "vidro-claro",
        )}
      >
        <Link href="/" className="flex shrink-0 items-center" aria-label="Casuê Rio, início">
          {/* Montagem 04 · faixa. A folha de marca é explícita: "04 em barras
              e testeiras", e esta é a barra. Placa, nome, fio e descritivo em
              uma linha só, com o descritivo saindo abaixo de `lg`, onde a
              barra deixa de ter largura para ele.

              🔴 A placa NÃO inverte sobre a cena escura. A montagem 16 mantém
              o esmalte terracota sobre a tinta e muda só o nome: a placa é um
              bloco cheio, que pede 3:1 e mede 3,19:1 ali. Quem precisa mudar
              é a palavra ao lado.

              🔴 E o ê NÃO é colorido aqui. Nas montagens com placa o nome sai
              numa cor só: o ê em terracota é a versão SEM placa, a 05, e é
              ela que existe justamente para substituir a placa quando esta
              não cabe. Com a placa ao lado, o acento seria a mesma cor a dois
              centímetros de si mesma. */}
          <AssinaturaFaixa
            className="text-[1.05rem] sm:text-[1.15rem]"
            cores={{
              nome: sobreCena ? "text-papel" : "text-tinta-800",
              lugar: sobreCena ? "text-areia-400" : "text-tinta-600",
              categoria: sobreCena ? "text-areia-300" : "text-bronze-500",
            }}
          />
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const atual = caminho.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={atual ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300",
                  sobreCena
                    ? "text-papel/85 hover:bg-white/14 hover:text-papel"
                    : "text-tinta-500 hover:bg-tinta-800/6 hover:text-tinta-800",
                  atual &&
                    (sobreCena
                      ? "bg-white/16 text-papel"
                      : "bg-tinta-800/8 text-tinta-800"),
                )}
              >
                {l.texto}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contato"
          className={cn(
            "ml-auto inline-flex shrink-0 items-center rounded-full px-4 py-2.5 text-sm font-semibold md:ml-0",
            "shadow-[var(--shadow-flutua-1)] transition-transform duration-300 hover:-translate-y-0.5",
            /* 🔴 Terracota nos DOIS estados. Antes era areia sobre a cena e
               tinta depois da rolagem, ou seja, a acao principal do site
               nunca teve cor. Medido: papel sobre terracota-600 da 5,18:1
               sobre o claro; sobre a cena escura o botao e um bloco cheio,
               que pede 3:1 e nao 4,5, e passa.

               🔴 O repouso escurece nos dois estados, nunca clareia: eu
               tinha posto `terracota-500` no hover e medi 4,13:1 de papel
               sobre ele, ou seja, o botao REPROVAVA justamente enquanto o
               mouse estava em cima. Estado de interacao tambem e estado. */
            sobreCena
              ? "bg-terracota-600 text-papel hover:bg-terracota-700"
              : "bg-terracota-600 text-papel hover:bg-terracota-700",
          )}
        >
          {/* 🔴 "Falar" sozinho não diz com quem nem convida; "Falar com a
              gente" convida e é o mesmo título da página de destino, então o
              botão e a página deixam de ter dois nomes para a mesma coisa.

              🔴 E não diz "sócia": o contato passou a ser um canal único da
              empresa, não um por pessoa, e rótulo que promete falar com uma
              pessoa específica promete o que o canal não entrega.

              🔴 SEM ícone, e foi medido: com o balãozinho o botão dava 177px
              numa barra de 1297, e a 1024 de tela ele virava o elemento mais
              pesado da barra depois do menu inteiro. O ícone dizia
              "mensagem", que é exatamente o que as três palavras ao lado já
              dizem — ilustrar o rótulo com o próprio rótulo. Pílula cheia em
              terracota já é o botão mais visível da tela, não precisa de
              desenho para ser reconhecida.

              O rótulo curto fica no celular, onde a barra não tem largura. */}
          <span className="hidden sm:inline">Falar com a gente</span>
          <span className="sm:hidden">Falar</span>
        </Link>

        {/* No celular o menu inteiro ficava de fora: só existia o botão de
            falar, e as quatro páginas não tinham como ser alcançadas. */}
        <Sheet open={menu} onOpenChange={setMenu}>
          <SheetTrigger
            aria-label="Abrir menu"
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-full transition-colors md:hidden",
              sobreCena
                ? "text-papel hover:bg-white/10"
                : "text-tinta-800 hover:bg-tinta-800/8",
            )}
          >
            <Menu className="size-5" aria-hidden />
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(20rem,86vw)] p-8">
            <SheetTitle className="sr-only">Navegação</SheetTitle>
            {/* Montagem 05 · sem placa, que é a que a folha manda usar
                "onde a placa já aparece na mesma página". É o caso exato: a
                gaveta abre a três dedos da barra, e a barra tem a placa. Duas
                placas na mesma tela gastariam o símbolo em vez de firmá-lo.

                E é a ÚNICA montagem em que o ê sai colorido: sem a placa ao
                lado, é ele que carrega a cor da marca. */}
            <div className="mt-6">
              <AssinaturaNome className="text-[2rem]" empilhado />
            </div>
            <nav aria-label="Principal" className="mt-10 flex flex-col gap-1">
              {/* Fechar no clique, e não só na troca de rota: tocar no link
                  da página em que já se está não muda a rota, e a gaveta
                  ficaria aberta sem nada ter acontecido. */}
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenu(false)}
                  aria-current={caminho.startsWith(l.href) ? "page" : undefined}
                  className={cn(
                    "rounded-[0.75rem] px-5 py-4 font-display text-2xl font-semibold transition-colors",
                    caminho.startsWith(l.href)
                      ? "bg-tinta-800/8 text-tinta-800"
                      : "text-tinta-600 hover:bg-tinta-800/6",
                  )}
                >
                  {l.texto}
                </Link>
              ))}
            </nav>
            <p className="mt-10 border-t border-tinta-800/10 pt-6 text-sm text-tinta-500">
              Atendimento das 9h às 19h, de segunda a sexta.
            </p>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
