import { artigo } from "./artigo";

/* 🔴 SÓ O ARTIGO mora no painel, e a ausência dos outros é a decisão.

   O painel existe para uma coisa: as duas escreverem a revista. Imóvel,
   bairro, preço, foto, texto de página e qualquer outra coisa do site são
   alteração de site, e alteração de site passa por quem faz a manutenção.

   Isso não é desconfiança, é contrato. Um painel que edita tudo transforma
   toda mudança em risco de quem não vai ver o resultado: trocar um preço no
   lugar errado derruba a busca por código, e o erro só aparece para quem
   visita. Escrever um artigo não derruba nada.

   Os imóveis do site vivem em `web/src/lib/imoveis.ts`, em código, e é de lá
   que o site lê. Nunca houve duas fontes de verdade valendo ao mesmo tempo. */
export const tipos = [artigo];
