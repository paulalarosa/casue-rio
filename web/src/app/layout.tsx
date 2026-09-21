import type { Metadata } from "next";
import { Unbounded, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Topo } from "@/components/topo";
import { Rodape } from "@/components/rodape";
import { Dados } from "@/components/dados";
import { Medicao } from "@/components/medicao";
import { CHAVE, GA, temMedicao } from "@/lib/medicao";
import { empresa, pessoas, grafo } from "@/lib/dados-estruturados";
import { SITE, MARCA, NOME, DESCRICAO, SLOGAN } from "@/lib/site";
import { REGIOES } from "@/lib/imoveis";

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
  metadataBase: new URL(SITE),
  title: {
    default: `${NOME} · Rio de Janeiro`,
    template: `%s · ${MARCA}`,
  },
  description: DESCRICAO,
  alternates: { canonical: "/" },
  openGraph: {
    title: NOME,
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
        {temMedicao && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html:
                  `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}` +
                  `var a='denied';try{if(localStorage.getItem('${CHAVE}')==='sim')a='granted'}catch(e){}` +
                  `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:a});` +
                  `gtag('js',new Date());gtag('config','${GA}',{anonymize_ip:true});`,
              }}
            />
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} />
          </>
        )}
        <Dados>{grafo(empresa(), ...pessoas())}</Dados>
        <Topo />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Rodape />
        <Medicao />
      </body>
    </html>
  );
}
