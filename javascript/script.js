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
