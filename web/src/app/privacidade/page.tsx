import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ENDERECO, NOME, SOCIAS, metaDaPagina } from "@/lib/site";
import { AcaoEmail } from "@/components/acao";
import { EscolhaDeCookies } from "@/components/medicao";
import { temMedicao } from "@/lib/medicao";

export const metadata = metaDaPagina({
  titulo: "Privacidade",
  descricao:
    "O que a Casuê Rio faz com os seus dados. O site não coleta nada de quem visita: o que existe chega por e-mail e WhatsApp, e é disso que esta página trata.",
  caminho: "/privacidade",
});

const ATUALIZADA = "18 de setembro de 2026";

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="text-[clamp(1.4rem,2.4vw,1.85rem)] leading-tight">{titulo}</h2>
      <div className="mt-5 space-y-4 text-lg leading-relaxed text-tinta-500">
        {children}
      </div>
    </section>
  );
}

const elo =
  "font-semibold text-terracota-600 underline underline-offset-4 transition-colors hover:text-terracota-700";
const lista = "space-y-3 border-l-2 border-tinta-800/12 pl-6";

export default function PaginaPrivacidade() {
  return (
    <article
      className="trilho max-w-[68ch] pb-8"
      style={{ paddingTop: "calc(var(--altura-topo) + 1.75rem)" }}
    >
      <nav aria-label="Trilha" className="text-sm text-tinta-500">
        <Link
          href="/"
          className="inline-flex items-center gap-2 transition-colors hover:text-tinta-800"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Início
        </Link>
      </nav>

      <header className="mt-8">
        <h1 className="text-[clamp(2rem,4.6vw,3.2rem)] leading-[1.05]">Privacidade</h1>
        <p className="rotulo mt-6 text-bronze-500">
          Atualizada em <span className="num">{ATUALIZADA}</span>
        </p>
      </header>

      <p className="mt-10 text-xl leading-relaxed text-tinta-500">
        Este site não coleta nada de quem visita. Não há formulário, não há cookie e não
        há rastreador. O que existe de dado pessoal na Casuê Rio chega por e-mail,
        WhatsApp e Instagram, e é disso que esta página trata.
      </p>

      <Bloco titulo="Quem é responsável">
        <p>
          {NOME}, com escritório na {ENDERECO.rua}, {ENDERECO.complemento},{" "}
          {ENDERECO.bairro}, {ENDERECO.cidade}, {ENDERECO.estado},{" "}
          <span className="num">{ENDERECO.cep}</span>. As responsáveis são{" "}
          {SOCIAS.map((s) => s.nome).join(" e ")}, corretoras inscritas no CRECI/RJ sob os
          números{" "}
          <span className="num">
            {SOCIAS.map((s) => s.creci.replace("CRECI/RJ ", "")).join(" e ")}
          </span>
          .
        </p>
        <p>
          Para qualquer assunto desta página, inclusive pedir os seus dados de volta ou
          pedir que sejam apagados, é por e-mail.
        </p>
        <p>
          <AcaoEmail
            recuo="/contato/"
            className="inline-flex items-center rounded-full bg-tinta-800 px-6 py-3 font-semibold text-papel transition-transform duration-300 hover:-translate-y-0.5"
          >
            Escrever para a Casuê Rio
          </AcaoEmail>
        </p>
      </Bloco>

      <Bloco titulo="O que o site faz, e o que não faz">
        <p>Conferido em {ATUALIZADA}, página por página:</p>
        <ul className={lista}>
          <li>
            Não existe formulário. Todo contato sai do site para o e-mail ou para o
            WhatsApp.
          </li>
          {temMedicao ? (
            <>
              <li>
                Usamos o Google Analytics para contar visitas, e só depois de você
                aceitar. Sem o aceite, ele não carrega e nenhum cookie é criado.
              </li>
              <li>Não há pixel de rede social nem ferramenta de publicidade.</li>
            </>
          ) : (
            <>
              <li>Não usamos cookie, nem para preferência, nem para medição.</li>
              <li>
                Não há Google Analytics, pixel de rede social nem qualquer ferramenta de
                audiência.
              </li>
            </>
          )}
          <li>
            As fontes são servidas do nosso próprio endereço, então o seu navegador não
            pede nada ao Google para desenhar esta página.
          </li>
          <li>
            O servidor não guarda registro de acesso. O que é entregue não fica anotado em
            lugar nenhum.
          </li>
        </ul>
        <p>
          Duas coisas acontecem mesmo assim, e é justo que você saiba. O site é hospedado
          na Amazon Web Services: para entregar a página ao seu navegador, a
          infraestrutura deles processa o seu endereço de IP, como em qualquer site da
          internet. E as fotos dos textos da{" "}
          <Link href="/revista" className={elo}>
            Revista
          </Link>{" "}
          são entregues pela Sanity, empresa que hospeda o painel onde eles são escritos:
          ao abrir a Revista, o seu navegador pede as imagens a eles, que recebem o seu IP
          e o seu navegador. Os servidores das duas ficam fora do Brasil.
        </p>
      </Bloco>

      <Bloco titulo="O que recebemos quando você fala com a gente">
        <p>
          Quando você escreve por e-mail, manda mensagem no WhatsApp ou no Instagram, ou
          liga, chega o que você contar: nome, forma de contato e o que procura, quer
          vender ou quer alugar.
        </p>
        <p>
          Se a negociação avançar, o negócio passa a exigir mais: estado civil, profissão,
          comprovação de renda e documentos pessoais, porque é isso que cartório, banco e
          a outra parte pedem para uma compra, uma venda ou uma locação existirem no
          papel.
        </p>
        <p className="border-l-4 border-terracota-600 pl-6 font-display text-xl leading-relaxed font-semibold text-tinta-800">
          Documento e CPF só entram quando existe proposta ou contrato. Nunca para tirar
          uma dúvida, nunca para ver um imóvel.
        </p>
      </Bloco>

      <Bloco titulo="Para que usamos">
        <ul className={lista}>
          <li>Responder você e continuar a conversa.</li>
          <li>Procurar imóvel, avaliar imóvel e preparar visita.</li>
          <li>Montar proposta, contrato, escritura e registro.</li>
          <li>
            Cumprir o que a lei, o fisco e o conselho profissional exigem de quem
            intermedeia negócio imobiliário.
          </li>
        </ul>
        <p>
          Não usamos o seu dado para nada além disso. Você não entra em lista de disparo
          por ter pedido uma informação.
        </p>
      </Bloco>

      <Bloco titulo="Com que apoio na lei">
        <p>
          A Lei Geral de Proteção de Dados, a 13.709 de 2018, pede que quem trata dado
          pessoal diga em que se apoia. No nosso caso:
        </p>
        <ul className={lista}>
          <li>
            Para atender você e preparar o negócio: execução de contrato e dos
            procedimentos que vêm antes dele, a pedido seu.
          </li>
          <li>
            Para guardar o que a lei manda guardar: cumprimento de obrigação legal e
            regulatória.
          </li>
          <li>
            Para manter o histórico da conversa e retomá-la quando fizer sentido: legítimo
            interesse, que você pode contestar a qualquer momento.
          </li>
        </ul>
      </Bloco>

      <Bloco titulo="Com quem compartilhamos">
        <p>
          Só com quem o próprio negócio exige, e só o necessário: a outra parte da
          negociação, cartório de notas e registro de imóveis, banco quando há
          financiamento, administradora do condomínio, e advogado ou contador quando você
          ou a outra parte contrata um.
        </p>
        <p>
          Não vendemos, não trocamos e não cedemos dado seu para ninguém fazer
          publicidade.
        </p>
      </Bloco>

      <Bloco titulo="Por quanto tempo guardamos">
        <ul className={lista}>
          <li>
            <b className="font-semibold text-tinta-800">
              Conversa que não virou negócio: <span className="num">2 anos</span> sem
              contato
            </b>
            , e depois apagamos. Antes disso, é só pedir e apagamos na hora.
          </li>
          <li>
            <b className="font-semibold text-tinta-800">
              Documento fiscal: <span className="num">5 anos</span>
            </b>
            , contados do ano seguinte ao da emissão. É o prazo que o Código Tributário
            Nacional dá ao fisco para cobrar, e guardar menos que isso é ficar sem como
            provar o que já foi pago.
          </li>
          <li>
            <b className="font-semibold text-tinta-800">
              Contrato e documento de negócio fechado:{" "}
              <span className="num">10 anos</span>
            </b>{" "}
            a partir do fim do contrato. É o prazo geral de prescrição do Código Civil, ou
            seja, o tempo em que aquele negócio ainda pode ser discutido na Justiça.
          </li>
        </ul>
        <p>
          Os dois últimos prazos não são escolha nossa, e por isso um pedido de apagar não
          alcança esses documentos enquanto o prazo correr. Vencido, o documento é
          descartado.
        </p>
      </Bloco>

      {temMedicao && (
        <Bloco titulo="Medição de audiência e cookies">
          <p>
            Usamos o Google Analytics para saber quantas pessoas visitam o site e quais
            páginas elas leem. Ele não nos diz quem você é: o que chega é contagem,
            página, origem da visita e o seu endereço de IP, que pedimos ao Google para
            encurtar antes de guardar.
          </p>
          <p>
            <b className="font-semibold text-tinta-800">
              Nada disso carrega antes de você aceitar.
            </b>{" "}
            Até o seu aceite, o site não pede uma linha ao Google e não cria cookie
            nenhum. Aceitando, o Google cria cookies no seu navegador para não contar a
            mesma pessoa duas vezes, e eles são dele, não nossos. O Google trata esses
            dados nos servidores dele, fora do Brasil.
          </p>
          <p>
            A base legal aqui é o seu consentimento, e consentimento se tira com a mesma
            facilidade com que se dá:
          </p>
          <EscolhaDeCookies />
          <p>
            A sua resposta fica guardada só neste navegador e não é enviada a ninguém. Em
            outro aparelho, perguntamos de novo.
          </p>
        </Bloco>
      )}

      <Bloco titulo="O que você pode exigir">
        <p>A LGPD dá a você, sobre os seus dados, o direito de pedir:</p>
        <ul className={lista}>
          <li>a confirmação de que existe tratamento, e o acesso ao que temos;</li>
          <li>a correção do que estiver incompleto, desatualizado ou errado;</li>
          <li>
            a eliminação, o bloqueio ou a anonimização do que for desnecessário ou
            excessivo;
          </li>
          <li>a portabilidade para outro fornecedor;</li>
          <li>a informação sobre com quem compartilhamos;</li>
          <li>a revogação do consentimento, quando foi ele que autorizou;</li>
          <li>a explicação de por que negamos algum desses pedidos, se negarmos.</li>
        </ul>
        <p>
          O caminho é o mesmo para tudo: escrever por e-mail, no botão lá em cima.
          Respondemos por escrito, e se não pudermos atender, explicamos por quê. Você
          também pode reclamar à Autoridade Nacional de Proteção de Dados, a ANPD.
        </p>
      </Bloco>

      <Bloco titulo="Segurança">
        <p>
          Dado seu fica nas contas de trabalho das corretoras, com senha e verificação em
          duas etapas, e é visto por elas duas. Não prometemos que nada pode dar errado,
          porque ninguém honesto promete isso. O que prometemos é que, se algo acontecer
          com dado seu, você será avisado.
        </p>
      </Bloco>

      <Bloco titulo="Criança e adolescente">
        <p>
          Não tratamos dados de menores de idade de propósito. Quando um menor aparece
          numa negociação, como herdeiro ou dependente, os dados vêm de quem responde
          legalmente por ele e servem só para aquele negócio.
        </p>
      </Bloco>

      <Bloco titulo="Se esta página mudar">
        <p>
          A data no alto é a da última alteração. Mudança que afete você de verdade não
          fica só aqui: avisamos por e-mail quem estiver em negociação conosco.
        </p>
      </Bloco>
    </article>
  );
}
