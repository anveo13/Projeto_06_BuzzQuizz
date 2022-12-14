/* buscar quizzes */
const listaQuizzes = document.querySelector(".alto");

const promessa = axios.get(
  `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes`
);
promessa.then(pegaQuizes);

function pegaQuizes(resposta) {
  const listaQuizzes = document.querySelector(".alto");
  const quizesCriado = document.querySelector(".quizz-criado");

  const quizes = localStorage.getItem("ids");
  const meusIds = JSON.parse(quizes);

  const arrayQuizes = resposta.data;

  console.log("arrayQuizes: " + arrayQuizes);
  console.log("meusIds: " + meusIds);

  const meusQuizes = arrayQuizes.filter(function (quiz) {
    return meusIds.includes(quiz.id);
  });

  console.log(meusQuizes);

  meusQuizes.forEach((quiz) => {
    quizesCriado.innerHTML += `<li>
                                <div class="degrade" id="${quiz.id}" onclick="entrarQuizz(this)"></div>
                                <img src=${quiz.image}> 
                                <span>${quiz.title}</span>
                             </li>`;
  });

  arrayQuizes.forEach((quiz) => {
    listaQuizzes.innerHTML += `<li>
                                    <div class="degrade" id="${quiz.id}" onclick="entrarQuizz(this)"></div>
                                    <img src=${quiz.image}>
                                    <span>${quiz.title}</span>
                                   </li>`;
  });
}

/* esconder quiz */
function criarQuizz() {
  const elemento = document.querySelector(".tela2");
  elemento.classList.remove("esconder");

  const elemento1 = document.querySelector(".corpo");
  elemento1.classList.add("esconder");
}

// tela 2
function comparador() {
  return Math.random() - 0.5;
}

function exibirQuizz(resposta) {
  quiz = resposta.data;
  const bannerQuizz = document.querySelector(".banner-fundo");

  bannerQuizz.innerHTML += `
               <div class="bannerImagem"></div>
               <img src=${quiz.image}>
               <h2>${quiz.title}</h2>`;

  const container2 = document.querySelector(".conteudoPerguntasTela2");
  container2.innerHTML = "";
  for (let i = 0; i < quiz.questions.length; i++) {
    let respostas = "";

    const container2 = document.querySelector(".conteudoPerguntasTela2");
    container2.innerHTML = "";
    for (let i = 0; i < quiz.questions.length; i++) {
      let respostas = "";
      quiz.questions[i].answers.sort(comparador);

      for (let j = 0; j < quiz.questions[i].answers.length; j++) {
        const ehCorreta = quiz.questions[i].answers[j].isCorrectAnswer;
        let estado;
        if (ehCorreta) {
          estado = "correta";
        } else {
          estado = "falsa";
        }
        respostas += `
                <div class="alternativas ${estado}" data-identifier="answer"onclick="selecionarResposta(this)">
                    <img src="${quiz.questions[i].answers[j].image}">
                    <p class="texto-pergunta">${quiz.questions[i].answers[j].text}</p>
                </div>`;
      }

      container2.innerHTML += `
            <section class="container-perguntas - ${
              i + 1
            }" data-identifier="question">
                <div class="titulo-perguntas" data-identifier="question" style="background-color:${
                  quiz.questions[i].color
                };">
                    <h2>${quiz.questions[i].title}</h2>
                </div>
                <div class="alternativa-perguntas" data-identifier="answer">
                    ${respostas}
                </div>
            </section>`;
    }
  }
}

let cliques = 0;
let acertos = 0;
let idQuizz;

function selecionarResposta(clique) {
  const campoRespostas = clique.parentNode;
  const campoPergunta = campoRespostas.parentNode;
  const todasPerguntas = document.querySelectorAll(".container-perguntas");
  const todasRespostas = campoRespostas.querySelectorAll(".alternativas");

  for (let i = 0; i < todasRespostas.length; i++) {
    todasRespostas[i].style.opacity = "0.5";
  }
  clique.style.opacity = "1";

  removerClique(todasRespostas);
  marcarResposta(campoRespostas, clique);
  scrolarPagina(campoPergunta, todasPerguntas);
}

