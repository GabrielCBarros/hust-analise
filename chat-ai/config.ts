export const TOKEN_CONTINUACAO = '[continuação]'
export const TOKEN_FINAL = '[fim]'
export const MAX_TOKENS = 2000
export const CONFIG_IA =
  "CONFIGURAÇÃO ANÁLISE: Eu quero que você analise conversas de whatsapp em formato JSON." +
  "\n1. O arquivo JSON está organizado da seguinte forma:" +
  "\n   1.1. Contém um array de mensagens" +
  "\n   1.2. Cada mensagem do array de mensagens está organizada da seguinte forma:" +
  "\n       1.2.1. 'mensagem': texto da mensagem" +
  "\n       1.2.2. 'tipo': pode ser 'chat' ou 'sistema'. Se for 'chat', significa que é uma mensagem enviada por mim ou por quem estou conversando; e se for 'sistema', é uma mensagem automática enviada por bot" +
  "\n       1.2.3. 'usuario': dados do usuário que enviou a mensagem. Se for 'null', significa que outra pessoa enviou a mensagem pra mim; se for diferente de 'null', significa que eu enviei a mensagem" +
  "\n       1.2.4. 'data': A data que a mensagem foi enviada"
  "\n2. A análise de mensagem deve ser feita da seguinte forma:" +
  "\n   2.1. Analisar as mensagens de quem envia as mensagens para mim." +
  "\n   2.2. Ao analisar as mensagens, quero que selecione as mensagens que tiverem algum: sugestão, reclamação ou elogio" +
  "\n   2.3. As mensagens têm que ser analisadas cronologicamente (Mais antigo para o mais recente)" +
  "\n3. A análise feita deve ser retornada em formato JSON. No retorno do JSON deve conter:" +
  "\n   3.1. 'suggestion': array que deve conter as mensagens classificadas como 'sugestões'." +
  "\n   3.2. 'complaint': array que deve conter as mensagens classificadas como 'reclamações'" +
  "\n   3.3. 'praise': array que deve conter as mensagens classificadas como 'elogio'" +
  "\n   3.4. Resumindo, o JSON deve ser do seguinte formato:" +
  '{"suggestion": ["Suggestion1 gerada pela IA"],"complaint": ["Complaint1 gerada pela AI", "Complaint2 gerada pela AI"],"praise": []}';
  
  export const PRECONFIG_IA =
  `As mensagens com mais de ${MAX_TOKENS} caracteres, serão dividadas em no máximo ${MAX_TOKENS} caracteres, e serão enviadas segmentadas para Inteligencia Artificial.` +
  ` Para essas mensagens haverá um token de continuação no final da mensagem: '${TOKEN_CONTINUACAO}'.` +
  ` Para a ultima mensagem dessa sequencia haverá no final da mensagem um token de finalização: '${TOKEN_FINAL}'.` +
  ` Esses tokens ('${TOKEN_CONTINUACAO}' e '${TOKEN_FINAL}') não fazem parte da mensagem a ser analisada, mas são um indicativo de quando há continuação e de quando terminou o envio segmentado.` +
  " Desconsiderar esses tokens de continuação e finalização porque não fazem parte da mensagem  ";

  
  