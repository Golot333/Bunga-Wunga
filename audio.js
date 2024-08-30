// audio.js

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

const eatAudios = [
    new Audio('eat.mp3'),
    new Audio('eat2.mp3'),
];

let currentAudio;
let playedTracks = [];

export function playRandomBackgroundAudio() {
    if (playedTracks.length === audioFiles.length) {
        playedTracks = [];
    }

    const availableTracks = audioFiles.filter(track => !playedTracks.includes(track));
    const randomIndex = Math.floor(Math.random() * availableTracks.length);
    const selectedTrack = availableTracks[randomIndex];

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(selectedTrack);
    currentAudio.volume = 0.07;
    currentAudio.loop = true;
    currentAudio.play().catch(error => {
        console.error('Ошибка при воспроизведении аудио:', error);
    });

    playedTracks.push(selectedTrack);
}

export function playRandomEatAudio() {
    const randomIndex = Math.floor(Math.random() * eatAudios.length);
    const selectedAudio = eatAudios[randomIndex];
    selectedAudio.currentTime = 0;
    selectedAudio.volume = 0.03;
    selectedAudio.play().catch(error => {
        console.error('Ошибка при воспроизведении аудио:', error);
    });
}
