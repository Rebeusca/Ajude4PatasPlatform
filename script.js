const originalQuestions = [
  {
    question: "Qual foi a primeira capital do Brasil?",
    options: ["Rio de Janeiro", "Salvador", "Brasília", "São Paulo"],
    answer: "Salvador",
  },
  {
    question: "Qual é o maior país do mundo em termos de área?",
    options: ["Rússia", "Canadá", "China", "Estados Unidos"],
    answer: "Rússia",
  },
  {
    question: "Quando ocorreu a primeira grande guerra mundial?",
    options: ["1914-1918", "1939-1945", "1918-1920", "1945-1950"],
    answer: "1914-1918",
  },
  {
    question:
      "Qual é o nome do evento que marca a eleição de um novo papado na Igreja Católica?",
    options: ["Conclave", "Sínodo", "Concílio", "Catedral"],
    answer: "Conclave",
  },
  {
    question: "Em que ano foi sediada a primeira olimpíada moderna?",
    options: ["1896", "1900", "1904", "1912"],
    answer: "1896",
  },
  {
    question:
      "Qual é o nome do famoso monumento de pedra localizado na Índia, construído pelo imperador Shah Jahan em memória de sua esposa?",
    options: ["Taj Mahal", "Harmandir Sahib", "Red Fort", "Gateway of India"],
    answer: "Taj Mahal",
  },
  {
    question:
      "Qual é o nome do famoso cientista que desenvolveu a teoria da relatividade?",
    options: [
      "Isaac Newton",
      "Galileu Galilei",
      "Albert Einstein",
      "Nikola Tesla",
    ],
    answer: "Albert Einstein",
  },
  {
    question:
      "Qual é o nome do continente onde se localiza o deserto do Saara?",
    options: ["África", "Ásia", "América do Sul", "Oceania"],
    answer: "África",
  },
];

const startScreen = document.getElementById("tela-nome");
const quizScreen = document.getElementById("quiz");
const resultScreen = document.getElementById("resultado");

const nameInput = document.getElementById("nomeUsuario");
const startButton = document.getElementById("iniciarQuiz");
const tryAgainButton = document.getElementById("tentarNovamente");

const questionElement = document.getElementById("pergunta");
const optionsElement = document.getElementById("opcoes");
const questionCounterElement = document.getElementById("contador");
const timerElement = document.getElementById("tempoRestante");

const correctAnswersElement = document.getElementById("acertos");
const avgTimeElement = document.getElementById("tempoMedio");
const finalMessageElement = document.createElement("p");

let userName = "";
let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalResponseTime = 0;
let timer;
let timeLeft;
let questions = [];

// Função para embaralhar as perguntas
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Função para carregar a próxima pergunta
function loadQuestion() {
  clearInterval(timer);
  optionsElement.innerHTML = "";

  if (currentQuestionIndex >= questions.length) {
    showResult(); //Resultado final
    return;
  }

  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  questionCounterElement.textContent = `Pergunta ${
    currentQuestionIndex + 1
  } de ${questions.length}`;

  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option");
    button.onclick = () => checkAnswer(option, currentQuestion.answer);
    optionsElement.appendChild(button);
  });

  // Timer da pergunta
  timeLeft = 7;
  timerElement.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      totalResponseTime += 7;
      currentQuestionIndex++;
      loadQuestion();
    }
  }, 1000);
}

// Checagem de resposta selecionada
function checkAnswer(selectedOption, correctAnswer) {
  clearInterval(timer);
  totalResponseTime += 7 - timeLeft;

  if (selectedOption === correctAnswer) {
    correctAnswers++;
  }

  const allButtons = optionsElement.querySelectorAll(".option");

  allButtons.forEach((button) => {
    button.disabled = true;

    if (button.textContent === correctAnswer) {
      button.classList.add("correct");
    } else if (button.textContent === selectedOption) {
      button.classList.add("incorrect");
    }
  });

  // Mostragem de certa ou errada
  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion();
  }, 1500);
}

function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const avgTime = (totalResponseTime / questions.length).toFixed(1);

  if (correctAnswers <= 4) {
    finalMessageElement.textContent = `Você precisa estudar mais, ${userName}. Estes são os seus resultados:`;
    resultScreen.insertBefore(finalMessageElement, correctAnswersElement);

    correctAnswersElement.textContent = `Acertos: ${correctAnswers} de ${questions.length}`;
    avgTimeElement.textContent = `Tempo médio por resposta: ${avgTime}s`;
  } else {
    finalMessageElement.textContent = `Parabéns, ${userName}! Este é o seu resultado:`;
    resultScreen.insertBefore(finalMessageElement, correctAnswersElement);

    correctAnswersElement.textContent = `Acertos: ${correctAnswers} de ${questions.length}`;
    avgTimeElement.textContent = `Tempo médio por resposta: ${avgTime}s`;
  }
}
function startQuiz() {
  userName = nameInput.value.trim();
  if (userName.length < 2) {
    alert("O nome deve ter pelo menos 2 caracteres.");
    nameInput.focus();
    return;
  }

  currentQuestionIndex = 0;
  correctAnswers = 0;
  totalResponseTime = 0;
  questions = [...originalQuestions];
  shuffleArray(questions);

  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  loadQuestion();
}

startButton.addEventListener("click", startQuiz);
tryAgainButton.addEventListener("click", () => {
  // Para recomeçar, mostramos a tela inicial novamente
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  nameInput.value = "";
});
