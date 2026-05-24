// ============================================
// 1. DADOS DOS JOGADORES (Nossa base de dados)
// ============================================
// Aqui temos uma lista (Array) de jogadores.
// Cada jogador é um Objeto que guarda suas informações.

const jogadores = [
  { nome: "Victor",  gols: 4, assistencias: 1, defesas: 2,  vitorias: 1, jogos: 3},
  { nome: "Guigo",   gols: 3,  assistencias: 4, defesas: 0,  vitorias: 2, jogos: 3 },
  { nome: "Gabriel", gols: 0, assistencias: 0, defesas: 0,  vitorias: 0, jogos: 0 },
  { nome: "Fink",  gols: 1,  assistencias: 3, defesas: 0, vitorias: 0, jogos: 1 },
  { nome: "Pedro",   gols: 0,  assistencias: 0, defesas: 0,  vitorias: 0, jogos: 1 },
  { nome: "Guilherme", gols: 0,  assistencias: 3, defesas: 3,  vitorias: 0, jogos: 2 },
  { nome: "Henrique",  gols: 2, assistencias: 3, defesas: 0,  vitorias: 2, jogos: 3 },
  { nome: "Gustavo",    gols: 4,  assistencias: 0, defesas: 4, vitorias: 1, jogos: 3 },
  { nome: "Flericlis",    gols: 1,  assistencias: 2, defesas: 3, vitorias: 0, jogos: 3 },
  {nome: "Davi Barcelos",    gols: 1,  assistencias: 0, defesas: 0, vitorias: 0, jogos: 1 }
];

// ============================================
// TOTAIS GLOBAIS (Modificar manualmente se precisar)
// ============================================
// OPÇÃO 2: Se quiser editar os totais sem mexer nos jogadores, use essas variáveis
// Deixe com NULL para calcular automaticamente. Coloque um número para forçar o valor.
let totalJogadoresFixo = null;  // Deixe NULL para contar automaticamente | Ou coloque um número tipo: 9
let totalJogosFixo = 3;         // Total de jogos fixo definido para 3
let totalGolsFixo = null;       // Deixe NULL para somar automaticamente | Ou coloque um número tipo: 25


// ============================================
// 2. FUNÇÕES AUXILIARES PARA ATUALIZAR HEADER
// ============================================

// OPÇÃO 1: Função para editar o header direto (sem mexer nos jogadores)
function atualizarHeader(novosTotais) {
  // Essa função permite que você mude o header de forma simples
  // Exemplo de uso: atualizarHeader({ jogadores: 9, jogos: 15, gols: 30 })
  
  if (novosTotais.jogadores !== undefined) {
    totalJogadoresFixo = novosTotais.jogadores;
  }
  if (novosTotais.jogos !== undefined) {
    totalJogosFixo = novosTotais.jogos;
  }
  if (novosTotais.gols !== undefined) {
    totalGolsFixo = novosTotais.gols;
  }
  
  // Redesenha o site com os novos valores
  let ranking = prepararRanking();
  renderizarHeader(ranking);
}

// OPÇÃO 3: Função para resetar os valores (voltar a calcular automaticamente)
function resetarHeader() {
  totalJogadoresFixo = null;
  totalJogosFixo = null;
  totalGolsFixo = null;
  
  let ranking = prepararRanking();
  renderizarHeader(ranking);
}

// ============================================
// 3. FUNÇÕES DE CÁLCULO E LÓGICA
// ============================================

// Função para calcular os pontos de UM jogador
function calcularPontos(jogador) {
  let pontosGols = jogador.gols * 1;
  let pontosAssist = jogador.assistencias * 0.5;
  let pontosDefesas = jogador.defesas * 0.25;
  let pontosVitorias = jogador.vitorias * 1;
  
  let totalDePontos = pontosGols + pontosAssist + pontosDefesas + pontosVitorias;
  return totalDePontos;
}

// Função para calcular o Overall (Nível geral) de UM jogador
function calcularOverall(jogador) {
  // Se não jogou nenhuma partida, o overall base é 70
  if (!jogador.jogos || jogador.jogos === 0) {
    return 70; 
  }

  // 1. Calcula os pontos totais acumulados na carreira
  let pontosTotais = calcularPontos(jogador); 

  if (pontosTotais <= 0) {
    return 70;
  }

  // 2. Nova fórmula: O número de jogos (jogador.jogos) agora divide a conta,
  // servindo como o teste de eficiência que você queria.
  let contaInterna = (9 * Math.pow(pontosTotais, 2)) / jogador.jogos;
  let overall = 70 + Math.sqrt(contaInterna);

  // 3. Trava o limite no 100 e arredonda para o inteiro mais próximo
  let overallFinal = Math.min(Math.round(overall), 100);

  return overallFinal;
}

