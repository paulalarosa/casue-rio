import { ImageResponse } from "next/og";
import { listarArtigos, lerArtigo } from "@/lib/revista";
import { fontes, frasePara, Placa, TINTA, PAPEL, TERRACOTA } from "@/lib/cartao";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const artigos = await listarArtigos();
  return artigos.map((a) => ({ slug: a.slug }));
}

export async function GET(
  _pedido: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const a = await lerArtigo(slug);
  if (!a) return new Response("não encontrado", { status: 404 });

  const frase = frasePara(a.corpo, a.linha);
  const corpo = frase.length > 180 ? 50 : frase.length > 110 ? 60 : 72;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: PAPEL,
        padding: 88,
        fontFamily: "Archivo",
      }}
    >
      <Placa lado={84} />

      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        <div
          style={{
            display: "flex",
            fontFamily: "Unbounded",
            fontWeight: 700,
            fontSize: corpo,
            lineHeight: 1.22,
            color: TINTA,
            borderLeft: `8px solid ${TERRACOTA}`,
            paddingLeft: 40,
          }}
        >
          {frase}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: TINTA }}>
          {a.autora}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#8A5A33" }}>
          casuerio.com.br/revista
        </div>
      </div>
    </div>,
    { width: 1080, height: 1080, fonts: await fontes() },
  );
}
