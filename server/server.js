const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/get-html", async (req, res) => {
  console.log("requisição recebida");
  const response = await fetch(
    "https://www.adorocinema.com/pesquisar/?q=bastardos+inglorios",
  );
  const html = await response.text();
  res.send(html);
});

app.listen(3000, () => {
  console.log("Servidor proxy rodando na porta 3000");
});