function marcarResposta(campoRespostas, element) {
  const respostaCorreta = campoRespostas.querySelector(".correta");
  const respostasFalsas = campoRespostas.querySelectorAll(".falsa");

  respostaCorreta.querySelector("p").style.color = "#009C22";

  for (let i = 0; i < respostasFalsas.length; i++) {
    respostasFalsas[i].querySelector("p").style.color = "#FF4B4B";
  }

  if (conferirAcerto(element)) {
    acertos++;
  }

  cliques++;
}

function removerClique(clique) {
  for (let i = 0; i < clique.length; i++) {
    clique[i].removeAttribute("onclick");
  }
}

function conferirAcerto(resposta) {
  if (resposta.classList.contains("correta")) {
    return true;
  }
  return false;
}

function scrolarPagina(campoPergunta, todasPerguntas) {
  if (cliques === todasPerguntas.length) {
    exibirResultado();
    return;
  }

  for (let i = 0; i < todasPerguntas.length; i++) {
    if (campoPergunta === todasPerguntas[todasPerguntas.length - 1]) {
      return;
    }

    if (campoPergunta === todasPerguntas[i]) {
      setTimeout(function () {
        todasPerguntas[i + 1].scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }, 1000);
    }
  }
}

function calcularNivel() {
  const perguntas = quiz.questions.length;
  const porcentagem = Math.round((acertos / perguntas) * 100);
  let nivel;

  for (let i = 0; i < quiz.levels.length; i++) {
    if (porcentagem >= quiz.levels[i].minValue) {
      nivel = i;
    }
  }

  const resultadoObj = { porcentagem: porcentagem, nivelIndex: nivel };
  return resultadoObj;
}

function buscarQuizz(id) {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/" + id
  );
  promise.then(exibirQuizz);
}

function entrarQuizz(el) {
  window.scrollTo(0, 0);
  document.querySelector(".corpo").classList.add("esconder");
  document.querySelector(".criar-quiz-container").classList.add("esconder");
  document.querySelector(".segunda-tela").classList.remove("esconder");
  idQuizz = el.getAttribute("id");
  buscarQuizz(idQuizz);
}

function exibirResultado() {
  const resultado = calcularNivel();
  const nivel = quiz.levels[resultado.nivelIndex];
  const container2 = document.querySelector(".conteudoPerguntasTela2");
  container2.innerHTML += `
        <div class="quiz-finalizado" data-identifier="quizz-result">
            <div class="titulo-quiz-finalizado">
                <h2>${resultado.porcentagem}% de acerto: ${nivel.title}</h2>
            </div>
            <div class="resultado">
                <img src="${nivel.image}">
                <p>${nivel.text}</p>
            </div>
        </div>
        <section class="botoes-navegar">
            <button class="botao-reiniciar" onclick="reiniciarQuizz()">Reiniciar Quizz</button>
            <button class="voltar-home" onclick="voltarTelaInicial()">Voltar para home</button>
        </section>`;

  setTimeout(function () {
    document
      .querySelector(".quiz-finalizado")
      .scrollIntoView({ block: "center", behavior: "smooth" });
  }, 2000);
}

function voltarTelaInicial() {
  document.querySelector(".corpo").classList.remove("esconder");
  document.querySelector(".segunda-tela").classList.add("esconder");
  window.scrollTo({ top: 0 });
  pegaQuizes();
}

function reiniciarQuizz() {
  acertos = 0;
  cliques = 0;
  window.scrollTo({ top: 0, behavior: "smooth" });
  buscarQuizz(idQuizz);
}

// fim tela 2

// Inicio Tela 3
let perguntas = 0;
let nivel = 0;
let imagem = "";
const quizCompleto = {
  title: "",
  image: "",
  questions: [],
  levels: [],
};

function validarHexa(str) {
  const pattern = /^#[0-9A-F]{6}$/i;
  return pattern.test(str);
}

function validarURL(str) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(str);
}

