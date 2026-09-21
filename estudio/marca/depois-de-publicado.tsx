import { Card, Stack, Text } from "@sanity/ui";
import { ClockIcon } from "@sanity/icons/Clock";
import { EditIcon } from "@sanity/icons/Edit";
import { LinkIcon } from "@sanity/icons/Link";
import { RestoreIcon } from "@sanity/icons/Restore";
import { TrashIcon } from "@sanity/icons/Trash";
import { UnpublishIcon } from "@sanity/icons/Unpublish";
import {
  Botao,
  Cartao,
  Forte,
  Linha,
  PaginaAjuda,
  TERRACOTA,
  TINTA,
} from "./ajuda";

const TAMANHO = { fontSize: 17 };

export function DepoisDePublicado() {
  return (
    <PaginaAjuda
      titulo="Depois de publicado"
      linha="Corrigir, tirar do ar e apagar. Nada aqui é uma porta sem volta, menos uma."
    >
      <Stack gap={3}>
        <Cartao
          selo={<EditIcon style={TAMANHO} />}
          titulo="Corrigir um texto que já está no ar"
        >
          <Linha>
            Clique em Revista, abra o artigo e escreva por cima. Enquanto você
            escreve, o site continua mostrando o texto de antes: a sua alteração
            fica guardada aqui como rascunho, e a lista marca o artigo como{" "}
            <Forte>Edited</Forte>.
          </Linha>
          <Linha>
            Quando estiver pronta, clique em <Botao>Publish</Botao> de novo. É o
            mesmo botão da primeira vez, e é ele que troca o texto do site.
          </Linha>
          <Linha>
            Mudou de ideia antes de publicar? No menu de três pontinhos ao lado
            do Publish, <Botao>Discard changes</Botao> joga fora o rascunho e
            deixa no ar exatamente o que já estava.
          </Linha>
        </Cartao>

        <Cartao
          selo={<LinkIcon style={TAMANHO} />}
          titulo="O endereço é a única coisa que não se mexe"
        >
          <Linha>
            Título, chamada, capa, data e texto: tudo pode mudar depois, quantas
            vezes for preciso. O campo <Forte>Endereço</Forte> é a exceção.
          </Linha>
          <Linha>
            Ele é o link da página. Trocar depois de publicado deixa quem salvou
            o link antigo, e o Google, batendo numa página que não existe mais.
            Se o título mudar muito, deixe o endereço velho quieto: fora da
            barra do navegador, ninguém olha para ele.
          </Linha>
        </Cartao>

        <Cartao
          selo={<UnpublishIcon style={TAMANHO} />}
          titulo="Tirar do ar sem perder o texto"
        >
          <Linha>
            No menu ao lado do Publish, <Botao>Unpublish</Botao>. O artigo sai
            do site e volta a ser rascunho aqui dentro, com tudo escrito no
            lugar. É o caminho de quem publicou sem querer ou quer rever com
            calma.
          </Linha>
          <Linha>Para colocar de volta, é o Publish de sempre.</Linha>
        </Cartao>

        <Cartao selo={<TrashIcon style={TAMANHO} />} titulo="Apagar de vez">
          <Linha>
            No mesmo menu, <Botao>Delete</Botao>. Apaga o artigo inteiro,
            publicado e rascunho. O painel pede confirmação, e depois dela não
            existe botão que traga de volta.
          </Linha>
          <Linha>
            A regra da casa é <Forte>Unpublish primeiro</Forte>. Sai do site na
            mesma hora, o texto continua guardado, e o Delete fica para quando
            ninguém mais sentir falta.
          </Linha>
          <Linha>
            Se o artigo já circulou no WhatsApp ou no Instagram, quem clicar no
            link vai achar página não encontrada. Quando der para corrigir,
            corrigir é melhor do que apagar.
          </Linha>
        </Cartao>

        <Cartao
          selo={<RestoreIcon style={TAMANHO} />}
          titulo="Voltar para uma versão anterior"
        >
          <Linha>
            O painel guarda um histórico das alterações recentes. No alto do
            artigo, <Botao>Review changes</Botao> mostra o que mudou e{" "}
            <Botao>History</Botao> lista as versões.
          </Linha>
          <Linha>
            Abrindo uma versão, <Botao>Revert to revision</Botao> traz aquele
            texto de volta para o rascunho. Ele só vai para o site quando você
            clicar em Publish.
          </Linha>
        </Cartao>
      </Stack>

      <Card
        padding={4}
        radius={3}
        style={{ borderLeft: `4px solid ${TERRACOTA}` }}
      >
        <Stack gap={3}>
          <Text weight="semibold" size={2} style={{ color: TINTA }}>
            <ClockIcon
              style={{ fontSize: 18, verticalAlign: "-3px", marginRight: 6 }}
            />
            Quanto tempo até mudar no site
          </Text>
          <Linha>
            Publicar, corrigir, tirar do ar e apagar avisam o site na hora, e
            ele se reconstrói sozinho. Costuma levar dois ou três minutos.
          </Linha>
          <Linha>
            Se passou meia hora e o site ainda mostra o texto velho, não é você:
            o aviso se perdeu no caminho. Fale com a manutenção, que uma
            republicação resolve.
          </Linha>
        </Stack>
      </Card>
    </PaginaAjuda>
  );
}
