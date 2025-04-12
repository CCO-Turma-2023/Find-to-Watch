const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require('fs');
const cheerio = require("cheerio");

const app = express();
app.use(cors());


app.get("/get-theaters", async (req, res) => {
  const { idMovie, idCity } = req.query;

  try {
    const response = await axios.get(`https://www.adorocinema.com/filmes/filme-${idMovie}/programacao/em-torno-${idCity}/#shwt_date=2025-04-11`);

    const html = response.data;

    const $ = cheerio.load(html);

    const cinemas = [];
    
    $('.theater-card').each((_, el) => {
      const $cinema = $(el);
    
      const nomeCinema = $cinema.find('.meta-theater-title .title a').text().trim();

      const sessoes = [];
    
      $cinema.find('.showtimes-version').each((_, sessaoEl) => {
        const $sessao = $(sessaoEl);

        const descricao = $sessao.find('.text').text().replace(/\s+/g, ' ').trim();
    
        const horarios = [];

        $sessao.find('.showtimes-hour-item-value, .showtimes-hours-item-value').each((_, horarioEl) => {
          const horario = $(horarioEl).text().trim();
          horarios.push(horario);
        });
    
        sessoes.push({
          descricao,
          horarios
        });
      });
    
      cinemas.push({
        nome: nomeCinema,
        sessoes
      });
    });

    res.send(cinemas);
  } catch (err) {
    console.error("Erro ao buscar as regiões:", err.message);
    res.status(500).json({ erro: "Erro ao buscar as regiões" });
  }
})

app.get("/get-regioes", async (req, res) => {
  const { search } = req.query;

  try {
    const response = await axios.get(`https://www.adorocinema.com/filmes/filme-${search}/programacao/`);
    const html = response.data;
    const $ = cheerio.load(html);

    const regioes = [];

    // Seleciona todos os <li> dentro de listas com regiões
    $("ul li.mdl-more-li").each((_, li) => {
      const $li = $(li);

      // Verifica se há uma âncora que não tem a classe 'js-set-localization'
      const a = $li.find("a.mdl-more-item").filter((i, el) => !$(el).hasClass("js-set-localization"));
      const span = $li.find("span.mdl-more-item.disabled");

      if (a.length > 0) {
        const el = a.first();
        regioes.push({
          nome: el.attr("title")?.trim() || el.text().trim(),
          url: el.attr("href") || null,
          ativo: true
        });
      } else if (span.length > 0) {
        const el = span.first();
        regioes.push({
          nome: el.attr("title")?.trim() || el.text().trim(),
          url: el.attr("href") || null,
          ativo: false
        });
      }
    });

    const resultado = regioes.map(({ nome, url, ativo }) => {
      const match = url.match(/cgeocode=(\d+)/);
      return {
        nome,
        geocode: match ? match[1] : null,
        ativo
      };
    });

    res.send(resultado);
  } catch (err) {
    console.error("Erro ao buscar as regiões:", err.message);
    res.status(500).json({ erro: "Erro ao buscar as regiões" });
  }
});


app.get("/get-cities", async (req, res) => {

  const {search, geocode} = req.query

   axios.get(`https://www.adorocinema.com/filmes/filme-${search}/programacao/?cgeocode=${geocode}`)
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

    res.send(dataLocalizations)
  })
  .catch(err => {
    console.error("Erro ao carregar a página:", err);
  });
});

app.get("/get-html", async (req, res) => {
  const { search } = req.query;
  const url = `https://www.adorocinema.com/pesquisar/?q=${encodeURIComponent(search)}`;

   try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    });

    const $ = cheerio.load(data);

    const span = $("span.meta-title-link").first();

    if (!span || !span.attr("class")) {
      return res.status(404).json({ error: "Classe não encontrada" });
    }

    const encoded = span.attr("class").split(" ").find(c => c !== "meta-title-link");

    const cleaned = encoded.replace(/ACr/g, "");
  
    const decoded = Buffer.from(cleaned, 'base64').toString('utf-8');

    const match = decoded.match(/filme-(\d+)/);
    
    const codigo = match ? match[1] : null;
    
    res.send(codigo)
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});


app.listen(3000, () => {
  console.log("Servidor proxy rodando na porta 3000");
});
