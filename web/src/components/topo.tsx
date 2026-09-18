"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AssinaturaFaixa, AssinaturaNome } from "@/components/assinatura";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/imoveis", texto: "Imóveis" },
  { href: "/avaliacao", texto: "Avaliação" },
  { href: "/quem-somos", texto: "Quem somos" },
  { href: "/revista", texto: "Revista" },
];

export function Topo() {
  const caminho = usePathname();
  const [rolou, setRolou] = useState(false);
  const [menu, setMenu] = useState(false);
  const sobreCena = caminho === "/" && !rolou;

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
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Casuê Rio, início"
        >
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
            sobreCena
              ? "bg-terracota-600 text-papel hover:bg-terracota-700"
              : "bg-terracota-600 text-papel hover:bg-terracota-700",
          )}
        >
          <span className="hidden sm:inline">Falar com a gente</span>
          <span className="sm:hidden">Falar</span>
        </Link>

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
            <div className="mt-6">
              <AssinaturaNome className="text-[2rem]" empilhado />
            </div>
            <nav aria-label="Principal" className="mt-10 flex flex-col gap-1">
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
