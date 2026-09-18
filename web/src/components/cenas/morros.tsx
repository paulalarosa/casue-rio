import type { Sorte } from "./semente";
import type { Hora } from "./paleta";

export function morros(s: Sorte, h: Hora, base: number, L: number) {
  const quantos = s.entre(2, 3) + (L > 520 ? 2 : 0);
  const peças = [];
  for (let i = 0; i < quantos; i++) {
    const meio = s.entre(20, L - 20);
    const larg = s.entre(60, 130);
    const alt = s.entre(34, 76);
    peças.push(
      <path
        key={`morro-${i}`}
        d={`M${meio - larg} ${base} L${meio} ${base - alt} L${meio + larg} ${base} Z`}
        fill={h.morro}
      />,
    );
  }
  return peças;
}
