import { playRandomBackgroundAudio, playRandomEatAudio } from './audio.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const appleImages = ['apple.png', 'apple2.png', 'apple3.png'];
let snake = [];
let apple = {};
let dx, dy, score, speed, gameInterval;
let snakeImage = new Image();
let currentAppleImage = new Image();
let isPaused = false;
snakeImage.src = 'images/Brezhnev.png';

function initGame() {
    score = 0;
    snake = [{ x: 100, y: 100 }];
    dx = 20;
    dy = 0;
    speed = 160;

    placeApple();
    drawScore();
    playRandomBackgroundAudio();

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

function gameLoop() {
    if (!isPaused) {
        moveSnake();
        draw();
        checkCollision();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawApple();
}

function drawSnake() {
    snake.forEach(part => ctx.drawImage(snakeImage, part.x, part.y, 20, 20));
}

function drawApple() {
    ctx.drawImage(currentAppleImage, apple.x, apple.y, 20, 20);
}

function drawScore() {
    scoreElement.innerText = `Счёт: ${score}`;
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        playRandomEatAudio();
        placeApple();
        drawScore();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function placeApple() {
    let validPosition = false;

    while (!validPosition) {
        apple.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
        apple.y = Math.floor(Math.random() * (canvas.height / 20)) * 20;

        validPosition = !snake.some(part => part.x === apple.x && part.y === apple.y);
    }

    const newAppleImage = new Image();
    newAppleImage.src = getRandomApple();
    newAppleImage.onload = () => {
        currentAppleImage = newAppleImage;
    };
}

function getRandomApple() {
    return appleImages[Math.floor(Math.random() * appleImages.length)];
}

function changeDirection(direction) {
    const directions = {
        'up': [0, -20],
        'down': [0, 20],
        'left': [-20, 0],
        'right': [20, 0]
    };

    const [newDx, newDy] = directions[direction];
    if ((newDx !== -dx || newDy !== -dy)) {
        dx = newDx;
        dy = newDy;
    }
}

document.getElementById("upBtn").addEventListener('touchstart', () => changeDirection('up'));
document.getElementById("downBtn").addEventListener('touchstart', () => changeDirection('down'));
document.getElementById("leftBtn").addEventListener('touchstart', () => changeDirection('left'));
document.getElementById("rightBtn").addEventListener('touchstart', () => changeDirection('right'));

function checkCollision() {
    const head = snake[0];

    if (head.x < 0) {
        head.x = canvas.width - 20;
    } else if (head.x >= canvas.width) {
        head.x = 0;
    }

    if (head.y < 0) {
        head.y = canvas.height - 20;
    } else if (head.y >= canvas.height) {
        head.y = 0;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
    }
}

function resetGame() {
    clearInterval(gameInterval);
    document.getElementById("restartContainer").style.display = "block";
}

document.getElementById("restartButton").onclick = () => {
    document.getElementById("restartContainer").style.display = "none";
    initGame();
};

initGame();
