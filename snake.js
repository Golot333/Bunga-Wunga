const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const backgroundAudio = document.getElementById("backgroundAudio");
const eatAudio = document.getElementById("eatAudio");

let snake = [{ x: 100, y: 100 }];
let apple = { x: 200, y: 200 };
let dx = 20;
let dy = 0;
let score = 0;
let speed = 100;
let gameInterval;
let snakeImage = new Image();
snakeImage.src = 'Brezhnev.png';

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawApple();
}

function drawSnake() {
    snake.forEach(part => {
        ctx.drawImage(snakeImage, part.x, part.y, 20, 20);
    });
}

function drawApple() {
    const appleImage = new Image();
    appleImage.src = 'apple.png';
    appleImage.onload = function() {
        ctx.drawImage(appleImage, apple.x, apple.y, 20, 20);
    };
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        eatAudio.currentTime = 0;
        eatAudio.volume = 0.1;
        eatAudio.play();
        speed = Math.max(speed - 10, 50);  // Увеличиваем скорость
        placeApple();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function placeApple() {
    apple.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    apple.y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
}

function changeDirection(event) {
    switch(event.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -20;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = 20;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -20;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = 20;
                dy = 0;
            }
            break;
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    clearInterval(gameInterval);
    const playAgain = confirm("Начать заново?");
    if (playAgain) {
        startGame();
    }
}

function startGame() {
    snake = [{ x: 100, y: 100 }];
    apple = { x: 200, y: 200 };
    dx = 20;
    dy = 0;
    speed = 200;
    score = 0;
    backgroundAudio.volume = 0.1;
    backgroundAudio.play();
    draw();
    gameInterval = setInterval(() => {
        moveSnake();
        checkCollision();
        draw();
    }, speed);
}

startBtn.textContent = "Начать игру";
startBtn.style.display = "block";
startBtn.onclick = () => {
    startBtn.style.display = "none";
    startGame();
};

window.addEventListener("keydown", changeDirection);