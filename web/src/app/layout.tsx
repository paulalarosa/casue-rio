import type { Metadata } from "next";
import { Unbounded, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Topo } from "@/components/topo";
import { Rodape } from "@/components/rodape";
import { Dados } from "@/components/dados";
import { Medicao } from "@/components/medicao";
import { empresa, pessoas, grafo } from "@/lib/dados-estruturados";
import { SITE, MARCA, NOME, DESCRICAO, SLOGAN } from "@/lib/site";
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
    /* Montada das regiões atendidas, e não escrita à mão: a lista aqui já
       ficou atrasada duas vezes, uma quando entrou região e outra quando
       saiu. Derivada, ela acompanha. */
    description: `${SLOGAN} ${REGIOES.join(", ").replace(/, ([^,]+)$/, " e $1")}.`,
    url: "/",
    siteName: NOME,
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${unbounded.variable} ${archivo.variable} ${plex.variable} h-full antialiased grao`}
    >
      <body className="min-h-full flex flex-col">
        {/* 🔴 A empresa e as duas pessoas são declaradas UMA VEZ, aqui, e
            todo o resto do site só aponta para elas por `@id`. Antes este
            bloco era um objeto solto neste arquivo; agora vem de
            `dados-estruturados.ts`, de onde o artigo e a revista também
            puxam. Uma definição, um lugar para corrigir. */}
        <Dados>{grafo(empresa(), ...pessoas())}</Dados>
        <Topo />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Rodape />
        {/* 🔴 Não renderiza NADA enquanto `NEXT_PUBLIC_GA_ID` estiver vazia,
            e é assim que o site está hoje: sem cookie, sem terceiro, sem
            faixa. Quando a variável for preenchida, aparecem os três ao
            mesmo tempo, incluindo o trecho da página de privacidade, que sai
            do mesmo interruptor. */}
        <Medicao />
      </body>
    </html>
  );
}
