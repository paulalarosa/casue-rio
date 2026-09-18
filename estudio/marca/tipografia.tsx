import { useEffect } from "react";
import type { LayoutProps } from "sanity";

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