function criarQuiz() {
  const elementoTitulo = document.querySelector(".titulo-quiz");
  const elementoImg = document.querySelector(".img-quiz");
  const elementoQtdPerguntas = document.querySelector(".qtd-perguntas");
  const elementoQtdNiveis = document.querySelector(".qtd-niveis");

  const novoQuiz = {
    titulo: elementoTitulo.value,
    imagem: elementoImg.value,
    perguntas: Number(elementoQtdPerguntas.value),
    nivel: Number(elementoQtdNiveis.value),
  };

  if (validarQuiz(novoQuiz)) {
    alert("Preencha os dados corretamente");
  } else {
    perguntas = novoQuiz.perguntas;
    nivel = novoQuiz.nivel;
    imagem = novoQuiz.imagem;

    quizCompleto.title = novoQuiz.titulo;
    quizCompleto.image = novoQuiz.imagem;

    const divQuizForm = document.querySelector(".criar-quiz");
    const divCriarPerguntas = document.querySelector(
      ".esconder-cadastrar-quiz"
    );

    divQuizForm.classList.add("esconder-cadastrar-quiz");
    divCriarPerguntas.classList.remove("esconder-cadastrar-quiz");

    renderizarPerguntas();
  }
}

function validarQuiz(novoQuiz) {
  let formInvalido = false;

  if (novoQuiz.titulo.length <= 20 || novoQuiz.titulo.length > 65) {
    formInvalido = true;
  } else if (!validarURL(novoQuiz.imagem)) {
    formInvalido = true;
  } else if (novoQuiz.perguntas < 3) {
    formInvalido = true;
  } else if (novoQuiz.nivel < 2) {
    formInvalido = true;
  }

  return formInvalido;
}

function renderizarPerguntas() {
  const div = document.querySelector(".formulario-box");

  for (let i = 0; i < perguntas; i++) {
    const numeroPergunta = i + 1;
    let classForm = `formulario form-${numeroPergunta}`;

    if (i > 0) {
      classForm = classForm + " esconder";
    } else {
      classForm = classForm + " open";
    }

    div.innerHTML =
      div.innerHTML +
      `
      <div class="${classForm}">
      <div class="caixa-perguntas">
        <div class="perguntas-respostas">
          <p>Pergunta ${numeroPergunta}</p>
        
         <div class="perguntasQuiz">
            <input type="text" class="input-form texto-pergunta" placeholder="Texto da pergunta">
            <input type="text" class="input-form cor-fundo" placeholder="Cor de fundo da pergunta">
         </div>
       </div>
        
       <div class="perguntas-respostas">
         <p>Resposta correta</p>
         
      
         <div class="respostasQuiz">
            <input type="text" class="input-form resp-certa" placeholder="Resposta correta">
            <input type="text" class="input-form url-certa" placeholder="URL da imagem">
         </div>
       </div>

        <div class="perguntas-respostas">
          <p>Resposta incorreta</p>
          <div class="respostasQuiz">
             <div class="resposta-incorreta">
                <input type="text" class="input-form primeira-incorreta" placeholder="Resposta incorreta 1">
                <input type="text" class="input-form imagem-incorreta" placeholder="URL da imagem 1">
             </div>
             <div class="resposta-incorreta">
                <input type="text" class="input-form segunda-incorreta" placeholder="Resposta incorreta 2">
                <input type="text" class="input-form img-url" placeholder="URL da imagem 2">
              </div>
             <div class="resposta-incorreta">
                <input type="text" class="input-form terceira-incorreta" placeholder="Resposta incorreta 3">
                <input type="text" class="input-form image-url" placeholder="URL da imagem 3">
              </div>
           </div>
       </div>
       </div>
       `;

    let classPerguntaFechada = `perguntas-icons form-${numeroPergunta}`;

    if (i == 0) {
      classPerguntaFechada = classPerguntaFechada + " esconder";
    }

    div.innerHTML =
      div.innerHTML +
      ` <div onclick="abrirPergunta('${numeroPergunta}')" class="${classPerguntaFechada}">
                       <p>Pergunta ${numeroPergunta}</p>
                       <img src="imagens/Vector.jpg">
                       </div>
                     `;
  }

  div.innerHTML += `
  <div class="botaoCriarPerguntas">
    <button onclick="criarPergunta()">Prosseguir para criar n??veis</button>
  </div>
  `;
}

