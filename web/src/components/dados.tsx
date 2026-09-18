/* O bloco de dados estruturados, um só para o site inteiro.

   🔴 Isto existia COPIADO em dois lugares, com o mesmo `dangerouslySet` e o
   mesmo escape de `<` escrito à mão nos dois. Escape de segurança repetido é
   escape que um dia sai pela metade: basta alguém acrescentar a terceira
   cópia sem olhar a segunda. Aqui ele mora numa linha, e quem quiser dados
   estruturados numa página nova não precisa saber que ele existe.

   O `<` não é frescura. Sem ele, um título de artigo que contenha
   "<script" fecha a etiqueta e o resto do JSON vira HTML executável. */
export function Dados({ children }: { children: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(children).replace(/</g, "<"),
      }}
    />
  );
}
