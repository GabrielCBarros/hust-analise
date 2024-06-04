export const TOKEN_MENSAGEM_JSON = "[MENSAGENS_JSON]";

export const MAX_TOKENS = 2000;

export const CONFIG_IA_INFORMACAO_SOBRE_AS_MENSAGENS =
  `CONFIGURAÇÃO SOBRE AS MENSAGENS: Eu quero que você analise conversas de whatsapp em formato JSON. O arquivo contendo as conversas em JSON está organizado da seguinte forma:` +
  `\n1. Contém um array de mensagens` +
  `\n2. Cada mensagem desse array de mensagens está organizada da seguinte forma:` +
  `\n   2.1. 'mensagem': texto da mensagem` +
  `\n   2.2. 'tipo': pode ser 'chat' ou 'sistema'. Se for 'chat', significa que é uma mensagem enviada por mim ou por quem estou conversando; e se for 'sistema', é uma mensagem automática enviada por bot.` +
  `\n   2.3. 'flag_enviado': indicativo (0 ou 1) se a mensagem foi enviada por mim ou não. Se for '0', significa que outra pessoa enviou a mensagem pra mim; se for '1', significa que eu enviei a mensagem.` +
  `\n3. Para deixar claro, as mensagens JSON que deverão ser feitas as análises, estarão com o Token inicial '${TOKEN_MENSAGEM_JSON}', e esse token deve ser desconsiderado por não fazer parte da mensagem, mas somente um indicador da mensagens a serem analisadas.`;

export const CONFIG_IA_INFORMACAO_SOBRE_COMO_ANALISAR =
  `CONFIGURAÇÃO SOBRE COMO ANALISAR: A análise de mensagem deve ser feita da seguinte forma:` +
  `\n   1. Classificar as mensagens enviadas para mim (tipo 'chat' e 'flag_enviado' igual a 0) em 'suggestion', 'complaint' ou 'praise'.` +
  `\n       1.1. 'suggestion': mensagens que enviam a mim contendo algum tipo de sugestão` +
  `\n       1.2. 'complaint': mensagens que enviam a mim contendo algum tipo de reclamação` +
  `\n       1.1. 'praise': mensagens que enviam a mim contendo algum tipo de elogio.` +
  `\n   2. Ao analisar as mensagens, quero que selecione as mensagens que tiverem algum: sugestão, reclamação ou elogio. ` +
  `\n   3. As mensagens estão organizadas cronologicamente (a primeira mensagem é a mais antiga e a última mensagem é a mais recente)` +
  `\n   4. O conjunto de mensagens (tanto enviadas por mim ou não) devem ser interpretadas para compreender se uma mensagem enviada para mim é ou não classificada como sugestão, reclamação ou elogio. As minhas mensagens (tipo igual 'chat' e flag_enviado igual a 1) não devem ser classficadas, apenas levadas em consideração para efeito da análise.`;

export const CONFIG_IA_INFORMACAO_SOBRE_COMO_RESPONDER =
  `CONFIGURAÇÃO SOBRE COMO RESPONDER: A análise feita deve ser retornada/respondida para mim em formato JSON. No retorno do JSON deve conter:` +
  `\n   1. 'suggestion': array que deve conter as mensagens classificadas como 'sugestões'.` +
  `\n   2. 'complaint': array que deve conter as mensagens classificadas como 'reclamações'` +
  `\n   3. 'praise': array que deve conter as mensagens classificadas como 'elogio'` +
  `\n   4. Resumindo, o JSON deve ser do seguinte formato:` +
  `{"suggestion": ["Suggestion1 gerada pela IA"],"complaint": ["Complaint1 gerada pela AI", "Complaint2 gerada pela AI"],"praise": []}.` +
  `\n   5. No retorno/resposta das análises de mensagens em formato JSON, não deve conter justificativa do motivo da classificação. Na resposta, eu quero que somente retorne a análise em formato JSON anteriormente especificado no item 4 (NÃO escrever nada além disso, SOMENTE o JSON).`;
