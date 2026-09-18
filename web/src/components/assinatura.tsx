import { cn } from "@/lib/utils";
import { Placa, type RoupaDaPlaca } from "@/components/placa";

type Cores = { nome?: string; lugar?: string; acento?: string; categoria?: string };

const PADRAO: Required<Omit<Cores, "acento">> = {
  nome: "text-tinta-800",
  lugar: "text-tinta-600",
  categoria: "text-bronze-500",
};

function Casue({ nome, acento }: { nome: string; acento?: string }) {
  return (
    <span className={cn("font-bold tracking-[-0.035em]", nome)}>
      Casu<span className={acento}>ê</span>
    </span>
  );
}

function Rio({ lugar, className }: { lugar: string; className?: string }) {
  return (
    <span className={cn("font-bold tracking-[-0.035em]", lugar, className)}>Rio</span>
  );
}

function Descritivo({ cor, className }: { cor: string; className?: string }) {
  return (
    <span
      className={cn("font-sans font-semibold uppercase leading-none", cor, className)}
      style={{ fontSize: "0.289em", letterSpacing: "0.2em" }}
    >
      Negócios Imobiliários
    </span>
  );
}

export function AssinaturaLinha({
  className,
  cores,
  roupa,
}: {
  className?: string;
  cores?: Cores;
  roupa?: RoupaDaPlaca;
}) {
  const c = { ...PADRAO, ...cores };
  return (
    <span className={cn("inline-flex items-center font-display leading-none", className)}>
      <Placa roupa={roupa} className="text-[2.22em]" />
      <span className="ml-[0.689em] inline-flex items-baseline">
        <Casue nome={c.nome} />
        <Rio lugar={c.lugar} className="ml-[0.22em]" />
      </span>
    </span>
  );
}

export function AssinaturaFaixa({
  className,
  cores,
  roupa,
}: {
  className?: string;
  cores?: Cores;
  roupa?: RoupaDaPlaca;
}) {
  const c = { ...PADRAO, ...cores };
  return (
    <span className={cn("inline-flex items-center font-display leading-none", className)}>
      <Placa roupa={roupa} className="text-[2.154em]" />
      <span className="ml-[0.923em] inline-flex items-baseline">
        <Casue nome={c.nome} />
        <Rio lugar={c.lugar} className="ml-[0.22em]" />
      </span>
      <span
        aria-hidden
        className="ml-[1.077em] hidden h-[1.378em] w-px bg-current opacity-25 lg:block"
      />
      <Descritivo cor={c.categoria} className="ml-[0.838em] hidden lg:inline" />
    </span>
  );
}

export function Assinatura({
  className,
  cores,
  roupa,
}: {
  className?: string;
  cores?: Cores;
  roupa?: RoupaDaPlaca;
}) {
  const c = { ...PADRAO, ...cores };
  return (
    <span className={cn("inline-flex items-center font-display leading-none", className)}>
      <Placa roupa={roupa} className="text-[2.63em]" />
      <span className="ml-[0.816em] inline-flex flex-col gap-[0.42em]">
        <span className="inline-flex items-baseline">
          <Casue nome={c.nome} />
          <Rio lugar={c.lugar} className="ml-[0.22em]" />
        </span>
        <span className="inline-flex items-center">
          <span aria-hidden className="h-[0.058em] w-[0.684em] bg-terracota-600" />
          <Descritivo cor={c.categoria} className="ml-[0.316em]" />
        </span>
      </span>
    </span>
  );
}

export function AssinaturaNome({
  className,
  cores,
  empilhado = false,
}: {
  className?: string;
  cores?: Cores;
  empilhado?: boolean;
}) {
  const c = { acento: "text-terracota-600", ...PADRAO, ...cores };
  return (
    <span
      className={cn(
        "font-display",
        empilhado
          ? "inline-flex flex-col leading-[0.94]"
          : "inline-flex items-baseline leading-none",
        className,
      )}
    >
      <Casue nome={c.nome} acento={c.acento} />
      <Rio lugar={c.lugar} className={empilhado ? undefined : "ml-[0.22em]"} />
    </span>
  );
}
