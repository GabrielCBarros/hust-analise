import {fileURLToPath} from "url";
import path from "path";
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";
import {configIA, preconfig} from './config'
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
    respostaAi = await session.prompt(preconfig)
    const config = configIA 
    respostaAi = await session.prompt(config)
    console.log('Ai: '+ respostaAi)
    const listaMensagens = dividirMensagem(JSON.stringify(jsonMensagens))
    for (let index = 0; index < listaMensagens.length; index++) {
        respostaAi = await session.prompt(listaMensagens[index])
        
    }
    
}

function dividirMensagem(mensagem: string): string[]{
    const returnMensagem: string[] = []
    if(mensagem.length <= 2000){
        returnMensagem.push(mensagem)
    } else{
        const tamanhoMensagem = mensagem.length
        for (let index = 0; index < tamanhoMensagem; index+=2000) {
            let msg = mensagem.substring(index,index+2000)
            
            //se for a ultima mensagem colocar o fim se nao a continuaçao
        if(index = tamanhoMensagem - 1){
           msg+= '[fim]'

        } else{
            msg+= '[continuação]'
        }
            returnMensagem.push(msg)
            
        }
    } 
    return returnMensagem
}
