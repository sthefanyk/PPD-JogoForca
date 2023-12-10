const elementos = {
  telaInicial: document.getElementById('inicial'),
  telaCadastro: document.getElementById('cadastro'),
  telaJogo: document.getElementById('jogo'),
  telaMensagem: document.querySelector('.mensagem'),
  textoMensagem: document.querySelector('.mensagem .texto'),
  teclado: document.querySelector('.teclado'),
  palavra: document.querySelector('.palavra'),
  dica: document.querySelector('.dica'),
  botoes: {
    facil: document.querySelector('.botao-facil'),
    medio: document.querySelector('.botao-medio'),
    dificil: document.querySelector('.botao-dificil'),
    cadastrar: document.querySelector('.botao-cadastrar'),
    realizarCadastro: document.querySelector('.botao-realizar-cadastro'),
    voltar: document.querySelector('.botao-voltar'),
    reiniciar: document.querySelector('.reiniciar'),
  },
  campos: {
    dificuldade: {
      facil: document.getElementById('facil'),
      medio: document.getElementById('medio'),
      dificil: document.getElementById('dificil')
    },
    palavra: document.getElementById('palavra'),
    dica: document.getElementById('dica')
  },
  boneco: [
    document.querySelector('.boneco-cabeca'),
    document.querySelector('.boneco-corpo'),
    document.querySelector('.boneco-braco-esquerdo'),
    document.querySelector('.boneco-braco-direito'),
    document.querySelector('.boneco-perna-esquerda'),
    document.querySelector('.boneco-perna-direita'),
  ],
};

const palavras = {
  facil: [
    { palavra: 'série', dica: 'Game Of Thrones é a melhor...' },
    { palavra: 'ímpar', dica: 'Se não é par é...' },
  ],
  medio: [
    { palavra: 'programa', dica: 'Conjunto de instruções para o computador.' },
    { palavra: 'bicicleta', dica: 'Meio de transporte com duas rodas.' },
    // Adicione mais palavras para a dificuldade média conforme necessário
  ],
  dificil: [
    { palavra: 'computador', dica: 'Máquina eletrônica de processamento de dados.' },
    { palavra: 'arquitetura', dica: 'A arte de projetar espaços e ambientes.' },
    // Adicione mais palavras para a dificuldade difícil conforme necessário
  ],
};


function novoJogo() {
  // Inicializa o objeto de jogo com valores padrão
  jogo = {
    dificuldade: undefined,
    palavra: {
      original: undefined,
      semAcentos: undefined,
      tamanho: undefined,
      dica: undefined,
    },
    acertos: undefined,
    jogadas: [],
    chances: 6, // Número de chances para errar
    definirPalavra: function (palavra, dica) {
      // Configura a palavra a ser adivinhada e sua dica
      this.palavra.original = palavra;
      this.palavra.tamanho = palavra.length;
      this.acertos = '';

      // Remove acentos da palavra e a normaliza
      this.palavra.semAcentos = this.palavra.original.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      this.palavra.dica = dica;

      // Inicializa os acertos com espaços em branco
      for (let i = 0; i < this.palavra.tamanho; i++) {
        this.acertos += ' ';
      }
    },


    jogar: function (letraJogada) {
      // Verifica se a letra jogada está correta na palavra
      let acertou = false;
      for (let i = 0; i < this.palavra.tamanho; i++) {
        const letra = this.palavra.semAcentos[i].toLowerCase();
        if (letra === letraJogada.toLowerCase()) {
          acertou = true;

          // Substitui o espaço em branco pelo caractere correto na posição i
          this.acertos = substituirCaractere(this.acertos, i, this.palavra.original[i]);
        }
      }

      // Decrementa as chances se a letra jogada não estiver na palavra
      if (!acertou) {
        this.chances--;
      }
      return acertou;
    },
    ganhou: function () {
      // Verifica se o jogador ganhou o jogo (adivinhou a palavra)
      return !this.acertos.includes(' ');
    },
    perdeu: function () {
      // Verifica se o jogador perdeu o jogo (esgotou as chances)
      return this.chances <= 0;
    },
    acabou: function () {
      // Verifica se o jogo acabou (ganhou ou perdeu)
      return this.ganhou() || this.perdeu();
    },
    emAndamento: false, // Indica se o jogo está em andamento ou não
  };

  // Configura a interface do jogo
  elementos.telaInicial.style.display = 'flex';
  elementos.telaCadastro.style.display = 'none';
  elementos.telaJogo.style.display = 'none';
  elementos.telaMensagem.style.display = 'none';
  elementos.telaMensagem.classList.remove('mensagem-vitoria');
  elementos.telaMensagem.classList.remove('mensagem-derrota');

  // Oculta as partes do "boneco" da forca
  for (const parte of elementos.boneco) {
    parte.classList.remove('escondido');
    parte.classList.add('escondido');
  }

  // Cria o teclado na tela do jogo
  criarTeclado();
}

