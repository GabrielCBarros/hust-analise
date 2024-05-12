import { LlamaChatSession, LlamaContext, LlamaModel } from "node-llama-cpp";
import path from "path";
import { fileURLToPath } from "url";
import { CONFIG_IA, MAX_TOKENS, PRECONFIG_IA, TOKEN_CONTINUACAO, TOKEN_FINAL } from "./config";
import { MensagemModelFormatado } from "./mensagem.model";

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
  respostaAi = await session.prompt(PRECONFIG_IA);
  const config = CONFIG_IA;
  respostaAi = await session.prompt(config);
  console.log("Ai: " + respostaAi);
  const listaMensagens = dividirMensagem(JSON.stringify(jsonMensagensFormatado));
  for (let index = 0; index < listaMensagens.length; index++) {
    respostaAi = await session.prompt(listaMensagens[index]);
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

const respostaPadrao = `Based on the provided JSON data, I will analyze messages sent to me. Here are the messages that contain suggestions, complaints, or praise:

1. "teria algum prazo" - This is a request for information about a potential timeline.
2. "obrigado!" - This message expresses gratitude and can be considered praise.
3. "Há sim, o time de tecnologia desabilitou temporariamente essa funcionalidade para fazer atualizações relacionadas ao tempo de produção das transcriptions, em breve será reabilitado." - This message provides an update on the status of a feature and can be considered informative.

So, the JSON output will look like this:

\`\`\`json
{"suggestion": ["teria algum prazo"], "complaint": [], "praise": ["obrigado!"]}
\`\`\`
`;
