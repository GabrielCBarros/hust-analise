import fs from "fs";
import pg from "pg";
import { CONFIG_BD } from "./config.bd";

declare global {
  var connection: pg.Pool;
}

export async function connect() {
  const { Pool } = pg;

  if (global.connection) {
    return global.connection.connect();
  }

  const certificado = fs.readFileSync("./ca.pem").toString();
  let configBD = CONFIG_BD;
  configBD.ssl.ca = certificado;
  const pool = new Pool(CONFIG_BD);
  const client = await pool.connect();
  console.log("criou o pool de conexao");

  const resultado = await client.query("select now()");
  console.log(resultado.rows[0]);

  client.release();

  global.connection = pool;

  return pool.connect();
}

export async function criarTabelaSugestao() {
  const query = `CREATE TABLE IF NOT EXISTS sugestao (
          id SERIAL PRIMARY KEY,
          id_conversa VARCHAR NOT NULL,  
          msg_sugestao VARCHAR NOT NULL
        );`;

  const client = await connect();
  const res = await client.query(query);
  console.log("criar tabela", res);
}

export async function inserirSugestao(id_conversa: string, msg_sugestao: string) {
  const client = await connect();
  const query = "INSERT INTO sugestao (id_conversa, msg_sugestao) VALUES ($1, $2)";
  const values = [id_conversa, msg_sugestao];
  await client.query(query, values);
}

export async function obterSugestoes() {
  const client = await connect();
  const query = "SELECT * FROM sugestao";
  const resultado = await client.query(query);
  return resultado;
}

export async function deletarTudoSugestoes() {
  const client = await connect();
  const query = "DELETE FROM sugestao";
  await client.query(query);
}

export async function criarTabelaPraise() {
  const query = `CREATE TABLE IF NOT EXISTS praise (
    id SERIAL PRIMARY KEY,
    id_conversa VARCHAR NOT NULL,  
    msg_praise VARCHAR NOT NULL
  );`;

  const client = await connect();
  const res = await client.query(query);
  console.log("criar tabela", res);
}

export async function inserirPraise(id_conversa: string, msg_praise: string) {
  const client = await connect();
  const query = "INSERT INTO praise (id_conversa, msg_praise) VALUES ($1, $2)";
  const values = [id_conversa, msg_praise];
  const res = await client.query(query, values);
}

export async function obterPraise() {
  const client = await connect();
  const query = "SELECT * FROM praise";
  const resultado = await client.query(query);
  return resultado;
}

export async function deletarTudoPraise() {
  const client = await connect();
  const query = "TRUNCATE praise";
  await client.query(query);
}

//criar tabela complaint
export async function criarTabelaComplaint() {
  const query = `CREATE TABLE IF NOT EXISTS complaint (
    id SERIAL PRIMARY KEY,
    id_conversa VARCHAR NOT NULL,  
    msg_complaint VARCHAR NOT NULL
  );`;

  const client = await connect();
  const res = await client.query(query);
  console.log("criar tabela", res);
}

export async function inserirComplaint(id_conversa: string, msg_complaint: string) {
  const client = await connect();
  const query = "INSERT INTO complaint (id_conversa, msg_complaint) VALUES ($1, $2)";
  const values = [id_conversa, msg_complaint];
  await client.query(query, values);
}

export async function obterComplaint() {
  const client = await connect();
  const query = "SELECT * FROM complaint";
  const resultado = await client.query(query);
  return resultado;
}

export async function deletarTudoComplaint() {
  const client = await connect();
  const query = "TRUNCATE complaint";
  await client.query(query);
}