novoJogo();



function selecionarLetra(letra) {
  // Verifica se a letra ainda não foi jogada e o jogo não acabou
  if (!jogo.jogadas.includes(letra) && !jogo.acabou()) {
    //     // Tenta jogar a letra e verifica se foi um acerto
    const acertou = jogo.jogar(letra);

    //     // Adiciona a letra às jogadas
    jogo.jogadas.push(letra);

    // Seleciona o botão da letra e adiciona uma classe para indicar se foi certo ou errado
    const button = document.querySelector(`.botao-${letra}`);
    button.classList.add(acertou ? 'certo' : 'errado');

    // Atualiza a visualização da palavra
    mostrarPalavra();

    // Mostra uma parte do "boneco" da forca em caso de erro
    if (!acertou) {
      mostrarErro();
    }

    // Verifica se o jogador ganhou ou perdeu o jogo e mostra a mensagem apropriada
    if (jogo.ganhou()) {
      mostrarMensagem(true);
    } else if (jogo.perdeu()) {
      mostrarMensagem(false);
    }
  }
}

function criarTeclado() {
  // Define um array de letras do alfabeto
  const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  // Limpa o conteúdo do elemento 'teclado' no HTML
  elementos.teclado.textContent = '';

  // Itera sobre cada letra do array
  for (const letra of letras) {
    // Cria um botão para a letra
    const button = document.createElement('button');

    // Define o texto do botão como a letra em maiúsculo
    button.appendChild(document.createTextNode(letra.toUpperCase()));

    // Adiciona uma classe CSS ao botão com o nome 'botao-letra', por exemplo, 'botao-a'
    button.classList.add(`botao-${letra}`);

    // Adiciona o botão ao elemento 'teclado' no HTML
    elementos.teclado.appendChild(button);

    // Adiciona um evento de clique ao botão para chamar a função 'selecionarLetra' com a letra correspondente
    button.addEventListener('click', () => {
      selecionarLetra(letra);
    });
  }
}

//MOSTRAR BONECO
function mostrarErro() {
  // Calcula o índice do elemento da matriz 'elementos.boneco' a ser mostrado com base nas chances restantes
  const parte = elementos.boneco[5 - jogo.chances];

  // Remove a classe 'escondido' do elemento, tornando-o visível na interface do jogo
  parte.classList.remove('escondido');
};

// Esta função exibe uma mensagem na tela com base no argumento 'vitoria'.
function mostrarMensagem(vitoria) {
  // Cria a mensagem com base na condição 'vitoria'.
  const mensagem = vitoria ? '<p>Parabéns!</p><p>Você GANHOU!</p>' : '<p>Que pena!</p><p>Você PERDEU!</p>';

  // Atualiza o conteúdo do elemento 'elementos.textoMensagem' com a mensagem criada.
  elementos.textoMensagem.innerHTML = mensagem;

  // Define o estilo 'display' do elemento 'elementos.telaMensagem' para 'flex', tornando-o visível.
  elementos.telaMensagem.style.display = 'flex';

  // Adiciona uma classe CSS ao elemento 'elementos.telaMensagem' com base no valor de 'vitoria'.
  // Isso permite aplicar estilos diferentes com base no resultado.
  elementos.telaMensagem.classList.add(`mensagem-${vitoria ? 'vitoria' : 'derrota'}`);

  // Define 'jogo.emAndamento' como 'false' para indicar que o jogo não está mais em andamento.
  jogo.emAndamento = false;
};

function sortearPalavra() {
  // Gera um índice aleatório para selecionar uma palavra e dica a partir do array de palavras da dificuldade atual
  const i = Math.floor(Math.random() * palavras[jogo.dificuldade].length);

  // Obtém a palavra e a dica correspondentes ao índice gerado aleatoriamente
  const palavra = palavras[jogo.dificuldade][i].palavra;
  const dica = palavras[jogo.dificuldade][i].dica;

  // Chama a função 'definirPalavra' do objeto 'jogo' para configurar a palavra a ser adivinhada e sua dica
  jogo.definirPalavra(palavra, dica);

  // Registra a palavra original e a dica no console (para fins de depuração)
  console.log(jogo.palavra.original);
  console.log(jogo.palavra.dica);

  // Retorna a palavra original (embora não seja usado neste código)
  return jogo.palavra.original;
}

