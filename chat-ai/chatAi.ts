import {fileURLToPath} from "url";
import path from "path";
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";
import {configIA} from './config'
import { MensagemModel } from "./mensagem.model";



export async function chatAi(jsonMensagens: MensagemModel): Promise<void>{// model name
    const MODEL_NAME = "mistral-7b-instruct-v0.2.Q5_K_M.gguf";
    // const MODEL_NAME = "llama-2-7b.Q5_K_M.gguf";
    
    // get the models directory
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const modelsDirectory = path.join(__dirname, "../models");
    const modelsPath = path.join(modelsDirectory, MODEL_NAME);
    
    
    const model = new LlamaModel({
        modelPath : modelsPath
    });
    
    const context = new LlamaContext({model});
    const session = new LlamaChatSession({context});
    let respostaAi = ""
    const config = configIA 
    respostaAi = await session.prompt(config)
    console.log('Ai: '+ respostaAi)
    respostaAi = await session.prompt(JSON.stringify(jsonMensagens))
}
