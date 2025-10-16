
const express = require('express');
const app = express();
app.use(express.json());

let receitas = [
  { id: 1, nome: 'Bolo de chocolate', preco: 20 },
  { id: 2, nome: 'Feijoada', preco: 35 },
  { id: 3, nome: 'Panqueca', preco: 10 }
];

// ---------------- ROTAS PRINCIPAIS ----------------

// Mostrar todas as receitas
app.get('/receitas', (req, res) => {
  res.json(receitas);
});

// Mostrar uma receita específica
app.get('/receitas/:id', (req, res) => {
  const id = Number(req.params.id);
  const receita = receitas.find(r => r.id === id);
  if (!receita) {
    res.send('Receita não encontrada.');
  } else {
    res.json(receita);
  }
});

// nova receita
app.post('/receitas', (req, res) => {
  const nova = req.body;
  nova.id = receitas.length + 1;
  receitas.push(nova);
  res.send('Receita adicionada com sucesso!');
});

// Atualizar 
app.put('/receitas/:id', (req, res) => {
  const id = Number(req.params.id);
  const receita = receitas.find(r => r.id === id);
  if (!receita) {
    res.send('Receita não encontrada.');
  } else {
    receita.nome = req.body.nome || receita.nome;
    receita.preco = req.body.preco || receita.preco;
    res.send('Receita atualizada com sucesso!');
  }
});

// Deletar 
app.delete('/receitas/:id', (req, res) => {
  const id = Number(req.params.id);
  receitas = receitas.filter(r => r.id !== id);
  res.send('Receita removida com sucesso!');
});

// ---------------- ROTAS EXTRAS ----------------

// Filtro por preço 
app.get('/receitas/filtro', (req, res) => {
  const max = Number(req.query.preco);
  const filtradas = receitas.filter(r => r.preco <= max);
  res.json(filtradas);
});

// quantidade total
app.get('/receitas/quantidade', (req, res) => {
  res.send(`Quantidade total de receitas: ${receitas.length}`);
});

// primeira receita cadastrada
app.get('/receitas/primeira', (req, res) => {
  res.json(receitas[0]);
});

// última receita cadastrada
app.get('/receitas/ultima', (req, res) => {
  res.json(receitas[receitas.length - 1]);
});

// Cadastrar várias 
app.post('/receitas/varios', (req, res) => {
  const novas = req.body;
  novas.forEach(r => {
    r.id = receitas.length + 1;
    receitas.push(r);
  });
  res.send(`${novas.length} receitas adicionadas com sucesso!`);
});

// Estatísticas 
app.get('/receitas/estatisticas', (req, res) => {
  if (receitas.length === 0) {
    return res.send('Nenhuma receita cadastrada.');
  }
  const total = receitas.length;
  const soma = receitas.reduce((acc, r) => acc + r.preco, 0);
  const media = soma / total;
  res.send(`Total de receitas: ${total} | Média de preço: R$ ${media.toFixed(2)}`);
});

// ---------------- INICIAR SERVIDOR ----------------
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
