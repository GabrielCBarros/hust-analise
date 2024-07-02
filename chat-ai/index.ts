import axios from "axios";
import { chatAi } from "./chatAi";
import { AnaliseMensagensJson, Called, MensagemFormatado, MensagemModelFormatado, Message } from "./mensagem.model";
import { MAX_TOKENS, TOKEN_MENSAGEM_JSON } from "./config";

const API_BASE = "https://apiv1.hustapp.com";
const TOKEN = "PRG15Kdo60KCnMkjuKwx9RlwSxes33OPM5jMG4jUK1FrUTdZs0";
function convertDate(datestring: string): string {
  const date = new Date(datestring);
  return (
    date.getDate().toString().padStart(2, "0") +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date.getFullYear() +
    " " +
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0") +
    ":" +
    date.getSeconds().toString().padStart(2, "0")
  );
}

function dividirMensagens(messages: string[]): string[] {
  const listaDeMensagensParaEnviar: string[] = [];

  let blocoDeMensagem: string[] = [];

  let somatoria = 0;
  for (let index = 0; index < messages.length; index++) {
    const mensagem = messages[index];
    const tamMensagemAtual = JSON.stringify(mensagem).length;

    if (somatoria + tamMensagemAtual <= MAX_TOKENS) {
      blocoDeMensagem.push(mensagem);
      somatoria += tamMensagemAtual;

      if (index === messages.length - 1) {
        const model: MensagemModelFormatado = { mensagens: blocoDeMensagem };
        listaDeMensagensParaEnviar.push(TOKEN_MENSAGEM_JSON + JSON.stringify(model));
      }
    } else {
      const model: MensagemModelFormatado = { mensagens: blocoDeMensagem };
      listaDeMensagensParaEnviar.push(TOKEN_MENSAGEM_JSON + JSON.stringify(model));

      blocoDeMensagem = [];

      blocoDeMensagem.push(mensagem);
      somatoria = tamMensagemAtual;
    }
  }

  return listaDeMensagensParaEnviar;
}

async function getCalleds() {
  const calledPostData = {
    token: TOKEN,
    periodoInicial: "2024-04-01T00:00:00", // Período de início
    periodoFinal: "2024-05-15T23:59:59", // Período Final
    status: "atendimento", // Aqui tem que mudar p retornar todos
    dateFilterType: "start",
  };
  const {
    data: { chamados },
  } = await axios.post(`${API_BASE}/v1/chamado/getChamados`, calledPostData);
  return chamados;
}

