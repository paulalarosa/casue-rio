import { ImageResponse } from "next/og";
import { IMOVEIS } from "@/lib/carteira";
import { moeda } from "@/lib/imoveis";
import { MARCA, NOME, DESCRITIVO, SLOGAN } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `Imóvel na ${NOME}`;

export function generateStaticParams() {
  return IMOVEIS.map((im) => ({ codigo: im.codigo }));
}

export default async function Imagem({ params }: PageProps<"/imoveis/[codigo]">) {
  const { codigo } = await params;
  const im = IMOVEIS.find((x) => x.codigo === codigo);

  const TINTA = "#111110";
  const PAPEL = "#F6F2E9";
  const AREIA = "#DDCBAA";

  const ficha = im
    ? [
        `${im.area} m²`,
        im.quartos ? `${im.quartos} ${im.quartos === 1 ? "quarto" : "quartos"}` : null,
        im.suites ? `${im.suites} ${im.suites === 1 ? "suíte" : "suítes"}` : null,
        im.vagas ? `${im.vagas} ${im.vagas === 1 ? "vaga" : "vagas"}` : null,
      ].filter(Boolean)
    : [];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: TINTA,
        padding: 72,
        color: PAPEL,
        fontSize: 32,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 56, height: 8, background: AREIA }} />
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {im ? `${im.bairro} · ${im.codigo}` : MARCA}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            fontSize: 74,
            lineHeight: 1.05,
            fontWeight: 700,
            maxWidth: 980,
          }}
        >
          {im ? im.titulo : SLOGAN}
        </div>
        {im && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
            <div style={{ display: "flex", fontSize: 58, fontWeight: 700, color: AREIA }}>
              {`${moeda(im.preco)}${im.porMes ? " / mês" : ""}`}
            </div>
            <div style={{ display: "flex", fontSize: 30, opacity: 0.82 }}>
              {ficha.join(" · ")}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderTop: `2px solid rgba(246,242,233,.24)`,
          paddingTop: 26,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: -1 }}
          >
            {MARCA}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 17,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: AREIA,
            }}
          >
            {DESCRITIVO}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, opacity: 0.78 }}>
          Documentação conferida antes da proposta
        </div>
      </div>
    </div>,
    size,
  );
}
