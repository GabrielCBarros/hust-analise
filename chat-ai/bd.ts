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

async function criarTabelaSugestao() {
  const query = `CREATE TABLE IF NOT EXISTS sugestao (
          id SERIAL PRIMARY KEY,
          id_conversa VARCHAR NOT NULL,  
          msg_sugestao VARCHAR NOT NULL
        );`;

  const client = await connect();
  const res = await client.query(query);
  console.log("criar tabela", res);
}
async function inseirSugestao(id_conversa: string, msg_sugestao: string) {
  const client = await connect();
  const query = "INSERT INTO sugestao (id_conversa, msg_sugestao) VALUES ($1, $2)";
  const values = [id_conversa, msg_sugestao];
  await client.query(query, values);
}
async function obterSugestoes() {
  const client = await connect();
  const query = "SELECT * FROM sugestao";
  const resultado = await client.query(query);
  console.log(resultado.rows);
}
// inseirSugestao("numero", "carro");
// obterSugestoes();
