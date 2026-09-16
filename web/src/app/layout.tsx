import type { Metadata } from "next";
import { Unbounded, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Topo } from "@/components/topo";
import { Rodape } from "@/components/rodape";
import { SITE, MARCA, NOME, DESCRICAO, FRASE, SLOGAN, ENDERECO, SOCIAS } from "@/lib/site";
import { REGIOES } from "@/lib/imoveis";

/* Unbounded é a fonte da marca, escolhida pelas sócias numa folha de nove
   opções. É display: título, marca e número grande, e nada mais. A Archivo
   é o corpo, e o par funciona porque as duas são grotescas geométricas com
   larguras muito diferentes, que é o contraste que segura a hierarquia sem
   precisar de uma serifada no meio. O IBM Plex Mono só aparece em número.

   🔴 Peso 800 e 900 da Unbounded NÃO entram: a contraforma fecha e o nome
   vira mancha no tamanho da barra do topo. */
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export const metadata: Metadata = {
  /* `metadataBase` é o que faz link canônico, sitemap e imagem de
     compartilhamento saírem com endereço absoluto. Sem ele o build reclama
     de caminho relativo, e com domínio inventado sairia tudo errado. */
  metadataBase: new URL(SITE),
  title: {
    default: `${NOME} · Rio de Janeiro`,
    template: `%s · ${MARCA}`,
  },
  description: DESCRICAO,
  /* 🔴 Canônico NÃO mora aqui. Metadado de layout desce para todas as
     páginas, e apontar todas para "/" é o mesmo que pedir para o buscador
     ignorar sete páginas de conteúdo. Cada página declara o seu, pelo
     `metaDaPagina()`. */
  alternates: { canonical: "/" },
  openGraph: {
    title: NOME,
    /* Montada das regiões atendidas, e não escrita à mão: a lista aqui
       ficou três regiões atrasada depois que o Grajaú entrou. */
    description: `${FRASE} ${REGIOES.join(", ").replace(/, ([^,]+)$/, " e $1")}.`,
    url: "/",
    siteName: NOME,
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

/* Dados estruturados da imobiliária. É o que faz a busca entender que aqui
   tem um negócio, com área de atuação e não só páginas de texto.

   🔴 `telephone`, `address` e os registros NÃO entram enquanto não vierem da
   cliente: dado estruturado errado é pior que dado ausente, porque a busca
   passa a mostrar o errado com confiança. */
const DADOS = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: NOME,
  description: DESCRICAO,
  url: SITE,
  areaServed: [
    { "@type": "Place", name: "Centro, Rio de Janeiro" },
    { "@type": "Place", name: "Tijuca, Rio de Janeiro" },
    { "@type": "Place", name: "Grajaú, Rio de Janeiro" },
    { "@type": "Place", name: "Zona Sul, Rio de Janeiro" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: `${ENDERECO.rua}, ${ENDERECO.complemento}`,
    addressLocality: ENDERECO.cidade,
    addressRegion: ENDERECO.estado,
    postalCode: ENDERECO.cep,
    addressCountry: "BR",
  },
  /* Cada sócia com o registro que dá para conferir no conselho. É o campo
     que a busca usa para casar o negócio com a pessoa. */
  employee: SOCIAS.map((s) => ({
    "@type": "RealEstateAgent",
    name: s.nome,
    identifier: [s.creci, s.cnai],
  })),
  knowsLanguage: "pt-BR",
  slogan: SLOGAN,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${unbounded.variable} ${archivo.variable} ${plex.variable} h-full antialiased grao`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(DADOS).replace(/</g, "\u003c"),
          }}
        />
        <Topo />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Rodape />
      </body>
    </html>
  );
}
