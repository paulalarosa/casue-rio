import { Placa } from "./placa";

/* O que aparece no canto esquerdo da barra do painel, no lugar do "S" da
   Sanity.

   🔴 Só a placa e o nome, sem CRECI, sem "negócios imobiliários" e sem o fio
   descritivo. A assinatura completa é para quem chega de fora e precisa
   saber quem é a empresa. Aqui dentro estão duas pessoas que já sabem: o
   papel do logotipo é dizer "você está no lugar certo" em meio segundo, e
   descritivo nenhum ajuda nisso. */
export function Logotipo() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <Placa tamanho={26} />
      <span
        style={{
          fontFamily: '"Century Gothic", Futura, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: "0.005em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        Casuê Rio
      </span>
    </span>
  );
}
