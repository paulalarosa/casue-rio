import type { Sorte } from "./semente";
import { cor, type Hora } from "./paleta";

export function comercial(s: Sorte, h: Hora, L: number) {
  const e = L / 2 - 166;
  const janelasAlto = s.entre(3, 5);
  const acesa = s.entre(0, janelasAlto - 1);
  const listras = s.entre(4, 6);
  const portaEsquerda = s.chance(0.5);
  const vitrine = s.entre(170, 210);
  const larguraJanela = (300 - (janelasAlto - 1) * 24) / janelasAlto;

  return (
    <>
      <rect width={L} height="275" fill={h.ceu} />
      <rect x={e} y="20" width="332" height="96" fill={h.massa} />
      {Array.from({ length: janelasAlto }, (_, i) => (
        <rect
          key={`ja-${i}`}
          x={e + 16 + i * (larguraJanela + 24)}
          y="44"
          width={larguraJanela}
          height="34"
          fill={i === acesa ? h.luz : h.vao}
          opacity={i === acesa ? 0.85 : 1}
        />
      ))}
      <path
        d={`M${e - 12} 116 L${e + 344} 116 L${e + 326} 152 L${e + 6} 152 Z`}
        fill={cor("papel")}
      />
      <g fill={h.massa}>
        {Array.from({ length: listras }, (_, i) => {
          const larg = 356 / (listras * 2);
          const x = e - 12 + i * larg * 2;
          return (
            <path
              key={`lis-${i}`}
              d={`M${x} 116 L${x + larg} 116 L${x + larg - 16} 152 L${x - 16} 152 Z`}
            />
          );
        })}
      </g>
      <rect x={e} y="152" width="332" height="14" fill={h.topo} />
      <rect x={e} y="166" width="332" height="76" fill={h.massa} />
      <rect
        x={portaEsquerda ? e + 18 : e + 314 - vitrine}
        y="178"
        width={vitrine}
        height="64"
        fill={h.luz}
        opacity=".92"
      />
      <g stroke={h.massa} strokeWidth="6">
        <path
          d={`M${(portaEsquerda ? e + 18 : e + 314 - vitrine) + vitrine / 3} 178v64M${(portaEsquerda ? e + 18 : e + 314 - vitrine) + (vitrine / 3) * 2} 178v64`}
        />
      </g>
      <rect
        x={portaEsquerda ? e + 38 + vitrine : e + 18}
        y="178"
        width={332 - vitrine - 56}
        height="64"
        fill={cor("tinta-800")}
      />
      <rect
        y="242"
        width={L}
        height="33"
        fill={h.noite ? cor("tinta-800") : cor("tinta-300")}
      />
      <g stroke={cor("tinta-800")} strokeWidth="4" fill="none" opacity=".8">
        <path d={`M-4 258q24-16 48 0${"t48 0".repeat(Math.ceil(L / 48))}`} />
      </g>
    </>
  );
}