function abrirPergunta(numeroPergunta) {
  const formAberto = document.querySelector(".open");
  const classForm = [...formAberto.classList].filter((classe) =>
    classe.includes("form-")
  )[0];

  formAberto.classList.add("esconder");
  formAberto.classList.remove("open");

  document
    .querySelector(`.perguntas-icons.${classForm}`)
    .classList.remove("esconder");

  const fechado = document.querySelector(
    `.perguntas-icons.form-${numeroPergunta}`
  );
  fechado.classList.add("esconder");

  const paraAbrir = document.querySelector(
    `.formulario.form-${numeroPergunta}`
  );
  paraAbrir.classList.remove("esconder");
  paraAbrir.classList.add("open");
}

function criarPergunta() {
  const textos = document.querySelectorAll(".texto-pergunta");
  const cores = document.querySelectorAll(".cor-fundo");
  const respCertas = document.querySelectorAll(".resp-certa");
  const urlsRespCertas = document.querySelectorAll(".url-certa");
  const primeirasRespErr = document.querySelectorAll(".primeira-incorreta");
  const primeirasImgErr = document.querySelectorAll(".imagem-incorreta");
  const segundasRespErr = document.querySelectorAll(".segunda-incorreta");
  const segundasImgErr = document.querySelectorAll(".img-url");
  const terceirasRespErr = document.querySelectorAll(".terceira-incorreta");
  const terceirasImgErr = document.querySelectorAll(".image-url");

  let perguntas = [];

  for (let i = 0; i < textos.length; i++) {
    const respostas = [
      {
        text: respCertas[i].value,
        image: urlsRespCertas[i].value,
        isCorrectAnswer: true,
      },
      {
        text: primeirasRespErr[i].value,
        image: primeirasImgErr[i].value,
        isCorrectAnswer: false,
      },
      {
        text: segundasRespErr[i].value,
        image: segundasImgErr[i].value,
        isCorrectAnswer: false,
      },
      {
        text: terceirasRespErr[i].value,
        image: terceirasImgErr[i].value,
        isCorrectAnswer: false,
      },
    ];

    const novaPergunta = {
      title: textos[i].value,
      color: cores[i].value,
      answers: respostas.filter((resposta) => resposta.text != ""),
    };

    perguntas.push(novaPergunta);
  }

  let podeCadastrar = true;

  perguntas.forEach(function (pergunta) {
    if (validarPergunta(pergunta)) {
      podeCadastrar = false;
    }
  });

  if (podeCadastrar) {
    quizCompleto.questions = perguntas;

    const divCriarPerguntas = document.querySelector(".criar-perguntas");
    const divCriarNivel = document.querySelector(
      ".criar-niveis.esconder-cadastrar-quiz"
    );

    divCriarPerguntas.classList.add("esconder-cadastrar-quiz");
    divCriarNivel.classList.remove("esconder-cadastrar-quiz");

    renderizarNivel();
  } else {
    alert("Preencha os dados corretamente");
  }
}

function validarPergunta(novaPergunta) {
  let formInvalido = false;

  if (novaPergunta.title.length < 20) {
    formInvalido = true;
  } else if (!validarHexa(novaPergunta.color)) {
    formInvalido = true;
  }

  const respostaCorreta = novaPergunta.answers.filter(function (pergunta) {
    return pergunta.isCorrectAnswer == true;
  });

  if (respostaCorreta.length > 0) {
    if (respostaCorreta[0].text.trim() == "") {
      formInvalido = true;
    } else if (!validarURL(respostaCorreta[0].image)) {
      formInvalido = true;
    }
  } else {
    formInvalido = true;
  }

  const respostasPreenchidas = novaPergunta.answers.filter(function (resposta) {
    return resposta.isCorrectAnswer == false && resposta.text != "";
  });

  if (respostasPreenchidas.length == 0) {
    formInvalido = true;
  } else {
    respostasPreenchidas.forEach(function (respostaIncorreta) {
      if (!validarURL(respostaIncorreta.image)) {
        formInvalido = true;
      }
    });
  }

  return formInvalido;
}

