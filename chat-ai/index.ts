import { chatAi } from "./chatAi";
import { Called, MensagemFormatado, MensagemModelFormatado, Message } from "./mensagem.model";
import { CALLED_EXEMPLO_1, CALLED_EXEMPLO_2, MESSAGE_EXEMPLOS_1, MESSAGE_EXEMPLOS_2 } from "./testes";

function init(messagesCalled: Message[], called: Called) {
  let mensagemModelFormatado: MensagemModelFormatado = obterMensagemModelFormatado(messagesCalled);
  mensagemModelFormatado.id_mensagem_whatsapp = String(called.id_chamado);
  console.log("\n\n**********");

  console.log(mensagemModelFormatado.id_mensagem_whatsapp);
  console.log(mensagemModelFormatado.mensagens);
  // chatAi(mensagemModelFormatado);
}

function obterMensagemModelFormatado(messagesCalled: Message[]): MensagemModelFormatado {
  let mensagensFormatada: MensagemFormatado[] = [];
  for (let index = 0; index < messagesCalled.length; index++) {
    const element = messagesCalled[index];
    let msg;
    if (element.type === "audio" || element.type === "image") {
      msg = element.caption;
    } else {
      msg = element.body;
    }

    const mensagemFormatado: MensagemFormatado = {
      mensagem: msg,
      flag_enviado: Number(element.sent),
      tipo: element.type,
    };

    mensagensFormatada.push(mensagemFormatado);
  }
  let mensagemModelFormatado: MensagemModelFormatado = { mensagens: mensagensFormatada, id_mensagem_whatsapp: "" };

  return mensagemModelFormatado;
}
init(MESSAGE_EXEMPLOS_1, CALLED_EXEMPLO_1);
init(MESSAGE_EXEMPLOS_2, CALLED_EXEMPLO_2);

// async function fetchJSONData() {
//   fs.readFile("./Mensagens/messagens.lucas.json", "utf8", (error, data) => {
//     if (error) {
//       console.log(error);
//       return;
//     }
//     let jsonMensagens: MensagemModel = JSON.parse(data);
//     jsonMensagens = ordenarListaMensagens(jsonMensagens);
//     let jsonMensagensFormatado: MensagemModelFormatado = obterJsonMensagensFormatadas(jsonMensagens);
//     chatAi(jsonMensagensFormatado);
//   });
// }

// function obterJsonMensagensFormatadas(jsonMensagens: MensagemModel): MensagemModelFormatado {
//   let mensagensFormatada: MensagemFormatado[] = [];
//   for (let index = 0; index < jsonMensagens.mensagens.length; index++) {
//     const element = jsonMensagens.mensagens[index];
//     let msg;
//     if (element.tipo === "audio") {
//       msg = element.caption;
//     } else {
//       msg = element.mensagem;
//     }

//     const mensagemFormatado: MensagemFormatado = {
//       mensagem: msg,
//       flag_enviado: element.flag_enviado,
//       tipo: element.tipo,
//       id_mensagem_whatsapp: element.id_mensagem_whatsapp,
//     };

//     mensagensFormatada.push(mensagemFormatado);
//   }
//   let mensagemModelFormatado: MensagemModelFormatado = { mensagens: mensagensFormatada };

//   return mensagemModelFormatado;
// }

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

// fetchJSONData();
