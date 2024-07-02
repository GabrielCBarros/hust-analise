export const TOKEN_MENSAGEM_JSON = "[MENSAGENS_JSON]";

export const MAX_TOKENS = 2000;

export const CONFIG_IA_INFORMACAO_SOBRE_AS_MENSAGENS =
  `CONFIGURAÇÃO SOBRE AS MENSAGENS: Eu quero que você analise conversas entre a minha empresa e meus clientes. A conversa será em formato JSON e está organizada da seguinte forma:` +
  `\n1. Contem um array de mensagens com nome 'mensagens';` +
  `\n2. Cada mensagem desse array está organizada da seguinte forma:` +
  `\n   2.1. '<IDENTIFICADOR> (<DATA_DA_MENSAGEM>): <TEXTO_DA_MENSAGEM>'` +
  `\n       2.1.1. '<IDENTIFICADOR>': Identificador de quem mandou a mensagem. Esse identificador pode ser de três tipos:` +
  `\n           2.1.1.1. 'Cliente': Se uma mensagem for mandada por um cliente para a empresa, a mensagem terá esse identificador no início da mensagem;` +
  `\n           2.1.1.2. 'Empresa por BOT': Se uma mensagem for mandada por um bot da empresa para um cliente, a mensagem terá esse identificador no início da mensagem;` +
  `\n           2.1.1.3. 'Empresa por <NOME_DO_ATENDENTE>': Se uma mensagem for mandada por um atendente da empresa para um cliente, a mensagem terá esse identificador no início da mensagem.` +
  `\n       2.1.2 '<DATA_DA_MENSAGEM>': Data que a mensagem foi enviada, no formato 'dd-MM-yyyy HH:mm:ss';` +
  `\n       2.1.3 '<TEXTO_DA_MENSAGEM>': Texto da mensagem;` +
  `\n3. Para deixar claro, as mensagens JSON que deverão ser feitas as análises, estarão com o Token inicial '${TOKEN_MENSAGEM_JSON}', e esse token deve ser desconsiderado por não fazer parte da mensagem, mas somente um indicador de que as mensagens devem ser analisadas.` +
  `\n4. Exemplos de mensagem:
    '[MENSAGENS_JSON]{"mensagens":["Cliente (01/01/2024): Olá", "BOT (02/01/2024): Essa é uma mensagem automática", "Empresa por João da Silva (03/01/2024): Bom dia, senhor José."]}'`;

export const CONFIG_IA_INFORMACAO_SOBRE_COMO_ANALISAR =
  `CONFIGURAÇÃO SOBRE COMO ANALISAR: A análise de mensagem deve ser feita da seguinte forma:` +
  `\n1. Você deve analisar todas as mensagens para ter um melhor entendimento sobre o contexto da conversa.` +
  `\n2. Mas você SOMENTE irá classificar as mensagens que forem enviadas por clientes (mensagens que tiverem identificador igual a 'Cliente').` +
  `\n3. A Classificação das mensagens devem ser feitas em 'sugestoes', 'reclamacao' ou 'elogio':` +
  `\n   3.1. 'suggestion': mensagens que o cliente enviou e contenha algum tipo de sugestão/conselho/recomendação sobre o atendimento ou sobre o serviço prestado;` +
  `\n   3.2. 'complaint': mensagens que o cliente enviou e contenha algum tipo de reclamação/queixa sobre o atendimento ou sobre o serviço prestado;` +
  `\n   3.1. 'praise': mensagens que o cliente enviou e contenha algum tipo de elogio/enaltecimento/congratulação sobre o atendimento ou sobre o serviço prestado.`;

export const CONFIG_IA_INFORMACAO_SOBRE_COMO_RESPONDER =
  `CONFIGURAÇÃO SOBRE COMO RESPONDER: A análise feita deve ser retornada/respondida para mim em formato JSON. No retorno do JSON deve conter:` +
  `\n1. 'suggestion': array que deve conter as mensagens classificadas como 'suggestion'.` +
  `\n2. 'complaint': array que deve conter as mensagens classificadas como 'complaint'` +
  `\n3. 'praise': array que deve conter as mensagens classificadas como 'praise'` +
  `\n4. Resumindo, o JSON deve ser do seguinte formato:` +
  `{"suggestion": ["sugestao1 do cliente"],"complaint": ["reclamacao1 do cliente", "reclamacao2 do cliente"],"praise": []}.` +
  `\n5. No retorno/resposta das análises de mensagens em formato JSON, não deve conter justificativa do motivo da classificação. Na resposta, eu quero que somente retorne a análise em formato JSON anteriormente especificado no item 4 (NÃO escrever nada além disso, SOMENTE o JSON).`;