// Função que pega a lista de jogadores, calcula tudo e ordena do melhor para o pior
function prepararRanking() {
  let jogadoresProcessados = [];

  // Passa por cada jogador da nossa lista original
  for (let jogador of jogadores) {
    
    // Cria um novo objeto completinho para ele
    let jogadorCompleto = {
      nome: jogador.nome,
      gols: jogador.gols,
      assistencias: jogador.assistencias,
      defesas: jogador.defesas,
      vitorias: jogador.vitorias,
      jogos: jogador.jogos,
      pontos: calcularPontos(jogador),
      overall: calcularOverall(jogador)
    };

    // Guarda esse jogador na nova lista
    jogadoresProcessados.push(jogadorCompleto);
  }

  // Ordena a lista do maior overall para o menor
  // Ordena a lista do maior overall para o menor. Se empatar, desempatará por pontos (PTS).
  jogadoresProcessados.sort(function(a, b) {
    if (a.overall > b.overall) {
      return -1; 
    } else if (a.overall < b.overall) {
      return 1;  
    } else {
      // === CRITÉRIO DE DESEMPATE ===
      // Se o overall for igual, quem tiver mais PONTOS (PTS) fica na frente
      if (a.pontos > b.pontos) {
        return -1;
      } else if (a.pontos < b.pontos) {
        return 1;
      } else {
        return 0; // Empate absoluto em tudo
      }
    }
  });

  return jogadoresProcessados;
}


// ============================================
// 4. FUNÇÕES PARA MOSTRAR NA TELA (HTML / DOM)
// ============================================

// Mostra os totais no cabeçalho
function renderizarHeader(ranking) {
  // Se os valores estão "fixos" (não automáticos), usa eles
  let totalJogadores = totalJogadoresFixo !== null ? totalJogadoresFixo : ranking.length;
  let totalJogos = totalJogosFixo !== null ? totalJogosFixo : 0;
  let totalGols = totalGolsFixo !== null ? totalGolsFixo : 0;

  // Se os valores NÃO estão fixos, calcula automaticamente
  if (totalJogosFixo === null || totalGolsFixo === null) {
    for (let jogador of ranking) {
      if (totalJogosFixo === null) totalJogos = totalJogos + jogador.jogos;
      if (totalGolsFixo === null) totalGols = totalGols + jogador.gols;
    }
  }

  // Atualiza os textos na tela
  document.getElementById("total-jogadores").innerText = totalJogadores;
  document.getElementById("total-jogos").innerText = totalJogos;
  document.getElementById("total-gols").innerText = totalGols;
}

// Renderiza o Top 3 (os cards dourados)
function renderizarTop3(ranking) {
  const container = document.getElementById("top3-cards");
  container.innerHTML = ""; // Limpa a tela antes de desenhar

  if (ranking.length < 3) return; // Precisa de pelo menos 3 jogadores

  // Para o visual ficar legal (estilo pódio), a ordem na tela é: 2º lugar, 1º lugar, 3º lugar
  let segundoLugar = ranking[1];
  let primeiroLugar = ranking[0];
  let terceiroLugar = ranking[2];

  // Criamos uma lista com essa ordem visual
  let podio = [
    { jogador: segundoLugar, posicao: 2, medalha: "🥈" },
    { jogador: primeiroLugar, posicao: 1, medalha: "🥇" },
    { jogador: terceiroLugar, posicao: 3, medalha: "🥉" }
  ];

  for (let i = 0; i < podio.length; i++) {
    let item = podio[i];
    
    // Cria o HTML do card misturando texto com as variáveis
    let htmlDoCard = `
      <div class="top3-card rank-${item.posicao} animate-in" style="animation-delay: ${i * 0.15}s">
        <div class="top3-position">${item.medalha} #${item.posicao}</div>
        <div class="top3-name">${item.jogador.nome.toUpperCase()}</div>
        <div class="top3-overall">${item.jogador.overall}</div>
        <div class="top3-stats">
          <div class="top3-stat-item"><span>⚽ Gols</span><span>${item.jogador.gols}</span></div>
          <div class="top3-stat-item"><span>🅰️ Assist</span><span>${item.jogador.assistencias}</span></div>
          <div class="top3-stat-item"><span>🛡️ Def</span><span>${item.jogador.defesas}</span></div>
          <div class="top3-stat-item"><span>🏆 Vit</span><span>${item.jogador.vitorias}</span></div>
        </div>
      </div>
    `;
    
    container.innerHTML += htmlDoCard;
  }
}

