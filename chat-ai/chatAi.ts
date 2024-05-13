import { LlamaChatSession, LlamaContext, LlamaModel } from "node-llama-cpp";
import path from "path";
import { fileURLToPath } from "url";
import { CONFIG_IA, MAX_TOKENS, PRECONFIG_IA, TOKEN_CONTINUACAO, TOKEN_FINAL } from "./config";
import { MensagemModelFormatado, RetornoJson } from "./mensagem.model";

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
  respostaAi = await session.prompt(PRECONFIG_IA);

  //CONFIG_IA
  const listaConfig = dividirMensagem(CONFIG_IA);
  for (let i = 0; i < listaConfig.length; i++) {
    respostaAi = await session.prompt(listaConfig[i]);
    console.log("Ai: " + respostaAi);
  }

  //JSONMENSAGENS
  const listaMensagens = dividirMensagem(JSON.stringify(jsonMensagensFormatado));
  let analiseMensagem: RetornoJson = {
    complaint: [],
    suggestion: [],
    praise: [],
  };
  for (let index = 0; index < listaMensagens.length; index++) {
    respostaAi = await session.prompt(listaMensagens[index]);
    var mySubString = respostaAi.substring(respostaAi.indexOf("```json") + 7, respostaAi.lastIndexOf("```"));
    console.log(mySubString);
    const retornoJson: RetornoJson = JSON.parse(mySubString);
    console.log(retornoJson);
    analiseMensagem.complaint.push(...retornoJson.complaint);
    analiseMensagem.praise.push(...retornoJson.praise);
    analiseMensagem.suggestion.push(...retornoJson.suggestion);
  }
}

function dividirMensagem(mensagem: string): string[] {
  const returnMensagem: string[] = [];
  if (mensagem.length <= MAX_TOKENS) {
    returnMensagem.push(mensagem);
  } else {
    const tamanhoMensagem = mensagem.length;
    let index = 0;
    while (index < tamanhoMensagem) {
      let msg = mensagem.substring(index, index + MAX_TOKENS);
      index += MAX_TOKENS;
      //se for a ultima mensagem colocar o fim se nao a continuaçao
      if (index - tamanhoMensagem) {
        msg += TOKEN_FINAL;
      } else {
        msg += TOKEN_CONTINUACAO;
      }
      returnMensagem.push(msg);
    }
  }
  return returnMensagem;
}
