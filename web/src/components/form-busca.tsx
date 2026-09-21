"use client";

import { useState } from "react";
import {
  Armadilha,
  BotaoEnviar,
  CampoTexto,
  Consentimento,
  Pastilhas,
  Resultado,
} from "@/components/campos";
import { useEnvio } from "@/lib/envio";
import { BAIRROS_DE_ATENDIMENTO } from "@/lib/site";
import {
  conferirEmail,
  focarPrimeiroErro,
  pedirConsentimento,
  pedirNome,
  pedirTelefone,
  type Erros,
} from "@/lib/validar";

export function FormBusca() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [bairros, setBairros] = useState<string[]>([]);
  const [quartos, setQuartos] = useState<string[]>([]);
  const [vaga, setVaga] = useState<string[]>([]);
  const [detalhes, setDetalhes] = useState("");
  const [ok, setOk] = useState(false);
  const [armadilha, setArmadilha] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const { estado, recado, enviar } = useEnvio("busca");

  async function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    const achados: Erros = {};
    pedirNome(nome, achados);
    pedirTelefone(telefone, achados);
    conferirEmail(email, achados);
    pedirConsentimento(ok, achados);
    setErros(achados);
    if (Object.keys(achados).length) {
      focarPrimeiroErro();
      return;
    }
    await enviar(
      {
        nome,
        telefone,
        email,
        bairros,
        quartos: quartos[0] ?? "",
        vaga: vaga[0] ?? "",
        detalhes,
      },
      armadilha,
    );
  }

  if (estado === "pronto") {
    return (
      <Resultado
        estado={estado}
        recado={recado}
        sucesso="Anotado. A busca começa hoje, e a gente volta assim que tiver o que mostrar."
      />
    );
  }

  return (
    <form onSubmit={aoEnviar} className="relative flex flex-col gap-10" noValidate>
      <Armadilha valor={armadilha} aoMudar={setArmadilha} />

      <div className="flex flex-col gap-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-bronze-500">
          Para a gente falar com você
        </h3>
        <CampoTexto
          id="busca-nome"
          rotulo="Nome completo"
          autoComplete="name"
          valor={nome}
          aoMudar={setNome}
          erro={erros.nome}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <CampoTexto
            id="busca-telefone"
            rotulo="Telefone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            valor={telefone}
            aoMudar={setTelefone}
            erro={erros.telefone}
            dica="Com DDD."
          />
          <CampoTexto
            id="busca-email"
            rotulo="E-mail"
            type="email"
            inputMode="email"
            autoComplete="email"
            opcional
            valor={email}
            aoMudar={setEmail}
            erro={erros.email}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-bronze-500">
          Sobre o imóvel que você procura
        </h3>
        <Pastilhas
          rotulo="Bairros"
          opcoes={BAIRROS_DE_ATENDIMENTO}
          escolhidas={bairros}
          aoTrocar={setBairros}
          varias
          opcional
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <Pastilhas
            rotulo="Quartos"
            opcoes={["1", "2", "3"]}
            escolhidas={quartos}
            aoTrocar={setQuartos}
            opcional
          />
          <Pastilhas
            rotulo="Vagas"
            opcoes={["0", "1", "2"]}
            escolhidas={vaga}
            aoTrocar={setVaga}
            opcional
          />
        </div>
        <CampoTexto
          id="busca-detalhes"
          rotulo="Nos conte os detalhes que fazem diferença"
          area
          opcional
          placeholder="Andar alto, sol da manhã, perto do metrô, aceita reforma, prazo para mudar."
          valor={detalhes}
          aoMudar={setDetalhes}
        />
      </div>

      <Consentimento marcado={ok} aoMudar={setOk} erro={erros.consentimento} />
      <Resultado estado={estado} recado={recado} sucesso="" />
      <BotaoEnviar estado={estado} texto="Quero que busquem para mim" />
    </form>
  );
}
