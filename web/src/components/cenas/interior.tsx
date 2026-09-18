import type { Sorte } from "./semente";
import { cor, type Hora } from "./paleta";

export function interior(s: Sorte, h: Hora, L: number) {
  const cx = L / 2;
  const colunas = s.entre(2, 3);
  const linhas = s.entre(2, 3);
  const janelao = s.chance(0.5);
  const parede = s.um([h.parede, h.massa, cor("terracota-900")]);
  const jx = cx + (janelao ? s.entre(-30, -4) : s.entre(6, 32));
  const jl = janelao ? s.entre(170, 200) : s.entre(112, 136);
  const jy = janelao ? 38 : s.entre(46, 60);
  const jh = janelao ? 150 : s.entre(112, 132);
  const sofa = s.entre(120, 150);
  const pendente = s.chance(0.7);
  const tapete = s.chance(0.6);

  return (
    <>
      <rect width={L} height="275" fill={parede} />
      <path d={`M0 232 L${L} 208 L${L} 275 L0 275 Z`} fill={cor("tinta-800")} />
      <rect x={jx} y={jy} width={jl} height={jh + 16} fill={cor("tinta-800")} />
      <rect x={jx + 8} y={jy + 8} width={jl - 16} height={jh} fill={h.luz} />
      <g stroke={cor("tinta-800")} strokeWidth="6">
        {Array.from({ length: colunas - 1 }, (_, i) => (
          <path
            key={`cv-${i}`}
            d={`M${jx + 8 + ((jl - 16) / colunas) * (i + 1)} ${jy + 8}v${jh}`}
          />
        ))}
        {Array.from({ length: linhas - 1 }, (_, i) => (
          <path
            key={`ch-${i}`}
            d={`M${jx + 8} ${jy + 8 + (jh / linhas) * (i + 1)}h${jl - 16}`}
          />
        ))}
      </g>
      <path
        d={`M${jx + 8} ${jy + jh} L${jx + jl - 8} ${jy + jh} L${jx + jl - 74} 262 L${jx - 118} 262 Z`}
        fill={cor("areia-100")}
        opacity=".16"
      />
      <rect x={jx - 16} y={jy + jh + 8} width={jl + 16} height="9" fill={h.topo} />
      {tapete && (
        <rect
          x={cx - 170}
          y="236"
          width="200"
          height="18"
          rx="9"
          fill={cor("tinta-900")}
          opacity=".7"
        />
      )}
      <rect x={cx - 160} y="176" width={sofa} height="52" rx="4" fill={h.topo} />
      <rect
        x={cx - 166}
        y="150"
        width={sofa + 12}
        height="34"
        rx="6"
        fill={cor("tinta-800")}
      />
      <rect
        x={cx - 148}
        y="156"
        width="50"
        height="24"
        rx="3"
        fill={cor("tinta-400")}
        opacity=".55"
      />
      <rect
        x={cx - 148 + sofa / 2}
        y="156"
        width="50"
        height="24"
        rx="3"
        fill={cor("tinta-400")}
        opacity=".35"
      />
      <rect x={cx - 156} y="228" width="10" height="16" fill={cor("tinta-800")} />
      <rect x={cx - 174 + sofa} y="228" width="10" height="16" fill={cor("tinta-800")} />
      {pendente && (
        <>
          <path d={`M${cx - 12} 0v58`} stroke={h.topo} strokeWidth="4" />
          <path d={`M${cx - 34} 58h44l-10 22h-24z`} fill={h.topo} />
          <circle cx={cx - 12} cy="86" r="9" fill={h.luz} />
        </>
      )}
      <rect x={cx + 166} y="196" width="8" height="42" fill={cor("tinta-800")} />
      <circle cx={cx + 170} cy="188" r={s.entre(16, 26)} fill={h.topo} />
    </>
  );
}
