export type MensagemModel = {mensagens: Mensagem[]}
export type MensagemModelFormatado = {mensagens: MensagemFormatado[]} 
export type Mensagem = {
    "mensagem": string,
    "data": string,
    "caption": any,
    "tipo": string,
    "localizacao": any,
    "flag_enviado": number,
    "id_mensagem": number,
    "warning": number,
    "id_mensagem_whatsapp_resposta": any,
    "ack": any,
    "flag_excluida": number,
    "membro_grupo_nome": any,
    "membro_grupo_numero": any,
    "usuario": any,
    "id_mensagem_whatsapp": string,
    "mediaURL": any,
    "mensagemResposta": any
}

export type MensagemFormatado = {
    "mensagem": string,
    "tipo": string,
    "usuario": any,
}