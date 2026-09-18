import { useEffect } from "react";
import type { LayoutProps } from "sanity";

/* Carrega as duas fontes da marca dentro do painel.

   🔴 A Sanity não expõe um gancho para o `<head>`, e é por isso que isto é
   um componente e não uma linha de configuração. `components.layout` é ponto
   de extensão documentado, e o efeito roda uma vez: se a etiqueta já existe,
   sai sem fazer nada.

   Sem isto o painel cai no Century Gothic do Windows, que é o reserva da
   marca e não é errado, só não é a letra dela. Com isto, o nome na barra sai
   na Unbounded de verdade, igual ao site. */
const ID = "casue-fontes";
const FONTES =
  "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Unbounded:wght@700&display=swap";

export function Tipografia(props: LayoutProps) {
  useEffect(() => {
    if (document.getElementById(ID)) return;
    const link = document.createElement("link");
    link.id = ID;
    link.rel = "stylesheet";
    link.href = FONTES;
    document.head.appendChild(link);
  }, []);

  return props.renderDefault(props);
}
