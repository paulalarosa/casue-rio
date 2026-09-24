import { ImageResponse } from "next/og";
import { listarArtigos, lerArtigo, dataPorExtenso } from "@/lib/revista";
import { fontes, Placa, TINTA, PAPEL, AREIA, TERRACOTA, BRONZE } from "@/lib/cartao";
import { MARCA } from "@/lib/site";

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

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: TINTA,
        padding: 88,
        fontFamily: "Archivo",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Placa lado={84} />
        <div
          style={{
            display: "flex",
            fontFamily: "Unbounded",
            fontWeight: 700,
            fontSize: 40,
            color: PAPEL,
          }}
        >
          {MARCA}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", width: 96, height: 8, background: TERRACOTA }} />
        <div
          style={{
            display: "flex",
            fontFamily: "Unbounded",
            fontWeight: 700,
            fontSize: 68,
            lineHeight: 1.12,
            color: PAPEL,
          }}
        >
          {a.titulo}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            lineHeight: 1.45,
            color: AREIA,
          }}
        >
          {a.linha}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", height: 1, background: "#3A322C" }} />
        <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: PAPEL }}>
          {dataPorExtenso(a.data)}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: BRONZE, letterSpacing: 2 }}>
          casuerio.com.br/revista
        </div>
      </div>
    </div>,
    { width: 1080, height: 1350, fonts: await fontes() },
  );
}
