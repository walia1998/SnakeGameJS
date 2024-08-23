const gameArea = document.getElementById('gameArea');
const gameSize = 400;
const cellSize = 20;
let snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}];
let food = {x: 300, y: 200};
let dx = cellSize;
let dy = 0;
let score = 0;
let gameStarted = false;


const eatSound = new Audio('./assets/eatSound.mp3');
eatSound.preload = 'auto';
const gameOverSound = new Audio('./assets/gameOver.mp3');
gameOverSound.preload = 'auto';
const startSound = new Audio('./assets/startGame.mp3');
startSound.preload = 'auto';

function createDiv(className, x, y) {
    const div = document.createElement('div');
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.classList.add(className);
    return div;
}

function draw() {
    gameArea.innerHTML = '';
    snake.forEach(segment => {
        const snakeElement = createDiv('snake', segment.x, segment.y);
        gameArea.appendChild(snakeElement);
    });
    const foodElement = createDiv('food', food.x, food.y);
    gameArea.appendChild(foodElement);
}

function updateSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        eatSound.play();
        moveFood();
    } else {
        snake.pop();
    }
}

function moveFood() {
    let newX, newY;
    do {
        newX = Math.floor(Math.random() * ((gameSize - cellSize) / cellSize)) * cellSize;
        newY = Math.floor(Math.random() * ((gameSize - cellSize) / cellSize)) * cellSize;
    } while (snake.some(segment => segment.x === newX && segment.y === newY));

    food = {x: newX, y: newY};
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const keyPressed = event.keyCode;
    const goingUp = dy === -cellSize;
    const goingDown = dy === cellSize;
    const goingRight = dx === cellSize;
    const goingLeft = dx === -cellSize;

    if (keyPressed === LEFT_KEY && !goingRight) { dx = -cellSize; dy = 0; }
    if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -cellSize; }
    if (keyPressed === RIGHT_KEY && !goingLeft) { dx = cellSize; dy = 0; }
    if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = cellSize; }
}

function checkGameOver() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= gameSize;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= gameSize;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function gameLoop() {
    if (checkGameOver()) {
        gameOverSound.play();
        alert('Game Over. Score: ' + score);
        document.location.reload();
        return;
    }
    setTimeout(() => {
        updateSnake();
        draw();
        drawScore();
        gameLoop();
    }, 100);
}

function drawScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.innerHTML = 'Score: ' + score;
    }
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startSound.play();
       
            document.addEventListener('keydown', changeDirection);
            gameLoop(); // Start the game loop after the delay
    }
}

function setupGame() {
    const scoreElement = document.createElement('div');
    scoreElement.id = 'score';
    scoreElement.classList.add('score');
    document.body.insertBefore(scoreElement, gameArea);

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.classList.add('button');
    document.body.appendChild(startButton);
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        startGame();
    });
}

setupGame();


