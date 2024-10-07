import Scene1 from './Scene/Scene1.js';
import Scene2 from './Scene/Scene2.js';
import WinScene from './Scene/WinScene.js';
import LoseScene from './Scene/LoseScene.js';

const config = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true, // Bật chế độ pixelArt
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Scene1, Scene2, WinScene, LoseScene],
};

window.onload = function () {
    var game = new Phaser.Game(config);
};
