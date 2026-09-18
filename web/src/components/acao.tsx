"use client";

import Link from "next/link";
import { TELEFONE, enderecoEmail } from "@/lib/site";
import type { Imovel } from "@/lib/imoveis";

/* Botões de contato que NÃO mostram o contato.

   🔴 A regra é da cliente e é clara: telefone e e-mail não aparecem em
   lugar nenhum da tela. Nem escritos, nem no `title`, nem na barra de
   status do navegador quando o mouse passa por cima. Clicou, abre o
   aplicativo; fora isso, não existe endereço à vista.

   Um `<a href="mailto:...">` falha nessa regra de três jeitos ao mesmo
   tempo: o endereço aparece na barra de status no `hover`, aparece no menu
   de "copiar endereço do link", e aparece no HTML servido, que é onde todo
   robô de coleta olha primeiro. Aqui o destino só é montado no instante do
   clique.

   🔴 HONESTIDADE SOBRE O QUE ISSO RESOLVE: não esconde nada de quem roda um
   navegador de verdade para raspar, porque o endereço precisa existir no
   JavaScript para o clique funcionar. O que ele resolve é o caso comum, que
   é o robô que varre o HTML atrás de `mailto:` e de arroba. Por isso o
   endereço vive PARTIDO em `site.ts` e só é juntado aqui: uma expressão
   regular procurando e-mail no pacote não casa com nenhuma das metades.

   🔴 E quando há para onde cair, isto continua sendo um LINK. Botão puro
   deixaria o principal caminho de contato do site dependendo de JavaScript,
   e quem abre em aba nova ou tem script bloqueado ficaria sem nada. Com
   `recuo`, o elemento é um link de verdade para a página de contato, e o
   clique só intercepta o que já ia funcionar. Na própria página de contato
   não há para onde cair, e aí sim vira botão. */

type Props = {
  children: React.ReactNode;
  className?: string;
  /* Para onde o link aponta de verdade. Sem isto, o elemento vira botão. */
  recuo?: string;
};

function Envoltorio({ children, className, recuo, aoAgir }: Props & { aoAgir: () => void }) {
  if (recuo) {
    return (
      <Link
        href={recuo}
        className={className}
        onClick={(e) => {
          /* Ctrl, cmd, shift ou botão do meio: a pessoa quis abrir em outra
             aba, e o destino honesto dessa outra aba é a página de contato.
             Interceptar aqui abriria o aplicativo de e-mail por cima de uma
             aba nova em branco. */
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          aoAgir();
        }}
      >
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={className} onClick={aoAgir}>
      {children}
    </button>
  );
}

export function AcaoEmail({ children, className, recuo }: Props) {
  return (
    <Envoltorio
      className={className}
      recuo={recuo}
      aoAgir={() => {
        window.location.href = `mailto:${enderecoEmail()}`;
      }}
    >
      {children}
    </Envoltorio>
  );
}

export function AcaoZap({
  children,
  className,
  recuo,
  im,
}: Props & { im?: Pick<Imovel, "codigo" | "titulo"> }) {
  /* 🔴 Sem número, NÃO existe ação a interceptar: o elemento é só um link
     para a página de contato. `wa.me/` sem destinatário abre o aplicativo
     sem ninguém do outro lado, e a pessoa sai achando que falou com a
     imobiliária. */
  if (!TELEFONE) {
    return (
      <Link href={recuo ?? "/contato/"} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <Envoltorio
      className={className}
      recuo={recuo}
      aoAgir={() => {
        const texto = im
          ? `Olá! Vi o imóvel ${im.codigo}, ${im.titulo}, no site e queria saber mais.`
          : "Olá! Vim pelo site.";
        window.open(
          `https://wa.me/${TELEFONE.replace(/\D/g, "")}?text=${encodeURIComponent(texto)}`,
          "_blank",
          "noopener",
        );
      }}
    >
      {children}
    </Envoltorio>
  );
}
