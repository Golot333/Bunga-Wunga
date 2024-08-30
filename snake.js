const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreElement = document.getElementById("score");
const pauseBtn = document.getElementById("pauseBtn");
const changeMusicBtn = document.getElementById("changeMusicBtn");

const audioFiles = [
    'background.mp3',
    'background2.mp3',
    'background3.mp3',
    'background4.mp3',
    'background5.mp3',
    'background6.mp3',
    'background7.mp3',
    'background8.mp3',

];

const appleImages = ['apple.png', 'apple2.png', 'apple3.png'];
const eatAudios = [
    new Audio('eat.mp3'),
    new Audio('eat2.mp3'),
];

let snake = [];
let apple = {};
let dx, dy, score, speed, gameInterval;
let snakeImage = new Image();
let currentAppleImage = new Image();
let isPaused = false;
let currentAudio;
let playedTracks = [];  // Массив для отслеживания уже проигранных треков
snakeImage.src = 'Brezhnev.png';

// Воспроизведение случайного фона
function playRandomBackgroundAudio() {
    if (playedTracks.length === audioFiles.length) {
        // Если все треки были проиграны, сбрасываем список
        playedTracks = [];
    }

    // Фильтруем список треков, чтобы исключить уже проигранные
    const availableTracks = audioFiles.filter(track => !playedTracks.includes(track));

    if (availableTracks.length === 0) {
        console.error('Нет доступных треков для воспроизведения.');
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableTracks.length);
    const selectedTrack = availableTracks[randomIndex];

    if (currentAudio) {
        currentAudio.pause(); // Останавливаем текущую музыку
        currentAudio.currentTime = 0; // Сбрасываем время трека
    }

    currentAudio = new Audio(selectedTrack);
    currentAudio.volume = 0.07;
    currentAudio.loop = true; // Зацикливаем музыку
    currentAudio.play().catch(error => {
        console.error('Ошибка при воспроизведении аудио:', error);
    });

    // Добавляем трек в список проигранных
    playedTracks.push(selectedTrack);
}

// Инициализация игры
function initGame() {
    score = 0;
    snake = [{ x: 100, y: 100 }];
    dx = 20;
    dy = 0;
    speed = 160;

    placeApple(); // Обновление местоположения яблока
    drawScore();

    // Воспроизведение случайного трека в начале игры
    playRandomBackgroundAudio();
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

// Основной игровой цикл
function gameLoop() {
    if (!isPaused) {
        moveSnake();
        draw();
        checkCollision();
    }
}

// Функция для паузы и возобновления игры
function togglePause() {
    if (isPaused) {
        gameInterval = setInterval(gameLoop, speed); // Продолжаем игру с той же скоростью
        isPaused = false;
        pauseBtn.textContent = 'Пауза';
    } else {
        clearInterval(gameInterval); // Ставим игру на паузу
        isPaused = true;
        pauseBtn.textContent = 'Продолжить';
    }
}

// Переключение музыки
function changeMusic() {
    playRandomBackgroundAudio(); // Просто вызываем функцию для смены трека
}

// Отрисовка змейки и яблока
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawApple();
}

// Отрисовка змейки
function drawSnake() {
    snake.forEach(part => ctx.drawImage(snakeImage, part.x, part.y, 20, 20));
}

// Отрисовка яблока
function drawApple() {
    ctx.drawImage(currentAppleImage, apple.x, apple.y, 20, 20);
}

// Обновление счётчика
function drawScore() {
    scoreElement.innerText = `Счёт: ${score}`;
}

// Воспроизведение случайного звука поедания
function playRandomEatAudio() {
    const randomIndex = Math.floor(Math.random() * eatAudios.length);
    const selectedAudio = eatAudios[randomIndex];
    selectedAudio.currentTime = 0; // Перематываем аудио в начало
    selectedAudio.volume = 0.03;   // Устанавливаем громкость
    selectedAudio.play().catch(error => {
        console.error('Ошибка при воспроизведении аудио:', error);
    });
}

// Движение змейки
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        playRandomEatAudio(); // Воспроизводим случайный звук поедания
        placeApple(); // Обновляем местоположение яблока
        drawScore(); // Обновляем счёт на экране
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

// Расположение яблока на поле
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

// Получение случайного изображения яблока
function getRandomApple() {
    return appleImages[Math.floor(Math.random() * appleImages.length)];
}

// Изменение направления движения змейки
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

// Проверка столкновений
function checkCollision() {
    const head = snake[0];

    // Телепортируем змейку на противоположную сторону, если она выходит за границы
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

    // Проверка столкновения с самим собой
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
    }
}

// Сброс игры
function resetGame() {
    clearInterval(gameInterval);
    document.getElementById("restartContainer").style.display = "block";
    if (currentAudio) {
        currentAudio.pause(); // Остановить музыку при окончании игры
    }
    playedTracks = []; // Сброс списка проигранных треков при перезапуске игры
}

// Начать игру заново
document.getElementById("restartButton").onclick = () => {
    document.getElementById("restartContainer").style.display = "none";
    initGame();
};

// Начало игры
startBtn.onclick = () => {
    startBtn.style.display = "none";
    initGame();
};

// Управление с клавиатуры
window.addEventListener("keydown", changeDirection);

// Обработка нажатий на кнопки
pauseBtn.addEventListener('click', togglePause);
changeMusicBtn.addEventListener('click', changeMusic);
