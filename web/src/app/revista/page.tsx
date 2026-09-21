import { ArrowRight, AtSign } from "lucide-react";
import { CabecaPagina } from "@/components/cabeca-pagina";
import { Revela } from "@/components/entrada";
import { Painel } from "@/components/painel";
import { CartaoArtigo, DestaqueArtigo } from "@/components/cartao-artigo";
import { cn } from "@/lib/utils";
import { arquivo } from "@/lib/caminho";
import posterEscrivaninha from "../../../public/video/escrivaninha.webp";
import { listarArtigos } from "@/lib/revista";
import { Dados } from "@/components/dados";
import { revista, trilha, grafo } from "@/lib/dados-estruturados";
import { INSTAGRAM, INSTAGRAM_URL, metaDaPagina } from "@/lib/site";

export const metadata = metaDaPagina({
  titulo: "Revista",
  descricao:
    "O que a Casuê Rio escreve sobre comprar, vender e alugar no Rio: documentação, bairro por bairro e o que muda o preço de um imóvel.",
  caminho: "/revista",
});

const ASSUNTOS = [
  {
    titulo: "O que a matrícula conta",
    texto:
      "Inventário em aberto, penhora, dívida de condomínio e obra sem averbação: o que aparece no papel e não aparece na visita.",
  },
  {
    titulo: "Bairro por bairro",
    texto:
      "O que muda de uma rua para a outra no Centro, na Tijuca e na Zona Sul, e por que o mesmo metro quadrado custa dois preços.",
  },
  {
    titulo: "Quanto vale, e por quê",
    texto:
      "Como um parecer de avaliação chega a um número, e o que realmente pesa: andar, vaga, conservação e comparável de verdade.",
  },
];

export default async function PaginaRevista() {
  const materias = await listarArtigos();

  return (
    <>
      {materias.length > 0 && (
        <Dados>
          {grafo(
            revista(materias),
            trilha([
              { nome: "Início", caminho: "/" },
              { nome: "Revista", caminho: "/revista/" },
            ]),
          )}
        </Dados>
      )}
      <CabecaPagina
        titulo="Revista"
        linha="O que a gente aprende trabalhando, escrito por quem assina o contrato."
        video={{ fonte: arquivo("/video/escrivaninha.mp4"), poster: posterEscrivaninha }}
        trilha={[{ href: "/", texto: "Início" }, { texto: "Revista" }]}
      />
      <p className="trilho mt-3 text-sm text-tinta-500">
        Imagem de ambiente. Não retrata imóvel anunciado.
      </p>

      {materias.length > 0 ? (
        <Revela className="trilho secao space-y-20">
          <DestaqueArtigo materia={materias[0]} />
          {materias.length > 1 && (
            <div
              className={cn(
                "grid gap-x-8 gap-y-12 border-t border-tinta-800/12 pt-16",
                materias.length > 3 ? "md:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
              )}
            >
              {materias.slice(1).map((m) => (
                <CartaoArtigo key={m.slug} materia={m} />
              ))}
            </div>
          )}
        </Revela>
      ) : (
        <Revela className="trilho secao">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div data-revela>
              <h2 className="max-w-[18ch] text-[clamp(1.8rem,3.4vw,2.75rem)] leading-[1.1]">
                O primeiro texto ainda não saiu.
              </h2>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-tinta-500">
                A revista vai ser escrita por elas, sobre o que aparece no trabalho de
                verdade. Enquanto o primeiro não sai, o que já existe está no Instagram.
              </p>
              {INSTAGRAM && (
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-tinta-800 px-6 py-3 font-semibold text-papel shadow-[var(--shadow-flutua-2)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <AtSign className="size-4" aria-hidden />
                  {INSTAGRAM}
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              )}
            </div>

            <Painel data-revela className="p-8 sm:p-10">
              <span className="rotulo text-bronze-500">O que vem aí</span>
              <ul className="mt-6 space-y-7">
                {ASSUNTOS.map((a) => (
                  <li key={a.titulo} className="border-t border-tinta-800/12 pt-5">
                    <h3 className="font-display text-xl leading-tight">{a.titulo}</h3>
                    <p className="mt-2 text-tinta-500">{a.texto}</p>
                  </li>
                ))}
              </ul>
            </Painel>
          </div>
        </Revela>
      )}
    </>
  );
}
