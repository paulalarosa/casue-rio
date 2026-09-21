"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import {
  Armadilha,
  BotaoEnviar,
  CampoTexto,
  Consentimento,
  Resultado,
} from "@/components/campos";
import { Painel } from "@/components/painel";
import { useEnvio } from "@/lib/envio";
import {
  conferirEmail,
  focarPrimeiroErro,
  pedirConsentimento,
  pedirNome,
  type Erros,
} from "@/lib/validar";

export function FormContato() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [ok, setOk] = useState(false);
  const [armadilha, setArmadilha] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const { estado, recado, enviar } = useEnvio("contato");

  function conferir(): Erros {
    const achados: Erros = {};
    pedirNome(nome, achados);
    conferirEmail(email, achados);
    if (!telefone.trim() && !email.trim()) {
      achados.telefone = "Deixe um WhatsApp ou um e-mail para a gente responder.";
    }
    if (mensagem.trim().length < 5)
      achados.mensagem = "Conte em uma linha o que procura.";
    pedirConsentimento(ok, achados);
    return achados;
  }

  async function aoEnviar(e: React.FormEvent) {
    e.preventDefault();
    const achados = conferir();
    setErros(achados);
    if (Object.keys(achados).length) {
      focarPrimeiroErro();
      return;
    }
    await enviar({ nome, telefone, email, mensagem }, armadilha);
  }

  if (estado === "pronto") {
    return (
      <Resultado
        estado={estado}
        recado={recado}
        sucesso="Recado recebido. A gente responde no mesmo dia útil."
      />
    );
  }

  return (
    <form
      onSubmit={aoEnviar}
      className="relative flex max-w-2xl flex-col gap-6"
      noValidate
    >
      <Armadilha valor={armadilha} aoMudar={setArmadilha} />

      <CampoTexto
        id="contato-nome"
        rotulo="Nome"
        autoComplete="name"
        valor={nome}
        aoMudar={setNome}
        erro={erros.nome}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <CampoTexto
          id="contato-telefone"
          rotulo="WhatsApp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          valor={telefone}
          aoMudar={setTelefone}
          erro={erros.telefone}
          dica="Com DDD."
        />
        <CampoTexto
          id="contato-email"
          rotulo="E-mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          valor={email}
          aoMudar={setEmail}
          erro={erros.email}
        />
      </div>

      <CampoTexto
        id="contato-mensagem"
        rotulo="O que você procura"
        area
        placeholder="Bairro, número de quartos, faixa de valor, prazo."
        valor={mensagem}
        aoMudar={setMensagem}
        erro={erros.mensagem}
      />

      <Consentimento marcado={ok} aoMudar={setOk} erro={erros.consentimento} />

      <Painel className="flex gap-3 border-l-4 border-l-areia-500 p-5 text-sm">
        <ShieldCheck className="size-5 shrink-0 text-bronze-500" aria-hidden />
        <span>
          <b className="block text-tinta-800">Não peça documento por aqui.</b>
          Comprovante de renda, RG e certidão a gente recebe em canal próprio, no momento
          certo do processo.
        </span>
      </Painel>

      <Resultado estado={estado} recado={recado} sucesso="" />
      <BotaoEnviar estado={estado} texto="Enviar recado" />
    </form>
  );
}
