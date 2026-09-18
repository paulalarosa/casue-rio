"use client";

import Link from "next/link";
import { TELEFONE, enderecoEmail } from "@/lib/site";
import type { Imovel } from "@/lib/carteira";

type Props = {
  children: React.ReactNode;
  className?: string;
  recuo?: string;
};

function Envoltorio({
  children,
  className,
  recuo,
  aoAgir,
}: Props & { aoAgir: () => void }) {
  if (recuo) {
    return (
      <Link
        href={recuo}
        className={className}
        onClick={(e) => {
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