function finalizarQuiz() {
  const titulosNivel = document.querySelectorAll(".titulo-nivel");
  const elementoAcertos = document.querySelectorAll(".acerto-minimo");
  const elementoImgsNivel = document.querySelectorAll(".img-nivel");
  const elementoInfosNivel = document.querySelectorAll(".info-nivel");

  let niveis = [];

  for (let i = 0; i < titulosNivel.length; i++) {
    const criacaoNivel = {
      title: titulosNivel[i].value,
      image: elementoImgsNivel[i].value,
      text: elementoInfosNivel[i].value,
      minValue: Number(elementoAcertos[i].value),
    };

    niveis.push(criacaoNivel);
  }

  let podeCadastrar = true;

  niveis.forEach(function (nivel) {
    if (validarNivel(nivel)) {
      podeCadastrar = false;
    }
  });

  const acertoZero = niveis.filter(function (nivel) {
    return nivel.minValue == 0;
  });
  if (acertoZero.length == 0) {
    podeCadastrar = false;
  }

  if (podeCadastrar) {
    quizCompleto.levels = niveis;

    axios
      .post(
        "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes",
        quizCompleto
      )
      .then(function (response) {
        salvarLocalStorage(response.data.id);

        const divCriarNiveis = document.querySelector(".criar-niveis");
        const divFinalizarQuiz = document.querySelector(
          ".finalizar-quiz.esconder"
        );

        divCriarNiveis.classList.add("esconder-cadastrar-quiz");
        divFinalizarQuiz.classList.remove("esconder");

        quizPronto();
      });
  } else {
    alert("Preencha os dados corretamente");
  }
}

function salvarLocalStorage(quizId) {
  const idsCadastrados = localStorage.getItem("ids");

  if (idsCadastrados != null) {
    const idsArray = JSON.parse(idsCadastrados);
    idsArray.push(quizId);
    localStorage.setItem("ids", JSON.stringify(idsArray));
  } else {
    localStorage.setItem("ids", JSON.stringify([quizId]));
  }
}

function renderizarNivel() {
  const div = document.querySelector(".questionario-nivel");

  div.innerHTML = "";

  for (let i = 0; i < nivel; i++) {
    div.innerHTML =
      div.innerHTML +
      `
    <div class="questionario-nivel">
    <div class="perguntas-respostas data-identifier=level">
        <p>N??vel ${i + 1}</p>

        <div class="perguntasQuiz">
            <input type="text" class="input-form titulo-nivel" placeholder="T??tulo do n??vel">
            <input type="text" class="input-form acerto-minimo" placeholder="% de acerto m??nima">
            <input type="text" class="input-form img-nivel" placeholder="URL da imagem do n??vel">
            <input type="text" class="input-form info-nivel" placeholder=" Descri????o do n??vel">
        </div>
    </div>

    `;
  }
}

function validarNivel(criacaoNivel) {
  let formInvalido = false;

  if (criacaoNivel.title.trim().length < 10) {
    formInvalido = true;
  } else if (criacaoNivel.minValue < 0 || criacaoNivel.minValue > 100) {
    formInvalido = true;
  } else if (!validarURL(criacaoNivel.image)) {
    formInvalido = true;
  } else if (criacaoNivel.text.length < 30) {
    formInvalido = true;
  }

  return formInvalido;
}

function quizPronto() {
  const divQuizPronto = document.querySelector(".finalizar-quiz .quiz-pronto");
  divQuizPronto.innerHTML = `<img src="${imagem}"></img>`;
}

function voltarHome() {
  document.querySelector(".finalizar-quiz").classList.add("esconder");
  document.querySelector(".corpo").classList.remove("esconder");
  document.querySelector(".meus-quizzes").classList.remove("esconder");
  document.querySelector(".segunda-tela").classList.add("esconder");
  document.querySelector(".tela-quizzes-pra-criar").classList.add("esconder");
  window.scrollTo(0, 0);
  pegaQuizes();
}
// Fim Tela 3
