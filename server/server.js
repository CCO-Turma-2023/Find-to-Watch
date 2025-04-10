const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

app.get("/chama2", async (req, res) => {
  axios.get("https://www.adorocinema.com/filmes/filme-227463/programacao/?cgeocode=293136")
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    
    const dataLocalizations = [];

    $("ul.mdl-more li.mdl-more-li a.mdl-more-item.js-set-localization").each((i, el) => {
      const dataLoc = $(el).attr("data-localization");
      if (dataLoc) {
        dataLocalizations.push(JSON.parse(dataLoc)); 
      }
    });

    console.log(dataLocalizations);
  })
  .catch(err => {
    console.error("Erro ao carregar a página:", err);
  });
});


app.get("/chama", async (req, res) => {
  try {
    console.log("oi");
    const response = await axios.get("https://www.adorocinema.com/filmes/filme-1000019130/programacao/?cgeocode=293136");

    console.log(response.data)


    res.send(response.data); // <-- aqui está o fix
  } catch (error) {
    console.error("Erro ao buscar dados:", error.message);
    res.status(500).send("Erro ao buscar dados");
  }
});

app.get("/get-html", async (req, res) => {
  const { search } = req.query;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  );

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const blockedResources = ["image", "stylesheet", "font"];
    if (blockedResources.includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  const formattedSearch = encodeURIComponent(search || "");
  const url = `https://www.adorocinema.com/pesquisar/?q=${formattedSearch}`;

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
    await page.waitForSelector(".xXx.meta-title-link", { timeout: 5000 });

    const resultados = await page.evaluate(() => {
      const link = document.querySelector(".xXx.meta-title-link");
      if (link) {
        const titulo = link.textContent?.trim();
        const href = link.getAttribute("href");
        return [
          {
            titulo,
            link: href ? `https://www.adorocinema.com${href}programacao` : null,
          },
        ];
      }
      return [];
    });

    res.send(resultados[0] || { error: "Nenhum resultado encontrado." });
  } catch (error) {
    console.error("Erro ao processar:", error);
    res.status(500).send({ error: "Erro ao buscar resultados." });
  } finally {
    await browser.close();
  }
});

app.listen(3000, () => {
  console.log("Servidor proxy rodando na porta 3000");
});
