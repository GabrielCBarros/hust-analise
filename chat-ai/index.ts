import fs from "fs";
import {chatAi} from "./chatAi"
import { MensagemFormatado, MensagemModel, MensagemModelFormatado } from "./mensagem.model";

function fetchJSONData() {
  fs.readFile("./Mensagens/messagens.lucas.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    let jsonMensagens: MensagemModel = JSON.parse(data)
  // chatAi(jsonMensagens)
  let mensagensFormatada: MensagemFormatado[] = []
   for (let index = 0; index < jsonMensagens.mensagens.length; index++) {
    const element = jsonMensagens.mensagens[index];
    const mensagemFormatado: MensagemFormatado = {
      mensagem:element.mensagem,
      usuario:element.usuario,
      tipo:element.tipo,
    }

    mensagensFormatada.push(mensagemFormatado)
    
  }
  let mensagemModelFormatado: MensagemModelFormatado = {mensagens: mensagensFormatada}
  console.log(JSON.stringify(mensagemModelFormatado).length)


  });
}

fetchJSONData();