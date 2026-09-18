import type { Sorte } from "./semente";
import { cor, type Hora } from "./paleta";
import { morros } from "./morros";

export function casa(s: Sorte, h: Hora, L: number) {
  const cx = L / 2;
  const cume = s.entre(50, 76);
  const largura = s.entre(160, 196);
  const x0 = cx - largura / 2;
  const acesaEsquerda = s.chance(0.5);
  const arvores = s.entre(1, 3);
  const janelaY = s.entre(140, 152);

  return (
    <>
      <rect width={L} height="275" fill={h.ceu} />
      {morros(s, h, 152, L)}
      <rect y="150" width={L} height="125" fill={h.rua} />
      <rect x={x0} y="118" width={largura} height="112" fill={cor("tinta-50")} />
      <path
        d={`M${x0 - 12} 120 L${cx} ${cume} L${x0 + largura + 12} 120 Z`}
        fill={h.massa}
      />
      <rect x={x0 - 16} y="116" width={largura + 32} height="8" fill={h.topo} />
      <rect x={cx - 14} y="168" width="30" height="62" fill={h.massa} />
      <rect
        x={x0 + 20}
        y={janelaY}
        width="38"
        height="32"
        fill={acesaEsquerda ? h.luz : cor("tinta-800")}
      />
      <rect
        x={x0 + largura - 58}
        y={janelaY}
        width="38"
        height="32"
        fill={acesaEsquerda ? cor("tinta-800") : h.luz}
      />
      <g stroke={h.topo} strokeWidth="3">
        <path
          d={`M${x0 + 39} ${janelaY}v32M${x0 + 20} ${janelaY + 16}h38M${x0 + largura - 39} ${janelaY}v32M${x0 + largura - 58} ${janelaY + 16}h38`}
        />
      </g>
      <rect x={x0} y="222" width={largura} height="8" fill={h.massa} />
      <g stroke={cor("areia-500")} strokeWidth="3">
        {Array.from({ length: Math.ceil(L / 14) }, (_, i) => (
          <path key={`poste-${i}`} d={`M${8 + i * 14} 232v26`} />
        ))}
        <path d={`M0 234h${L}M0 256h${L}`} />
      </g>
      {Array.from({ length: arvores }, (_, i) => {
        const x = i === 0 ? cx - s.entre(120, 152) : cx + s.entre(100, 150);
        const r = s.entre(18, 34);
        return (
          <g key={`arv-${i}`}>
            <rect x={x - 4} y={258 - r * 2} width="9" height={r * 2} fill={h.topo} />
            <circle cx={x} cy={252 - r * 2} r={r} fill={h.massa} />
            <circle cx={x + r * 0.7} cy={258 - r * 1.4} r={r * 0.62} fill={h.massa} />
          </g>
        );
      })}
      <rect y="258" width={L} height="17" fill={cor("tinta-800")} />
    </>
  );
}
