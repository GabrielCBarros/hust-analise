import fs from "fs";
import { chatAi } from "./chatAi";
import { MensagemFormatado, MensagemModel, MensagemModelFormatado, RetornoJson } from "./mensagem.model";

function fetchJSONData() {
  // fs.readFile("./Mensagens/messagens.lucas.json", "utf8", (error, data) => {
  //   if (error) {
  //     console.log(error);
  //     return;
  //   }
  //   let jsonMensagens: MensagemModel = JSON.parse(data);
  //   let jsonMensagensFormatado = obterJsonMensagensFormatadas(jsonMensagens);
  //   chatAi(jsonMensagensFormatado);
  // });
  const respostaPadrao = `Based on the provided JSON data, I will analyze messages sent to me. Here are the messages that contain suggestions, complaints, or praise:

1. "teria algum prazo" - This is a request for information about a potential timeline.
2. "obrigado!" - This message expresses gratitude and can be considered praise.
3. "Há sim, o time de tecnologia desabilitou temporariamente essa funcionalidade para fazer atualizações relacionadas ao tempo de produção das transcriptions, em breve será reabilitado." - This message provides an update on the status of a feature and can be considered informative.

So, the JSON output will look like this:

\`\`\`json
{"suggestion": ["teria algum prazo"], "complaint": [], "praise": ["obrigado!"]}
\`\`\`
`;

  var mySubString = respostaPadrao.substring(respostaPadrao.indexOf("```json") + 7, respostaPadrao.lastIndexOf("```"));
  console.log(mySubString);
  const retornoJson: RetornoJson = JSON.parse(mySubString);
  console.log(retornoJson);
}
function obterJsonMensagensFormatadas(jsonMensagens: MensagemModel): MensagemModelFormatado {
  let mensagensFormatada: MensagemFormatado[] = [];
  for (let index = 0; index < jsonMensagens.mensagens.length; index++) {
    const element = jsonMensagens.mensagens[index];
    const mensagemFormatado: MensagemFormatado = {
      mensagem: element.mensagem,
      usuario: element.usuario,
      tipo: element.tipo,
      data: element.data,
    };

    mensagensFormatada.push(mensagemFormatado);
  }
  let mensagemModelFormatado: MensagemModelFormatado = { mensagens: mensagensFormatada };
  console.log(JSON.stringify(mensagemModelFormatado).length);

  return mensagemModelFormatado;
}

fetchJSONData();

const respostaPadrao = `Based on the provided JSON data, I will analyze messages sent to me. Here are the messages that contain suggestions, complaints, or praise:

1. "teria algum prazo" - This is a request for information about a potential timeline.
2. "obrigado!" - This message expresses gratitude and can be considered praise.
3. "Há sim, o time de tecnologia desabilitou temporariamente essa funcionalidade para fazer atualizações relacionadas ao tempo de produção das transcriptions, em breve será reabilitado." - This message provides an update on the status of a feature and can be considered informative.

So, the JSON output will look like this:

\`\`\`json
{"suggestion": ["teria algum prazo"], "complaint": [], "praise": ["obrigado!"]}
\`\`\`
`;
