
const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());


const ARQUIVO = 'data.json';

function lerReceitas() {
  try {
    const dados = fs.readFileSync(ARQUIVO, 'utf8');
    return JSON.parse(dados);
  } catch {
    return [];
  }
}

function salvarReceitas(lista) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(lista, null, 2));
}

//  Rotas 

app.get('/', (req, res) => {
  res.send('<h1>API de Receitas</h1><p>Vá para <a href="/receitas">/receitas</a> para ver todas as receitas</p>');
});

app.get('/receitas', (req, res) => {
  const receitas = lerReceitas();

  let html = '<h1>Lista de Receitas</h1><ul>';
  receitas.forEach(r => {
    html += `<li><strong>${r.nome}</strong><br>Ingredientes: ${r.ingredientes.join(', ')}<br>Preço: R$ ${r.preco}</li><br>`;
  });
  html += '</ul><a href="/">Voltar</a>';

  res.send(html);
});

// adicionar uma nova receita
app.post('/receitas', (req, res) => {
  const { nome, ingredientes, preco } = req.body;
  if (!nome) return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });

  const receitas = lerReceitas();
  const nova = {
    id: receitas.length + 1,
    nome,
    ingredientes: ingredientes || [],
    preco: preco || 0
  };

  receitas.push(nova);
  salvarReceitas(receitas);

  res.status(201).json(nova);
});

// apagar uma receita
app.get('/receitas/delete/:id', (req, res) => {
  const id = Number(req.params.id);
  let receitas = lerReceitas();
  receitas = receitas.filter(r => r.id !== id);
  salvarReceitas(receitas);
  res.redirect('/receitas'); // volta para a lista
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
