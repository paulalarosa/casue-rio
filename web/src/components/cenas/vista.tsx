import type { Sorte } from "./semente";
import { cor, type Hora } from "./paleta";

export function vista(s: Sorte, h: Hora, L: number) {
  const quantos = s.entre(3, 4) + (L > 520 ? 2 : 0);
  const astroX = s.entre(Math.round(L * 0.58), L - 50);
  const astroR = h.sol ? s.entre(20, 30) : s.entre(12, 18);
  const passo = s.entre(40, 56);
  const morrosDoMar = [];
  for (let i = 0; i < quantos; i++) {
    const meio = s.entre(40, L - 60);
    const larg = s.entre(44, 92);
    const alt = s.entre(38, 80);
    morrosDoMar.push(
      <path
        key={`pao-${i}`}
        d={`M${meio - larg} 156 C${meio - larg * 0.5} ${156 - alt * 1.3} ${meio + larg * 0.5} ${156 - alt * 1.3} ${meio + larg} 156 Z`}
        fill={i % 2 === 0 ? cor("tinta-900") : cor("tinta-800")}
      />,
    );
  }

  return (
    <>
      <rect width={L} height="275" fill={h.ceu} />
      <circle cx={astroX} cy={s.entre(48, 80)} r={astroR} fill={h.luz} />
      {morrosDoMar}
      <rect
        y="156"
        width={L}
        height="119"
        fill={h.noite ? cor("tinta-900") : cor("tinta-800")}
      />
      <g stroke={h.morro} strokeWidth="3" fill="none" opacity=".7">
        {Array.from({ length: Math.round((L / 400) * 9) }, (_, i) => {
          const y = 176 + (i % 3) * 18;
          const x = s.entre(10, L - 80);
          return <path key={`onda-${i}`} d={`M${x} ${y}h${s.entre(44, 74)}`} />;
        })}
      </g>
      <rect y="234" width={L} height="41" fill={cor("tinta-800")} />
      <rect y="228" width={L} height="8" fill={cor("areia-500")} />
      <g stroke={cor("areia-500")} strokeWidth="4">
        {Array.from({ length: Math.ceil(L / passo) }, (_, i) => (
          <path key={`calc-${i}`} d={`M${14 + i * passo} 236v39`} />
        ))}
      </g>
    </>
  );
}
