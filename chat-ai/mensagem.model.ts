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
  mensagens: string[];
}

export interface MensagemFormatado {
  mensagem: string | null;
  tipo: string;
  flag_enviado: number;
}

export interface AnaliseMensagens {
  suggestion: string[];
  complaint: string[];
  praise: string[];
}

export interface AnaliseMensagensPorChamado {
  analiseMensagens: AnaliseMensagens;
  id_chamado: number;
}

export interface Message {
  type: string;
  sent: boolean;
  caption: string | null;
  user: any;
  date: string;
  body: string | null;
}

export interface Called {
  id_chamado: number;
}

export interface ChamadoMensagens {
  mensagensEmBloco: string[];
  id_chamado: number;
}
