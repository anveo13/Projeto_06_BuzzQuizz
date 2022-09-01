/* buscar quizzes */
const listaQuizzes = document.querySelector("ul");

const promessa = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes`);
promessa.then(pegaQuizes);
    
function pegaQuizes(resposta) {
    arrayQuizes = resposta.data;
    arrayQuizes.forEach(quiz => {
        listaQuizzes.innerHTML += `<li>
                                    <div class="degrade"></div>
                                    <img src=${quiz.image}>
                                    <span>${quiz.title}</span>
                                </li>`
    }); 
}; 

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
    const divCriarPerguntas = document.querySelector(".esconder");

    divQuizForm.classList.add("esconder");
    divCriarPerguntas.classList.remove("esconder");
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

  return formInvalido
}

function renderizarPerguntas(){
    
    const div = document.querySelector('.questionario');

    div.innerHTML = '';

    for(let i = 0; i < perguntas; i++){

        div.innerHTML = div.innerHTML + `
            
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
  // const promessa = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', novoQuiz);
  // promessa.then( );
  // promessa.catch( )
}

function deuErro(erro){
  alert('Algo deu errado, a receita não foi salva!');
}