function mostrarPalavra() {
  // Atualiza o elemento de dica na interface do jogo com a dica da palavra atual
  elementos.dica.textContent = jogo.palavra.dica;

  // Limpa o conteúdo do elemento que exibe as letras da palavra a ser adivinhada
  elementos.palavra.textContent = '';

  // Itera sobre cada letra da palavra atual
  for (let i = 0; i < jogo.acertos.length; i++) {
    // Obtém a letra do jogador em maiúsculas para exibição
    const letra = jogo.acertos[i].toUpperCase();

    // Adiciona a letra à interface do jogo como uma div com classe 'letra-i' onde 'i' é a posição da letra na palavra
    elementos.palavra.innerHTML += `<div class="letra-${i}">${letra}</div>`;
  }
}

function iniciarJogo(dificuldade) {
  // Define a dificuldade do jogo com base no argumento 'dificuldade'
  jogo.dificuldade = dificuldade;

  // Oculta a tela inicial e exibe a tela do jogo
  elementos.telaInicial.style.display = 'none';
  elementos.telaJogo.style.display = 'flex';

  // Define que o jogo está em andamento
  jogo.emAndamento = true;

  // Seleciona aleatoriamente uma palavra para o jogo
  sortearPalavra();

  // Mostra a palavra na interface do jogo
  mostrarPalavra();
}

function substituirCaractere(str, indice, novoCaractere) {
  // Esta função recebe uma string 'str', um índice 'indice' e um novo caractere 'novoCaractere'.
  // Ela substitui o caractere na posição 'indice' da string 'str' pelo novo caractere 'novoCaractere' 
  // e retorna a string resultante.

  // Obtém a parte da string antes do índice 'indice'
  const parteAntes = str.substring(0, indice);

  // Obtém a parte da string após o índice 'indice'
  const parteDepois = str.substring(indice + 1);

  // Concatena a parte antes, o novo caractere e a parte depois para formar a nova string
  const novaString = parteAntes + novoCaractere + parteDepois;

  // Retorna a nova string resultante com a substituição feita
  return novaString;
}



elementos.botoes.reiniciar.addEventListener('click', () => novoJogo());
elementos.botoes.voltar.addEventListener('click', () => voltarInicio());
elementos.botoes.facil.addEventListener('click', () => iniciarJogo('facil'));




elementos.botoes.medio.addEventListener('click', () => iniciarJogo('medio'));
elementos.botoes.dificil.addEventListener('click', () => iniciarJogo('dificil'));

elementos.botoes.cadastrar.addEventListener('click', () => abrirTelaCadastroPalavra());
elementos.botoes.realizarCadastro.addEventListener('click', () => cadastrarPalavra());

function voltarInicio() {
  // Torna a tela inicial visível ao definir o estilo 'display' como 'flex'.
  elementos.telaInicial.style.display = 'flex';

  // Oculta a tela de cadastro ao definir o estilo 'display' como 'none'.
  elementos.telaCadastro.style.display = 'none';
}

function abrirTelaCadastroPalavra() {
  elementos.telaCadastro.style.display = 'flex';
  elementos.telaInicial.style.display = 'none';
}

function cadastrarPalavra() {
  const dificuldadeSelecionada = document.querySelector('input[name="dificuldade"]:checked').value;

  const novaPalavra = elementos.campos.palavra.value.trim();
  const novaDica = elementos.campos.dica.value.trim();

  if (novaPalavra.length === 0 || novaDica.length === 0) {
    alert('Por favor, preencha a palavra e a dica.');
    return;
  }

  const numLetrasDificuldade = {
    facil: 5,
    medio: 7,
    dificil: 9,
  };

  if (novaPalavra.length !== numLetrasDificuldade[dificuldadeSelecionada]) {
    alert(`A palavra deve ter ${numLetrasDificuldade[dificuldadeSelecionada]} letras para a dificuldade selecionada.`);
    return;
  }

  palavras[dificuldadeSelecionada].push({ palavra: novaPalavra, dica: novaDica });

  elementos.campos.palavra.value = '';
  elementos.campos.dica.value = '';

  voltarInicio();
}
