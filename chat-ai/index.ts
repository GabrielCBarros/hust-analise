import fs from "fs";

function fetchJSONData() {
  fs.readFile("./Mensagens/messagens.lucas.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    let json = JSON.parse(data)
    console.log(json.mensagens[5])
  });
}

fetchJSONData();