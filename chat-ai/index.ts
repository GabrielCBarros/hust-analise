import fs from "fs";
import { chatAi } from "./chatAi";
import { MensagemFormatado, MensagemModel, MensagemModelFormatado } from "./mensagem.model";
import { MAX_TOKENS } from "./config";
import { deletarTudoComplaint, deletarTudoPraise, deletarTudoSugestoes, obterComplaint, obterSugestoes, obterPraise } from "./bd";

async function fetchJSONData() {
  // fs.readFile("./Mensagens/messagens.lucas.json", "utf8", (error, data) => {
  //   if (error) {
  //     console.log(error);
  //     return;
  //   }
  //   let jsonMensagens: MensagemModel = JSON.parse(data);
  //   jsonMensagens = ordenarListaMensagens(jsonMensagens);
  //   let jsonMensagensFormatado: MensagemModelFormatado = obterJsonMensagensFormatadas(jsonMensagens);
  //   chatAi(jsonMensagensFormatado);
  // });

  const res = await obterComplaint();
  console.log(res);
}

function obterJsonMensagensFormatadas(jsonMensagens: MensagemModel): MensagemModelFormatado {
  let mensagensFormatada: MensagemFormatado[] = [];
  for (let index = 0; index < jsonMensagens.mensagens.length; index++) {
    const element = jsonMensagens.mensagens[index];
    const mensagemFormatado: MensagemFormatado = {
      mensagem: element.tipo === "audio" ? element.caption : element.mensagem,
      flag_enviado: element.flag_enviado,
      tipo: element.tipo,
      id_mensagem_whatsapp: element.id_mensagem_whatsapp,
    };

    mensagensFormatada.push(mensagemFormatado);
  }
  let mensagemModelFormatado: MensagemModelFormatado = { mensagens: mensagensFormatada };

  return mensagemModelFormatado;
}

function ordenarListaMensagens(jsonMensagens: MensagemModel): MensagemModel {
  const retornoMensagemModel: MensagemModel = { mensagens: [] };

  let index = jsonMensagens.mensagens.length - 1;
  while (index >= 0) {
    if (jsonMensagens.mensagens[index].data === jsonMensagens.mensagens[index - 1]?.data) {
      if (jsonMensagens.mensagens[index].flag_enviado === 1) {
        retornoMensagemModel.mensagens.push(jsonMensagens.mensagens[index - 1]);
        retornoMensagemModel.mensagens.push(jsonMensagens.mensagens[index]);
      } else {
        retornoMensagemModel.mensagens.push(jsonMensagens.mensagens[index]);
        retornoMensagemModel.mensagens.push(jsonMensagens.mensagens[index - 1]);
      }

      index -= 2;
    } else {
      retornoMensagemModel.mensagens.push(jsonMensagens.mensagens[index]);
      index--;
    }
  }

  return retornoMensagemModel;
}

fetchJSONData();