// Renderiza a tabela completa
function renderizarTabela(ranking) {
  const tbody = document.getElementById("ranking-body");
  tbody.innerHTML = "";

  for (let i = 0; i < ranking.length; i++) {
    let jogador = ranking[i];
    let posicao = i + 1; // O 'i' começa em 0, então somamos 1

    // Classe para colorir o Top 3 na tabela
    let classePosicao = "";
    if (posicao <= 3) {
      classePosicao = "pos-" + posicao;
    }

    let linha = `
      <tr class="animate-in" style="animation-delay: ${i * 0.05}s">
        <td><span class="pos-badge ${classePosicao}">${posicao}</span></td>
        <td><span class="trend-up">▲</span></td> <!-- Trend fixo para simplificar -->
        <td class="col-nome"><span class="player-name-cell">${jogador.nome}</span></td>
        <td><span class="overall-cell">${jogador.overall}</span></td>
        <td>${jogador.gols}</td>
        <td>${jogador.assistencias}</td>
        <td>${jogador.defesas}</td>
        <td>${jogador.vitorias}</td>
        <td>${jogador.jogos}</td>
        <td><span class="pts-cell">${jogador.pontos.toFixed(1)}</span></td>
      </tr>
    `;

    tbody.innerHTML += linha;
  }
}

// Renderiza os cards de todos os jogadores
function renderizarCards(ranking) {
  const container = document.getElementById("player-cards");
  container.innerHTML = "";

  for (let i = 0; i < ranking.length; i++) {
    let jogador = ranking[i];
    let posicao = i + 1;

    // Calcula quantos % a barra de overall deve encher (apenas para efeito visual)
    let porcentagem = ((jogador.overall - 70) / 29) * 100;
    if (porcentagem > 100) porcentagem = 100; // Trava no máximo de 100%

    let card = `
      <div class="player-card animate-in" style="animation-delay: ${i * 0.08}s">
        <div class="card-header">
          <span class="card-rank">#${posicao}</span>
          <span class="card-overall">${jogador.overall}</span>
        </div>
        <div class="card-name">${jogador.nome.toUpperCase()}</div>
        <div class="card-stats">
          <div class="card-stat">
            <span class="stat-label">⚽ Gols</span>
            <span class="stat-value">${jogador.gols}</span>
          </div>
          <div class="card-stat">
            <span class="stat-label">🅰️ Assist</span>
            <span class="stat-value">${jogador.assistencias}</span>
          </div>
          <div class="card-stat">
            <span class="stat-label">🛡️ Defesas</span>
            <span class="stat-value">${jogador.defesas}</span>
          </div>
          <div class="card-stat">
            <span class="stat-label">🏆 Vitórias</span>
            <span class="stat-value">${jogador.vitorias}</span>
          </div>
          <div class="card-stat-bar">
            <div class="stat-bar-header">
              <span class="stat-label">OVERALL</span>
              <span class="stat-value">${jogador.overall}</span>
            </div>
            <div class="stat-bar-track">
              <!-- A barra começa zerada e cresce via animação -->
              <div class="stat-bar-fill" style="width: 0%" data-target="${porcentagem}"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML += card;
  }

  // Pede para o navegador animar as barras 300ms depois de criar os cards
  setTimeout(animarBarras, 300);
}

// Faz a barrinha de stats de cada card crescer
function animarBarras() {
  const barras = document.querySelectorAll(".stat-bar-fill");
  for (let barra of barras) {
    let tamanhoFinal = barra.getAttribute("data-target"); // Ex: "80.5"
    barra.style.width = tamanhoFinal + "%"; // Vira "80.5%"
  }
}


// ============================================
// 5. INICIALIZAÇÃO DO SITE
// ============================================

// Essa função é o "motor" do site. Ela chama as funções que criamos.
function iniciarSite() {
  // 1. Pega os jogadores e calcula todos os pontos
  let rankingPronto = prepararRanking();

  // 2. Desenha as coisas na tela usando nossa lista já calculada e ordenada
  renderizarHeader(rankingPronto);
  renderizarTop3(rankingPronto);
  renderizarTabela(rankingPronto);
  renderizarCards(rankingPronto);
  
  // 3. Exibe instruções no console para o usuário
  console.log("=== COMO ATUALIZAR OS NÚMEROS DO HEADER ===");
  console.log("");
  console.log("OPÇÃO 1 - Editar os jogadores (Forma automática):");
  console.log("  - Abra o arquivo script.js");
  console.log("  - Procure o array 'jogadores' (linhas iniciais)");
  console.log("  - Modifique: gols, jogos, assistências, etc");
  console.log("");
  console.log("OPÇÃO 2 - Editar valores FIXOS (Forma rápida):");
  console.log("  - Abra o arquivo script.js");
  console.log("  - Procure 'TOTAIS GLOBAIS' (linhas 22-25)");
  console.log("  - Mude os valores de NULL para números");
  console.log("  - Exemplo: totalGolsFixo = 25;");
  console.log("");
  console.log("OPÇÃO 3 - Usar funções no console do navegador:");
  console.log("  atualizarHeader({ jogadores: 9, jogos: 15, gols: 30 })");
  console.log("  resetarHeader()  // Volta a calcular automaticamente");
  console.log("");
}

// Avisa o navegador: "Quando terminar de ler o HTML da página, rode a função iniciarSite"
document.addEventListener("DOMContentLoaded", iniciarSite);
