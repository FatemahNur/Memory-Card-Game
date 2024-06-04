const gameContainer = document.querySelector('.memory-game');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart-btn');

let score = 0;
let timer;
let time = 0;
let flippedCards = [];
let matchedCards = [];
let cardsArray = [
    // Array of card objects with image URLs
];

let levels = [
    { rows: 2, cols: 4 },
    { rows: 3, cols: 4 },
    { rows: 4, cols: 4 },
    { rows: 4, cols: 5 },
    { rows: 4, cols: 6 },
    // Add more levels as needed
];

let currentLevel = 0;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createCard(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('memory-card');
    cardElement.dataset.name = card.name;

    const frontFace = document.createElement('div');
    frontFace.classList.add('front');
    frontFace.textContent = card.name; // Set text content on the front face

    const backFace = document.createElement('div');
    backFace.classList.add('back');

    cardElement.appendChild(frontFace);
    cardElement.appendChild(backFace);

    cardElement.addEventListener('click', flipCard);

    gameContainer.appendChild(cardElement);
}


function flipCard() {
    if (this === flippedCards[0]) return;

    this.classList.add('flip');

    if (flippedCards.length === 0) {
        flippedCards.push(this);
        return;
    }

    flippedCards.push(this);

    if (flippedCards[0].dataset.name === flippedCards[1].dataset.name) {
        matchedCards.push(flippedCards[0]);
        matchedCards.push(flippedCards[1]);
        score += 10;
        scoreDisplay.textContent = score;
        checkForWin();
    } else {
        score -= 2;
        score = Math.max(score, 0);
        scoreDisplay.textContent = score;
        setTimeout(() => {
            flippedCards[0].classList.remove('flip');
            flippedCards[1].classList.remove('flip');
        }, 1000);
    }

    flippedCards = [];
}

function checkForWin() {
    if (matchedCards.length === cardsArray.length) {
        clearInterval(timer);
        alert(`Congratulations! You won with a score of ${score} and a time of ${time} seconds.`);
        startNextLevel();
    }
}

function startNextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        score += 20;
        scoreDisplay.textContent = score;
        matchedCards = [];
        shuffledCards = [];
        gameContainer.innerHTML = '';
        createLevel(levels[currentLevel]);
        startTimer();
    } else {
        alert('You have completed all levels!');
    }
}

function restartGame() {
    clearInterval(timer);
    score = 0;
    scoreDisplay.textContent = score;
    time = 0;
    timerDisplay.textContent = time;
    gameContainer.innerHTML = '';
    matchedCards = [];
    shuffledCards = [];
    createLevel(levels[currentLevel]);
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        time++;
        timerDisplay.textContent = time;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function createLevel(level) {
    let totalPairs = level.rows * level.cols / 2;
    let images = [];
    for (let i = 0; i < totalPairs; i++) {
        let imgIndex = Math.floor(Math.random() * cardsArray.length);
        images.push({ name: `C ${i}`, img: cardsArray[imgIndex] });
        images.push({ name: `C ${i}`, img: cardsArray[imgIndex] });
    }
    shuffle(images);
    cardsArray = images;
    gameContainer.style.gridTemplateRows = `repeat(${level.rows}, 1fr)`;
    gameContainer.style.gridTemplateColumns = `repeat(${level.cols}, 1fr)`;
    cardsArray.forEach(card => createCard(card));
}


restartButton.addEventListener('click', restartGame);

createLevel(levels[currentLevel]);
startTimer();
