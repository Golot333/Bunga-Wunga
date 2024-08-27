const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreElement = document.getElementById("score"); // Получаем элемент для отображения счёта
const eatAudio = document.getElementById("eatAudio");

const audioFiles = [
    'background.mp3',
    'background2.mp3',
    'background3.mp3'
];

// Функция для воспроизведения случайного аудиофайла
function playRandomBackgroundAudio() {
    // Случайный индекс от 0 до 2
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    
    // Создаем новый объект Audio с выбранным файлом
    const audio = new Audio(audioFiles[randomIndex]);
    
    // Воспроизводим аудиофайл
    audio.play().catch(error => {
        console.error('Ошибка при воспроизведении аудио:', error);
    });
}

// Добавляем обработчик события на кнопку или элемент страницы
document.addEventListener('click', function() {
    playRandomBackgroundAudio();
    // Удаляем обработчик события, если не нужно повторное воспроизведение при каждом клике
    document.removeEventListener('click', arguments.callee);
});

let snake = [{ x: 100, y: 100 }];
let apple = { x: 200, y: 200 };
let dx = 20;
let dy = 0;
let score = 0;
let speed = 160;
let gameInterval;
let snakeImage = new Image();
snakeImage.src = 'Brezhnev.png';

let appleImages = ['apple.png', 'apple2.png', 'apple3.png'];
let currentAppleImage = new Image();
currentAppleImage.src = getRandomApple(); // Инициализация изображения яблока

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawApple();
    drawScore(); // Отображаем счёт
}

function drawSnake() {
    snake.forEach(part => {
        ctx.drawImage(snakeImage, part.x, part.y, 20, 20);
    });
}

function drawApple() {
    ctx.drawImage(currentAppleImage, apple.x, apple.y, 20, 20);
}

function drawScore() {
    scoreElement.innerText = 'Счёт: ' + score; // Обновление текста счёта
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        eatAudio.currentTime = 0;
        eatAudio.volume = 0.03;
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
    
    const newAppleImage = new Image();
    newAppleImage.src = getRandomApple();  // Выбор нового изображения яблока
    newAppleImage.onload = function() {
        currentAppleImage = newAppleImage;  // Обновляем текущее изображение яблока после загрузки
    };
}

function getRandomApple() {
    const randomIndex = Math.floor(Math.random() * appleImages.length);
    return appleImages[randomIndex];
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
    speed = 160; // Сброс скорости до начального значения
    const playAgain = confirm("Начать заново?");
    if (playAgain) {
        startGame();
    }
}

// Инициализация игры
function startGame() {
    score = 0;
    snake = [{ x: 100, y: 100 }];
    dx = 20;
    dy = 0;
    

    drawScore(); // Отображение начального счёта
    currentAppleImage.src = getRandomApple(); // Убедитесь, что яблоко инициализировано
    placeApple(); // Начальное размещение яблока

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        moveSnake();
        draw();
        checkCollision(); // Не забывайте проверять столкновения
    }, speed);
}

startBtn.addEventListener("click", startGame);

startBtn.textContent = "Начать игру";
startBtn.style.display = "block";
startBtn.onclick = () => {
    startBtn.style.display = "none";
    startGame();
};

window.addEventListener("keydown", changeDirection);