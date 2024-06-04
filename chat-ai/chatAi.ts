import { LlamaChatSession, LlamaContext, LlamaModel } from "node-llama-cpp";
import path from "path";
import { fileURLToPath } from "url";
import {
  CONFIG_IA_INFORMACAO_SOBRE_COMO_ANALISAR,
  CONFIG_IA_INFORMACAO_SOBRE_AS_MENSAGENS,
  MAX_TOKENS,
  TOKEN_MENSAGEM_JSON,
  CONFIG_IA_INFORMACAO_SOBRE_COMO_RESPONDER,
} from "./config";
import { MensagemModelFormatado, AnaliseMensagensJson, MensagemFormatado } from "./mensagem.model";
import { inserirComplaint } from "./bd";
import { inserirPraise } from "./bd";
import { inserirSugestao } from "./bd";
import { obterSugestoes } from "./bd";
export async function chatAi(jsonMensagensFormatado: MensagemModelFormatado): Promise<void> {
  // model name
  const MODEL_NAME = "mistral-7b-instruct-v0.2.Q5_K_M.gguf";
  // const MODEL_NAME = "llama-2-7b.Q5_K_M.gguf";

  // get the models directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const modelsDirectory = path.join(__dirname, "../models");
  const modelsPath = path.join(modelsDirectory, MODEL_NAME);

  const model = new LlamaModel({
    modelPath: modelsPath,
  });

  const context = new LlamaContext({ model });
  const session = new LlamaChatSession({ context });

  let respostaAi = "";

  // PRECONFIG_IA
  // console.log("\n============================");
  // respostaAi = await session.prompt(PRECONFIG_IA);
  // console.log("resposta PRECONFIG", respostaAi);

  //CONFIG_IA
  console.log("\n\n==============  CONFIG  ==============");
  const listaConfig = [CONFIG_IA_INFORMACAO_SOBRE_AS_MENSAGENS, CONFIG_IA_INFORMACAO_SOBRE_COMO_ANALISAR, CONFIG_IA_INFORMACAO_SOBRE_COMO_RESPONDER];

  for (let i = 0; i < listaConfig.length; i++) {
    respostaAi = await session.prompt(listaConfig[i]);
    console.log("resposta config", respostaAi);
  }

  //JSONMENSAGENS
  console.log("\n\n==============  MENSAGENS ==============");
  const listaMensagens = dividirMensagens(jsonMensagensFormatado);
  let analiseMensagem: AnaliseMensagensJson = {
    complaint: [],
    suggestion: [],
    praise: [],
  };
  for (let index = 0; index < listaMensagens.length; index++) {
    console.log("\n\n\n - - - - - - - - - - - - - - - - - - - - - - - - - - - ");
    respostaAi = await session.prompt(listaMensagens[index]);
    console.log("\n\n\n******************* ----------------------- *******************");
    console.log("resposta mensagens", respostaAi);
    // var mySubString = respostaAi.substring(respostaAi.indexOf("```json") + 7, respostaAi.lastIndexOf("```"));
    const retornoJson: AnaliseMensagensJson = JSON.parse(respostaAi);
    analiseMensagem.complaint.push(...retornoJson.complaint);
    analiseMensagem.praise.push(...retornoJson.praise);
    analiseMensagem.suggestion.push(...retornoJson.suggestion);
  }
  console.log("Analise de mensagens", analiseMensagem);

  const id_conversa = extrairTelefone(jsonMensagensFormatado.mensagens[0].id_mensagem_whatsapp);

  for (let index = 0; index < analiseMensagem.complaint.length; index++) {
    await inserirComplaint(id_conversa, analiseMensagem.complaint[index]);
  }

  for (let index = 0; index < analiseMensagem.praise.length; index++) {
    await inserirPraise(id_conversa, analiseMensagem.praise[index]);
  }

  for (let index = 0; index < analiseMensagem.suggestion.length; index++) {
    await inserirSugestao(id_conversa, analiseMensagem.suggestion[index]);
    const resultadoSugestao = await obterSugestoes();
    console.log(resultadoSugestao);
  }
}

// function dividirConfig(mensagem: string): string[] {
//   const returnMensagem: string[] = [];
//   if (mensagem.length <= MAX_TOKENS) {
//     returnMensagem.push(mensagem);
//   } else {
//     const tamanhoMensagem = mensagem.length;
//     let index = 0;
//     while (index < tamanhoMensagem) {
//       let msg = mensagem.substring(index, index + MAX_TOKENS);
//       index += MAX_TOKENS;
//       //se for a ultima mensagem colocar o fim se nao a continuaçao
//       if (index - tamanhoMensagem) {
//         msg += TOKEN_FINAL;
//       } else {
//         msg += TOKEN_CONTINUACAO;
//       }
//       returnMensagem.push(msg);
//     }
//   }
//   return returnMensagem;
// }

function dividirMensagens(jsonMensagensFormatado: MensagemModelFormatado): string[] {
  const listaDeMensagensParaEnviar: string[] = [];

  let blocoDeMensagem: MensagemFormatado[] = [];

  let somatoria = 0;
  for (let index = 0; index < jsonMensagensFormatado.mensagens.length; index++) {
    const mensagem = jsonMensagensFormatado.mensagens[index];
    const tamMensagemAtual = JSON.stringify(mensagem).length;

    if (somatoria + tamMensagemAtual <= MAX_TOKENS) {
      blocoDeMensagem.push(mensagem);
      somatoria += tamMensagemAtual;

      if (index === jsonMensagensFormatado.mensagens.length - 1) {
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

// criar funçao, passar o id_mensagem_watsap para dentro da funçao como parametro, extrair desse id mensagem o telefone, retornar esse telefone, tipar parametro e funçao
export function extrairTelefone(id_mensagem_whatsapp: string): string {
  var mySubString: string = id_mensagem_whatsapp.substring(id_mensagem_whatsapp.indexOf("_") + 1, id_mensagem_whatsapp.lastIndexOf("@c.us"));
  console.log(mySubString);

  return mySubString;
}
