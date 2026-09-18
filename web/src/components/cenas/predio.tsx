import type { Sorte } from "./semente";
import { cor, type Hora } from "./paleta";
import { morros } from "./morros";

export function predio(s: Sorte, h: Hora, L: number) {
  const cx = L / 2;
  const andares = s.entre(3, 5);
  const colunas = s.entre(4, 6);
  const ALTURA_ANDAR = 46;
  const base = 222;
  const topo = base - andares * ALTURA_ANDAR;
  const vao = (212 - (colunas - 1) * 14) / colunas;
  const portaX = cx - 60 + s.entre(-54, 54);
  const toldo = s.um([cor("terracota-300"), cor("areia-200"), cor("terracota-200")]);
  const vizE = s.entre(90, 140);
  const vizD = s.entre(100, 150);

  const janelas = [];
  for (let a = 0; a < andares; a++) {
    for (let c = 0; c < colunas; c++) {
      const acesa = s.chance(h.acesa);
      janelas.push(
        <rect
          key={`j-${a}-${c}`}
          x={cx - 106 + c * (vao + 14)}
          y={topo + a * ALTURA_ANDAR + 14}
          width={vao}
          height={26}
          fill={acesa ? h.luz : h.vao}
          opacity={acesa ? 0.92 : 1}
        />,
      );
    }
  }

  return (
    <>
      <rect width={L} height="275" fill={h.ceu} />
      {morros(s, h, 140, L)}
      {Array.from({ length: Math.ceil(cx / 92) }, (_, i) => {
        const alt = 78 + ((i * 37) % 62);
        return (
          <g key={`viz-${i}`} fill={h.vizinho}>
            <rect x={cx - 182 - i * 92} y={255 - alt} width="46" height={alt} />
            <rect x={cx + 136 + i * 92} y={237 - alt} width="52" height={alt + 18} />
          </g>
        );
      })}
      <rect x={cx - 182} y={255 - vizE} width="46" height={vizE} fill={h.vizinho} />
      <rect x={cx + 136} y={255 - vizD} width="52" height={vizD} fill={h.vizinho} />
      <rect x={cx - 126} y={topo} width="252" height={base - topo} fill={h.massa} />
      <rect x={cx - 126} y={topo} width="252" height="9" fill={h.topo} />
      {janelas}
      <g stroke={h.vizinho} strokeWidth="2" opacity=".55">
        {Array.from({ length: andares - 1 }, (_, a) => (
          <path
            key={`fio-${a}`}
            d={`M${cx - 114} ${topo + (a + 1) * ALTURA_ANDAR + 4}h228`}
          />
        ))}
      </g>
      <rect x={cx - 126} y={base} width="252" height="33" fill={h.topo} />
      <rect x={portaX} y={base + 6} width="54" height="27" fill={toldo} opacity=".9" />
      <rect y="255" width={L} height="20" fill={h.rua} />
    </>
  );
}
