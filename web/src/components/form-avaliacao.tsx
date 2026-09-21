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
import {
  conferirEmail,
  focarPrimeiroErro,
  pedirConsentimento,
  pedirNome,
  pedirTelefone,
  type Erros,
} from "@/lib/validar";

export function FormAvaliacao() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [quartos, setQuartos] = useState<string[]>([]);
  const [vaga, setVaga] = useState<string[]>([]);
  const [ok, setOk] = useState(false);
  const [armadilha, setArmadilha] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const { estado, recado, enviar } = useEnvio("avaliacao");

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
        rua,
        bairro,
        quartos: quartos[0] ?? "",
        vaga: vaga[0] ?? "",
      },
      armadilha,
    );
  }

  if (estado === "pronto") {
    return (
      <Resultado
        estado={estado}
        recado={recado}
        sucesso="Recebido. A gente liga para combinar a visita ao imóvel."
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
          id="avaliacao-nome"
          rotulo="Nome completo"
          autoComplete="name"
          valor={nome}
          aoMudar={setNome}
          erro={erros.nome}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <CampoTexto
            id="avaliacao-telefone"
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
            id="avaliacao-email"
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
          Sobre o seu imóvel
        </h3>
        <CampoTexto
          id="avaliacao-rua"
          rotulo="Rua"
          autoComplete="address-line1"
          opcional
          valor={rua}
          aoMudar={setRua}
          dica="O número a gente combina na visita."
        />
        <CampoTexto
          id="avaliacao-bairro"
          rotulo="Bairro"
          autoComplete="address-level3"
          opcional
          valor={bairro}
          aoMudar={setBairro}
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
      </div>

      <Consentimento marcado={ok} aoMudar={setOk} erro={erros.consentimento} />
      <Resultado estado={estado} recado={recado} sucesso="" />
      <BotaoEnviar estado={estado} texto="Quero avaliar o meu imóvel" />
    </form>
  );
}
