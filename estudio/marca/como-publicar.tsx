import { Box, Card, Container, Flex, Heading, Stack, Text } from "@sanity/ui";
import { Placa } from "./placa";

/* A página de ajuda, dentro do próprio painel.

   🔴 Ela existe porque o manual que mora fora do painel não é lido. Um PDF
   no e-mail, um documento no Drive ou uma conversa no WhatsApp respondem a
   dúvida do primeiro dia e somem no segundo. A dúvida volta às nove da noite
   de um domingo, com o painel aberto e ninguém para perguntar. Ajuda que não
   está a um clique do trabalho não é ajuda.

   O texto é curto de propósito: cinco passos e três conferências. Tudo o que
   é sobre um campo específico mora na descrição do campo, embaixo dele, onde
   a dúvida realmente nasce. */

const TERRACOTA = "#a8482a";
const TINTA = "#171310";
const BRONZE = "#8a5a33";

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
    <Box padding={4} paddingY={5} style={{ overflowY: "auto", height: "100%" }}>
      <Container width={1}>
        <Stack gap={5}>
          <Flex align="center" gap={3}>
            <Placa tamanho={40} />
            <Stack gap={2}>
              <Heading
                size={3}
                style={{ fontFamily: '"Unbounded", "Century Gothic", sans-serif', color: TINTA }}
              >
                Como publicar
              </Heading>
              <Text size={1} style={{ color: BRONZE }}>
                Cinco passos. Leva menos tempo do que escrever o primeiro parágrafo.
              </Text>
            </Stack>
          </Flex>

          <Stack gap={3}>
            {PASSOS.map((p, i) => (
              <Card key={p.titulo} padding={4} radius={3} shadow={1}>
                <Flex gap={4} align="flex-start">
                  <Box
                    style={{
                      flex: "none",
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      background: TERRACOTA,
                      color: "#f6f2e9",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 700,
                      fontSize: 14,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Stack gap={3} flex={1}>
                    <Text weight="semibold" size={2} style={{ color: TINTA }}>
                      {p.titulo}
                    </Text>
                    <Text size={1} muted style={{ lineHeight: 1.6 }}>
                      {p.texto}
                    </Text>
                  </Stack>
                </Flex>
              </Card>
            ))}
          </Stack>

          <Card padding={4} radius={3} style={{ borderLeft: `4px solid ${TERRACOTA}` }}>
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
            <Text size={1} muted style={{ lineHeight: 1.6 }}>
              <b style={{ color: TINTA }}>Enquanto você não publica, ninguém vê.</b> O texto
              salva sozinho a cada letra, e o que está salvo e não publicado é rascunho: mora
              aqui dentro, não aparece no site. Dá para fechar no meio e voltar amanhã.
            </Text>
            <Text size={1} muted style={{ lineHeight: 1.6 }}>
              <b style={{ color: TINTA }}>Publicar não é para sempre.</b> Para tirar do ar,
              abra o texto e use o menu ao lado do botão Publish, na opção Unpublish. Ele volta
              a ser rascunho, com tudo escrito no lugar.
            </Text>
          </Stack>

          <Card padding={4} radius={3} style={{ background: TINTA }}>
            <Stack gap={3}>
              <Text size={1} style={{ color: "#c0ac87" }}>
                O texto publicado aparece em
              </Text>
              <a
                href="https://casuerio.com.br/revista/"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#f6f2e9",
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
        </Stack>
      </Container>
    </Box>
  );
}
