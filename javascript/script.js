/* buscar quizzes */
const listaQuizzes = document.querySelector(".alto");

const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes`);
promessa.then(pegaQuizes);
 
function pegaQuizes(resposta) {
    arrayQuizes = resposta.data;
    arrayQuizes.forEach(quiz => {
        listaQuizzes.innerHTML += `<li>
                                    <div class="degrade" id="${quiz.id}" onclick="entrarQuizz(this)"></div>
                                    <img src=${quiz.image}>
                                    <span>${quiz.title}</span>
                                   </li>`
    }); 
}; 




        



/* esconder quiz */
function criarQuizz(){
  const elemento = document.querySelector(".tela2");
	elemento.classList.remove("esconder");

  const elemento1 = document.querySelector(".corpo");
	elemento1.classList.add("esconder");
}
// esconder tela 1 e entrar tela 2

function entrarQuizz (element) {
  
  window.scrollTo(0,0);
  document.querySelector(".corpo").classList.add("esconder");
  document.querySelector(".criar-quiz-container").classList.add("esconder");
  document.querySelector(".segunda-tela").classList.remove("esconder");
  idQuizz = element.getAttribute("id");
    buscarQuizz(idQuizz);
  
}

// 
// tela 2


  

function exibirQuizz (resposta){
   quiz = resposta.data;
    const bannerQuizz = document.querySelector(".banner-fundo");
               
               bannerQuizz.innerHTML +=  `
               <div class="bannerImagem"></div>
               <img src=${quiz.image}>
               <h2>${quiz.title}</h2>`;


        
    
}


function buscarQuizz (id) {
  const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/" + id);
        promise.then(exibirQuizz);
}
  







// fim tela 2



// Inicio Tela 3
let perguntas = 0;

function validURL(str) {
  var pattern = new RegExp(
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

function criarPerguntas() {
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

  // validar
  if (validarForm(novoQuiz)) {
    alert("Preencha os dados corretamente");
  } else {
    perguntas = novoQuiz.perguntas;

    const divQuizForm = document.querySelector(".criar-quiz");
    const divCriarPerguntas = document.querySelector(".esconder-cadastrar-quiz");

    divQuizForm.classList.add("esconder-cadastrar-quiz");
    divCriarPerguntas.classList.remove("esconder-cadastrar-quiz");

    renderizarPerguntas();
  }
}

function validarForm(novoQuiz) {
  let formInvalido = false;

  if (novoQuiz.titulo.length <= 20 || novoQuiz.titulo.length > 65) {
    formInvalido = true;
  } else if (!validURL(novoQuiz.imagem)) {
    formInvalido = true;
  } else if (novoQuiz.perguntas < 3) {
    formInvalido = true;
  } else if (novoQuiz.nivel < 2) {
    formInvalido = true;
  }

  return formInvalido;
}

function renderizarPerguntas() {
  const div = document.querySelector(".questionario");

  div.innerHTML = "";

  for (let i = 0; i < perguntas; i++) {
    div.innerHTML =
      div.innerHTML +
      `
      <div class="perguntas-respostas">
        <p>Pergunta ${i + 1}</p>
        
        <div class="perguntasQuiz">
            <input type="text" class="input-form texto-quiz" placeholder="Texto da pergunta">
            <input type="text" class="input-form cor" placeholder="Cor de fundo da pergunta">
        </div>
     </div>
        
    <div class="perguntas-respostas">
        <p>Resposta correta</p>
         
      
         <div class="respostasQuiz">
            <input type="text" class="input-form" placeholder="Resposta correta">
            <input type="text" class="input-form" placeholder="URL da imagem">
        </div>
    </div>

        <div class="perguntas-respostas">
          <p>Resposta incorreta</p>

          <div class="respostasQuiz">
             <div class="resposta-incorreta">
                <input type="text" class="input-form" placeholder="Resposta incorreta 1">
                <input type="text" class="input-form" placeholder="URL da imagem 1">
             </div>

             <div class="resposta-incorreta">
                <input type="text" class="input-form" placeholder="Resposta incorreta 2">
                <input type="text" class="input-form" placeholder="URL da imagem 2">
              </div>

             <div class="resposta-incorreta">
                <input type="text" class="input-form" placeholder="Resposta incorreta 3">
                <input type="text" class="input-form" placeholder="URL da imagem 3">
              </div>
           </div>
       
        `;
  }
}

function criarNiveis() {
  const divCriarPerguntas = document.querySelector(".criar-perguntas");
  const divCriarNivel = document.querySelector(".criar-niveis.esconder");

  divCriarPerguntas.classList.add("esconder");
  divCriarNivel.classList.remove("esconder");
}

function adicionarQuiz() {
}
// Fim Tela 3
