const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreElement = document.getElementById("score");
const eatAudio = document.getElementById("eatAudio");

const audioFiles = [
    'background.mp3',
    'background2.mp3',
    'background3.mp3',
    'background4.mp3',
    'background5.mp3',
    'background6.mp3',
    'background7.mp3',
    'background8.mp3',
    'background9.mp3',
];

const appleImages = ['apple.png', 'apple2.png', 'apple3.png'];
let snake = [];
let apple = {};
let dx, dy, score, speed, gameInterval;
let snakeImage = new Image();
let currentAppleImage = new Image();
snakeImage.src = 'Brezhnev.png';

// Воспроизведение случайного фона
function playRandomBackgroundAudio() {
    const audio = new Audio(audioFiles[Math.floor(Math.random() * audioFiles.length)]);
    audio.volume = 0.07;
    audio.play().catch(console.error);
}

// Добавляем обработчик для воспроизведения аудио при первом клике
document.addEventListener('click', function playAudioOnce() {
    playRandomBackgroundAudio();
    document.removeEventListener('click', playAudioOnce);
});

let currentAudio; // Переменная для хранения текущего аудиофайла

// Функция для воспроизведения случайного аудиофайла
function playRandomBackgroundAudio() {
    if (currentAudio) {
        currentAudio.pause(); // Останавливаем текущую музыку
    }

    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    currentAudio = new Audio(audioFiles[randomIndex]);
    currentAudio.volume = 0.07;
    currentAudio.loop = true; // Зацикливаем музыку
    currentAudio.play().catch(error => {
        console.error('Ошибка при воспроизведении аудио:', error);
    });
}

// Привязываем функцию playRandomBackgroundAudio к кнопке "Поменять музыку"
document.querySelectorAll('.кнопки')[1].addEventListener('click', playRandomBackgroundAudio);

function initGame() {
    score = 0;
    snake = [{ x: 100, y: 100 }];
    dx = 20;
    dy = 0;
    speed = 160;

    currentAppleImage.src = getRandomApple();
    placeApple();
    drawScore();
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

function gameLoop() {
    moveSnake();
    draw();
    checkCollision();
}

let isPaused = false; // Переменная для отслеживания состояния паузы

function togglePause() {
    if (isPaused) {
        // Если игра на паузе, продолжаем игру
        gameInterval = setInterval(() => {
            moveSnake();
            draw();
            checkCollision();
        }, speed);
        isPaused = false;
    } else {
        // Если игра не на паузе, ставим её на паузу
        clearInterval(gameInterval);
        isPaused = true;
    }
}

// Привязываем функцию togglePause к кнопке "Пауза"
document.querySelector('.кнопки').addEventListener('click', togglePause);

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

function playRandomEatAudio() {
    const randomIndex = Math.floor(Math.random() * 3); // Выбираем случайное число от 0 до 2
    const eatAudios = [
        document.getElementById('eatAudio1'),
        document.getElementById('eatAudio2'),
        document.getElementById('eatAudio3')
    ];
    
    const selectedAudio = eatAudios[randomIndex];
    selectedAudio.currentTime = 0; // Перематываем аудио в начало
    selectedAudio.volume = 0.03;   // Устанавливаем громкость
    selectedAudio.play().catch(error => {
        console.error('Ошибка при воспроизведении аудио:', error);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        playRandomEatAudio(); // Воспроизводим случайный звук поедания
        speed = Math.max(speed - 10, 50);  // Увеличиваем скорость
        placeApple();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}



function placeApple() {
    let validPosition = false;

    while (!validPosition) {
        // Генерируем случайные координаты для яблока
        apple.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
        apple.y = Math.floor(Math.random() * (canvas.height / 20)) * 20;

        // Проверяем, не пересекается ли яблоко с телом змейки
        validPosition = !snake.some(part => part.x === apple.x && part.y === apple.y);
    }

    // Обновляем изображение яблока
    const newAppleImage = new Image();
    newAppleImage.src = getRandomApple();
    newAppleImage.onload = () => {
        currentAppleImage = newAppleImage;
    };
}

function getRandomApple() {
    return appleImages[Math.floor(Math.random() * appleImages.length)];
}

function changeDirection(event) {
    const directions = {
        'ArrowUp': [0, -20],
        'ArrowDown': [0, 20],
        'ArrowLeft': [-20, 0],
        'ArrowRight': [20, 0]
    };

    if (directions[event.key]) {
        const [newDx, newDy] = directions[event.key];
        if ((newDx !== -dx || newDy !== -dy)) { // предотвращение обратного движения
            dx = newDx;
            dy = newDy;
        }
    }
}

function checkCollision() {
    const head = snake[0];

    // Если змейка выходит за левую или правую границу, телепортируем её на противоположную сторону
    if (head.x < 0) {
        head.x = canvas.width - 20;
    } else if (head.x >= canvas.width) {
        head.x = 0;
    }

    // Если змейка выходит за верхнюю или нижнюю границу, телепортируем её на противоположную сторону
    if (head.y < 0) {
        head.y = canvas.height - 20;
    } else if (head.y >= canvas.height) {
        head.y = 0;
    }

    // Проверяем, не столкнулась ли змейка с собой
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

startBtn.onclick = () => {
    startBtn.style.display = "none";
    initGame();
};

window.addEventListener("keydown", changeDirection);