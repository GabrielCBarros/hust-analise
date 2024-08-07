import { LlamaChatSession, LlamaContext, LlamaModel } from "node-llama-cpp";
import path from "path";
import { fileURLToPath } from "url";
import { CONFIG_IA_INFORMACAO_SOBRE_AS_MENSAGENS, CONFIG_IA_INFORMACAO_SOBRE_COMO_ANALISAR, CONFIG_IA_INFORMACAO_SOBRE_COMO_RESPONDER } from "./config";
import { AnaliseMensagens, AnaliseMensagensPorChamado, ChamadoMensagens } from "./mensagem.model";

export async function chatAi(listaChamadoMensagens: ChamadoMensagens[]): Promise<AnaliseMensagensPorChamado[]> {
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

  let listaAnaliseMensagensPorChamado: AnaliseMensagensPorChamado[] = [];

  for (let index = 0; index < listaChamadoMensagens.length; index++) {
    let chamadoMensagens = listaChamadoMensagens[index];

    //JSONMENSAGENS
    console.log("\n\n==============  MENSAGENS ==============");

    let analiseMensagem: AnaliseMensagens = {
      complaint: [],
      suggestion: [],
      praise: [],
    };
    for (let index = 0; index < chamadoMensagens.mensagensEmBloco.length; index++) {
      console.log("\n\n\n - - - - - - - - - - - - - - - - - - - - - - - - - - - ");
      respostaAi = await session.prompt(chamadoMensagens.mensagensEmBloco[index]);
      console.log("******************* ----------------------- *******************");
      console.log("resposta mensagens", respostaAi);

      let retornoJson: AnaliseMensagens;
      if (respostaAi.indexOf("```json") != -1 && respostaAi.lastIndexOf("```") != -1) {
        const respostaFormatada = respostaAi.substring(respostaAi.indexOf("```json") + 7, respostaAi.lastIndexOf("```"));
        retornoJson = JSON.parse(respostaFormatada);
      } else {
        retornoJson = JSON.parse(respostaAi);
      }

      analiseMensagem.complaint.push(...retornoJson.complaint);
      analiseMensagem.praise.push(...retornoJson.praise);
      analiseMensagem.suggestion.push(...retornoJson.suggestion);
    }
    listaAnaliseMensagensPorChamado.push({ analiseMensagens: analiseMensagem, id_chamado: chamadoMensagens.id_chamado });
  }

  return listaAnaliseMensagensPorChamado;
}