async function getCalledMessages(idChamado: number) {
  const { data } = await axios.get(`${API_BASE}/v2/called/${idChamado}/messages`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
}

const getMessageText = (message: Message, onlyReceived = true): string => {
  let { body } = message;
  const { type, sent, caption, user, date } = message;
  if (!["image", "audio", "chat"].includes(type)) return "";

  if (type === "image") body = `Imagem (Legenda: ${caption})`;
  if (type === "audio") body = `Áudio (Transcrição: ${caption})`;
  if (!body && !caption) return "";

  const identifier = sent ? `Empresa por ${(user && user.name) || "BOT"}` : "Cliente";
  const dateFormated = convertDate(date);
  // const dateFormatedRAW = convertDate(date, true, true);
  let text = (body || caption || "").split(`\n`).join(` `);
  if (user && user.name) {
    text = text
      .split(user && `${user.name}*:`)
      .slice(1)
      .join(user && user.name)
      .trim();
  }

  if (onlyReceived) return `(${dateFormated}): ${text.split("\n").join(" ")}`;
  return `${identifier} (${dateFormated}): ${text}`;
};

const jsonFormat = JSON.stringify({
  sugestoes: ["STRING"],
  elogios: [],
  reclamacoes: ["STRING", "STRING"],
});

(async () => {
  // const calleds = await getCalleds();
  const calleds = [{ id_chamado: 6453062 }];

  for (const called of calleds) {
    const messagesCalled = await getCalledMessages(called.id_chamado);

    const messages: string[] = messagesCalled.map((prop: Message) => getMessageText(prop, false));

    if (messages.length < 3) {
      console.log("Poucas mensagens para analizar");
      continue;
    }

    // ...... Processamento ......
    let listaMensagemEmBloco: string[] = dividirMensagens(messages);
    const analiseMensagensJson: AnaliseMensagensJson = await chatAi(listaMensagemEmBloco);

    // Final do prompt
    console.log("Mensagens:\n", messages);
    console.log("\n\nAnálise em JSON:\n", analiseMensagensJson);
    // .....
  }
})();

// function obterMensagemModelFormatado(messagesCalled: Message[]): MensagemModelFormatado {
//   let mensagensFormatada: MensagemFormatado[] = [];
//   for (let index = 0; index < messagesCalled.length; index++) {
//     const element = messagesCalled[index];
//     let msg;
//     if (element.type === "audio" || element.type === "image") {
//       msg = element.caption;
//     } else {
//       msg = element.body;
//     }

//     const mensagemFormatado: MensagemFormatado = {
//       mensagem: msg,
//       flag_enviado: Number(element.sent),
//       tipo: element.type,
//     };

//     mensagensFormatada.push(mensagemFormatado);
//   }
//   let mensagemModelFormatado: MensagemModelFormatado = { mensagens: mensagensFormatada, id_mensagem_whatsapp: "" };

//   return mensagemModelFormatado;
// }
// async function salvarMensagemNoBancoDeDados(analiseMensagem: AnaliseMensagensJson, id_conversa: string) {
//   for (let index = 0; index < analiseMensagem.complaint.length; index++) {
//     await inserirComplaint(id_conversa, analiseMensagem.complaint[index]);
//   }

//   for (let index = 0; index < analiseMensagem.praise.length; index++) {
//     await inserirPraise(id_conversa, analiseMensagem.praise[index]);
//   }

//   for (let index = 0; index < analiseMensagem.suggestion.length; index++) {
//     await inserirSugestao(id_conversa, analiseMensagem.suggestion[index]);
//     const resultadoSugestao = await obterSugestoes();
//     console.log(resultadoSugestao);
//   }
// }
// function dividirMensagens(jsonMensagensFormatado: MensagemModelFormatado): string[] {
//   const listaDeMensagensParaEnviar: string[] = [];

//   let blocoDeMensagem: MensagemFormatado[] = [];

//   let somatoria = 0;
//   for (let index = 0; index < jsonMensagensFormatado.mensagens.length; index++) {
//     const mensagem = jsonMensagensFormatado.mensagens[index];
//     const tamMensagemAtual = JSON.stringify(mensagem).length;

//     if (somatoria + tamMensagemAtual <= MAX_TOKENS) {
//       blocoDeMensagem.push(mensagem);
//       somatoria += tamMensagemAtual;

//       if (index === jsonMensagensFormatado.mensagens.length - 1) {
//         const model: MensagemModelFormatado = { mensagens: blocoDeMensagem, id_mensagem_whatsapp: jsonMensagensFormatado.id_mensagem_whatsapp };
//         listaDeMensagensParaEnviar.push(TOKEN_MENSAGEM_JSON + JSON.stringify(model));
//       }
//     } else {
//       const model: MensagemModelFormatado = { mensagens: blocoDeMensagem, id_mensagem_whatsapp: jsonMensagensFormatado.id_mensagem_whatsapp };
//       listaDeMensagensParaEnviar.push(TOKEN_MENSAGEM_JSON + JSON.stringify(model));

//       blocoDeMensagem = [];

//       blocoDeMensagem.push(mensagem);
//       somatoria = tamMensagemAtual;
//     }
//   }

//   return listaDeMensagensParaEnviar;
// }
// init(MESSAGE_EXEMPLOS_1, CALLED_EXEMPLO_1);
// init(MESSAGE_EXEMPLOS_2, CALLED_EXEMPLO_2);

// function ordenarListaMensagens(jsonMensagens: MensagemModel): MensagemModel {
//   const retornoMensagemModel: MensagemModel = { mensagens: [] };

//   let index = jsonMensagens.mensagens.length - 1;
//   while (index >= 0) {
//     if (jsonMensagens.mensagens[index].data === jsonMensagens.mensagens[index - 1]?.data) {
//       if (jsonMensagens.mensagens[index].flag_enviado === 1) {
//         retornoMensagemModel.mensagens.push(jsonMensagens.mensagens[index - 1]);
//         retornoMensagemModel.mensagens.push(jsonMensagens.mensagens[index]);
//       } else {
//         retornoMensagemModel.mensagens.push(jsonMensagens.mensagens[index]);
//         retornoMensagemModel.mensagens.push(jsonMensagens.mensagens[index - 1]);
//       }

//       index -= 2;
//     } else {
//       retornoMensagemModel.mensagens.push(jsonMensagens.mensagens[index]);
//       index--;
//     }
//   }

//   return retornoMensagemModel;
// }
