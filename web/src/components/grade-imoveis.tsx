import { CartaoImovel } from "@/components/cartao-imovel";
import type { Imovel } from "@/lib/carteira";
import { cn } from "@/lib/utils";

export function GradeImoveis({
  imoveis,
  className,
}: {
  imoveis: readonly Imovel[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {imoveis.map((im) => (
        <CartaoImovel key={im.codigo} im={im} />
      ))}
    </div>
  );
}
