import { sorteio, type Sorte } from "./semente";
import { horaSorteada, type Hora } from "./paleta";
import { predio } from "./predio";
import { casa } from "./casa";
import { interior } from "./interior";
import { vista } from "./vista";
import { comercial } from "./comercial";

export type NomeCena = "predio" | "casa" | "interior" | "vista" | "comercial";

const DESENHOS: Record<NomeCena, (s: Sorte, h: Hora, L: number) => React.ReactNode> = {
  predio,
  casa,
  interior,
  vista,
  comercial,
};

export function Cena({
  nome,
  rotulo,
  semente,
  ancora = "meio",
  panorama = false,
  className,
}: {
  nome: NomeCena;
  rotulo: string;
  semente?: string;
  ancora?: "meio" | "base";
  panorama?: boolean;
  className?: string;
}) {
  const s = sorteio(`${nome}|${semente ?? ""}`);
  const hora = horaSorteada(s);
  const espelho = s.chance(0.5);
  const z = s.entre(0, 14);
  const L = panorama ? 1040 : 400;

  return (
    <svg
      role="img"
      aria-label={rotulo}
      viewBox={`${z} ${z * 0.6875} ${L - z * 2} ${275 - z * 1.375}`}
      preserveAspectRatio={ancora === "base" ? "xMidYMax slice" : "xMidYMid slice"}
      className={`overflow-hidden ${className ?? ""}`}
    >
      <g transform={espelho ? `translate(${L},0) scale(-1,1)` : undefined}>
        {DESENHOS[nome](s, hora, L)}
      </g>
    </svg>
  );
}
