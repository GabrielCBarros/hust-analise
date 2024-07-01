export interface MensagemModel {
  mensagens: MensagemOriginal[];
}

export interface MensagemOriginal {
  mensagem: string;
  data: string;
  caption: any;
  tipo: string;
  localizacao: any;
  flag_enviado: number;
  id_mensagem: number;
  warning: number;
  id_mensagem_whatsapp_resposta: any;
  ack: any;
  flag_excluida: number;
  membro_grupo_nome: any;
  membro_grupo_numero: any;
  usuario: any;
  id_mensagem_whatsapp: string;
  mediaURL: any;
  mensagemResposta: any;
}

export interface MensagemModelFormatado {
  mensagens: MensagemFormatado[];
  id_mensagem_whatsapp: string;
}

export interface MensagemFormatado {
  mensagem: string;
  tipo: string;
  flag_enviado: number;
}

export interface AnaliseMensagensJson {
  suggestion: string[];
  complaint: string[];
  praise: string[];
}

export interface Message {
  type: string;
  sent: boolean;
  caption: string;
  user: any;
  date: string;
  body: string;
}

export interface Called {
  id_chamado: number;
}
