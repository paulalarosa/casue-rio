import { Card, Stack, Text } from "@sanity/ui";
import {
  AREIA,
  Botao,
  Cartao,
  Forte,
  Linha,
  PAPEL,
  PaginaAjuda,
  TERRACOTA,
  TINTA,
} from "./ajuda";

const PASSOS = [
  {
    titulo: "Comece o texto",
    texto:
      "Clique em Revista, aqui do lado, e depois no + no alto da lista. Um artigo em branco abre.",
  },
  {
    titulo: "Preencha de cima para baixo",
    texto:
      "A ordem dos campos é a ordem do trabalho. Embaixo de cada um há uma linha dizendo o que ele espera.",
  },
  {
    titulo: "Gere o endereço",
    texto:
      "No campo Endereço, clique em Generate. Ele monta o link a partir do título. Depois de publicado, não troque: quem salvou o link antigo perde a página.",
  },
  {
    titulo: "Escreva",
    texto:
      "No campo Texto, o menu de estilos tem parágrafo, subtítulo, citação e lista. Não tem cor nem tamanho, e isso é de propósito: a aparência é do site, então nenhum artigo sai com cara diferente do outro. Colar do Word funciona, a formatação do Word é descartada.",
  },
  {
    titulo: "Publique",
    texto:
      "Botão Publish, embaixo à direita. Em dois ou três minutos o texto está no ar, sozinho. Ninguém precisa avisar ninguém.",
  },
];

const CONFERIR = [
  "A chamada diz o que o texto entrega, sem repetir o título com outras palavras. É ela que aparece quando o link vai para o WhatsApp.",
  "Se você pôs capa, a Descrição da imagem está preenchida. É o que quem não enxerga a tela vai ouvir.",
  "Os links do texto abrem o que deveriam. Confira clicando.",
];

export function ComoPublicar() {
  return (
    <PaginaAjuda
      titulo="Como publicar"
      linha="Cinco passos. Leva menos tempo do que escrever o primeiro parágrafo."
    >
      <Stack gap={3}>
        {PASSOS.map((p, i) => (
          <Cartao key={p.titulo} selo={i + 1} titulo={p.titulo}>
            <Linha>{p.texto}</Linha>
          </Cartao>
        ))}
      </Stack>

      <Card
        padding={4}
        radius={3}
        style={{ borderLeft: `4px solid ${TERRACOTA}` }}
      >
        <Stack gap={4}>
          <Text weight="semibold" size={2} style={{ color: TINTA }}>
            Antes de clicar em Publish
          </Text>
          <Stack gap={3} as="ul" style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {CONFERIR.map((c) => (
              <Text key={c} as="li" size={1} muted style={{ lineHeight: 1.6 }}>
                {c}
              </Text>
            ))}
          </Stack>
        </Stack>
      </Card>

      <Stack gap={4}>
        <Text weight="semibold" size={2} style={{ color: TINTA }}>
          Duas coisas que costumam assustar
        </Text>
        <Linha>
          <Forte>Enquanto você não publica, ninguém vê.</Forte> O texto salva
          sozinho a cada letra, e o que está salvo e não publicado é rascunho:
          mora aqui dentro, não aparece no site. Dá para fechar no meio e voltar
          amanhã.
        </Linha>
        <Linha>
          <Forte>Publicar não é para sempre.</Forte> Dá para corrigir, tirar do
          ar e apagar depois, e o texto continua guardado aqui. O passo a passo
          está em <Botao>Depois de publicado</Botao>, aqui do lado.
        </Linha>
      </Stack>

      <Card padding={4} radius={3} style={{ background: TINTA }}>
        <Stack gap={3}>
          <Text size={1} style={{ color: AREIA }}>
            O texto publicado aparece em
          </Text>
          <a
            href="https://casuerio.com.br/revista/"
            target="_blank"
            rel="noreferrer"
            style={{
              color: PAPEL,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            casuerio.com.br/revista
          </a>
        </Stack>
      </Card>
    </PaginaAjuda>
  );
}
