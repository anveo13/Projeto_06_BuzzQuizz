let acertos = 0;
let cliques = 0;
let idQuizz;
let quizz;

function comparador () { 
	return Math.random() - 0.5; 
}

function iniciarPagina () {
    window.scrollTo(0,0);
    buscarQuizzes();
}