const express = require("express");
const app = express();
const PORT = 3000;

function calcularReajuste(idade, sexo, salarioBase, anoContratacao) {
  const anoAtual = new Date().getFullYear();
  const tempoEmpresa = anoAtual - anoContratacao;
  let percentual = 0;
  let valorFixo = 0;

  
  if (idade >= 18 && idade <= 39) {
    if (sexo.toUpperCase() === "M") {
      percentual = 10;
      valorFixo = tempoEmpresa <= 10 ? -10 : 17;
    } else {
      percentual = 8;
      valorFixo = tempoEmpresa <= 10 ? -11 : 16;
    }
  } else if (idade >= 40 && idade <= 69) {
    if (sexo.toUpperCase() === "M") {
      percentual = 8;
      valorFixo = tempoEmpresa <= 10 ? -5 : 15;
    } else {
      percentual = 10;
      valorFixo = tempoEmpresa <= 10 ? -7 : 14;
    }
  } else if (idade >= 70 && idade <= 99) {
    if (sexo.toUpperCase() === "M") {
      percentual = 15;
      valorFixo = tempoEmpresa <= 10 ? -15 : 13;
    } else {
      percentual = 17;
      valorFixo = tempoEmpresa <= 10 ? -17 : 12;
    }
  } else {
    return null; 
  }


  const novoSalario = salarioBase + (salarioBase * percentual) / 100 + valorFixo;
  return { percentual, valorFixo, novoSalario, tempoEmpresa };
}

app.get("/", (req, res) => {
  const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

  
  if (!idade || !sexo || !salario_base || !anoContratacao || !matricula) {
    return res.send(`
      <html>
        <head><title>Reajuste Salarial</title></head>
        <body style="font-family: Arial; text-align:center; margin-top:50px;">
          <h1> Cálculo de Reajuste Salarial</h1>
          <p>Informe na URL os seguintes dados:</p>
          <code>
            http://localhost:${PORT}/?idade=30&sexo=M&salario_base=2000&anoContratacao=2015&matricula=12345
          </code>
          <h3>Regras de validação:</h3>
          <ul style="list-style:none;">
            <li>Idade &gt; 16 anos</li>
            <li>Salário base deve ser número real válido</li>
            <li>Ano de contratação &gt; 1960</li>
            <li>Matrícula &gt; 0</li>
          </ul>
        </body>
      </html>
    `);
  }

 
  const idadeNum = parseInt(idade);
  const salarioNum = parseFloat(salario_base);
  const anoNum = parseInt(anoContratacao);
  const matriculaNum = parseInt(matricula);


  if (
    isNaN(idadeNum) || idadeNum <= 16 ||
    isNaN(salarioNum) || salarioNum <= 0 ||
    isNaN(anoNum) || anoNum <= 1960 ||
    isNaN(matriculaNum) || matriculaNum <= 0
  ) {
    return res.send(`
      <html>
        <head><title>Erro</title></head>
        <body style="font-family: Arial; color:red; text-align:center; margin-top:50px;">
          <h2> Dados inválidos!</h2>
          <p>Verifique se todos os parâmetros foram informados corretamente.</p>
          <a href="/">Voltar</a>
        </body>
      </html>
    `);
  }

  const resultado = calcularReajuste(idadeNum, sexo, salarioNum, anoNum);

  if (!resultado) {
    return res.send(`
      <html>
        <body style="font-family: Arial; text-align:center; margin-top:50px;">
          <h2> Idade fora das faixas válidas (18–99 anos).</h2>
          <a href="/">Voltar</a>
        </body>
      </html>
    `);
  }

  res.send(`
    <html>
      <head><title>Resultado do Reajuste</title></head>
      <body style="font-family: Arial; margin:40px;">
        <h1>Resultado do Reajuste Salarial</h1>
        <p><strong>Matrícula:</strong> ${matriculaNum}</p>
        <p><strong>Idade:</strong> ${idadeNum}</p>
        <p><strong>Sexo:</strong> ${sexo.toUpperCase()}</p>
        <p><strong>Salário Base:</strong> R$ ${salarioNum.toFixed(2)}</p>
        <p><strong>Ano de Contratação:</strong> ${anoNum}</p>
        <p><strong>Tempo de Empresa:</strong> ${resultado.tempoEmpresa} anos</p>
        <hr>
        <h2 style="color:green;">💰 Novo Salário: R$ ${resultado.novoSalario.toFixed(2)}</h2>
        <p>(Reajuste de ${resultado.percentual}% e ${resultado.valorFixo >= 0 ? "acréscimo" : "desconto"} de R$ ${Math.abs(resultado.valorFixo)})</p>
        <a href="/">⬅️ Calcular novamente</a>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
