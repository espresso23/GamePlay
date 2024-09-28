import Scene1 from './Scene1.js';
import Scene2 from './Scene2.js';
import WinScene from './WinScene.js';
import LoseScene from './LoseScene.js';

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


// // Biến trạng thái (nếu cần)
// let playerHP = 100, mobHP = 100, bossHP = 200;
// let playerXP = 0;
// let isPlayerTurn = true;
// const skillDamage = { Q: 20, W: 30, E: 40, R: 50 };

// function preload() {
//     // Đảm bảo đường dẫn đúng tới các asset
//     this.load.image('background', './asset/background/background3.png');
//     this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
//     this.load.spritesheet('mob', 'assets/mob.png', { frameWidth: 32, frameHeight: 48 });
//     this.load.spritesheet('boss', 'assets/boss.png', { frameWidth: 64, frameHeight: 64 });
//     this.load.spritesheet('blastQ', 'assets/BlastQ.png', { frameWidth: 440, frameHeight: 549 });
//     this.load.spritesheet('blastW', 'assets/BlastW.png', { frameWidth: 440, frameHeight: 549 });
//     this.load.spritesheet('blastE', 'assets/BlastE.png', { frameWidth: 440, frameHeight: 549 });
//     this.load.spritesheet('blastR', 'assets/BlastR.png', { frameWidth: 440, frameHeight: 549 });
// }

// function create() {
//     // Thêm hình nền
//     this.add.image(400, 300, 'background');

//     // Thêm nhân vật và kẻ thù với sprite đúng
//     this.player = this.physics.add.sprite(100, 450, 'player');
//     this.mob = this.physics.add.sprite(700, 450, 'mob'); // Sử dụng sprite 'mob'
//     this.boss = this.physics.add.sprite(700, 450, 'boss'); // Sử dụng sprite 'boss'
//     this.boss.setVisible(false); // Ẩn boss ban đầu

//     // Tạo các phím kỹ năng
//     this.skills = this.input.keyboard.addKeys({
//         Q: Phaser.Input.Keyboard.KeyCodes.Q,
//         W: Phaser.Input.Keyboard.KeyCodes.W,
//         E: Phaser.Input.Keyboard.KeyCodes.E,
//         R: Phaser.Input.Keyboard.KeyCodes.R
//     });

//     // Tạo animation cho các kỹ năng
//     this.createSkillAnimations();

//     // Optionally, bạn có thể thêm HP bars, UI, v.v. ở đây
// }

// function update() {
//     if (isPlayerTurn) {
//         if (Phaser.Input.Keyboard.JustDown(this.skills.Q)) {
//             activateSkill.call(this, 'Q', this.player.x, this.player.y);
//         }
//         if (Phaser.Input.Keyboard.JustDown(this.skills.W)) {
//             activateSkill.call(this, 'W', this.player.x, this.player.y);
//         }
//         if (Phaser.Input.Keyboard.JustDown(this.skills.E)) {
//             activateSkill.call(this, 'E', this.player.x, this.player.y);
//         }
//         if (Phaser.Input.Keyboard.JustDown(this.skills.R)) {
//             activateSkill.call(this, 'R', this.player.x, this.player.y);
//         }
//     }
// }

// function createSkillAnimations() {
//     // Tạo animation cho blastQ
//     this.anims.create({
//         key: 'blastQ_anim',
//         frames: this.anims.generateFrameNumbers('blastQ', { start: 0, end: 15 }),
//         frameRate: 10,
//         repeat: 0
//     });

//     // Tạo animation cho blastW
//     this.anims.create({
//         key: 'blastW_anim',
//         frames: this.anims.generateFrameNumbers('blastW', { start: 0, end: 15 }),
//         frameRate: 10,
//         repeat: 0
//     });

//     // Tạo animation cho blastE
//     this.anims.create({
//         key: 'blastE_anim',
//         frames: this.anims.generateFrameNumbers('blastE', { start: 0, end: 15 }),
//         frameRate: 10,
//         repeat: 0
//     });

//     // Tạo animation cho blastR
//     this.anims.create({
//         key: 'blastR_anim',
//         frames: this.anims.generateFrameNumbers('blastR', { start: 0, end: 15 }),
//         frameRate: 10,
//         repeat: 0
//     });
// }

// function activateSkill(skill, x, y) {
//     let effect;
//     switch (skill) {
//         case 'Q':
//             effect = this.add.sprite(x, y, 'blastQ');
//             effect.play('blastQ_anim');
//             break;
//         case 'W':
//             effect = this.add.sprite(x, y, 'blastW');
//             effect.play('blastW_anim');
//             break;
//         case 'E':
//             effect = this.add.sprite(x, y, 'blastE');
//             effect.play('blastE_anim');
//             break;
//         case 'R':
//             effect = this.add.sprite(x, y, 'blastR');
//             effect.play('blastR_anim');
//             break;
//     }

//     // Xóa sprite sau khi animation hoàn thành
//     effect.on('animationcomplete', () => {
//         effect.destroy();
//     }, this);

//     // Sau khi tấn công, chuyển lượt sang kẻ thù
//     isPlayerTurn = false;
//     this.time.delayedCall(1000, enemyTurn, [], this);
// }

// function enemyTurn() {
//     // Tấn công của mob
//     if (mobHP > 0) {
//         let mobDamage = Phaser.Math.Between(10, 20);
//         playerHP -= mobDamage;
//         console.log(`Mob attacked! Player HP: ${playerHP}`);
//         // Cập nhật UI HP nếu có
//     }

//     // Tấn công của boss nếu mob đã bị đánh bại
//     if (mobHP <= 0 && bossHP > 0) {
//         this.boss.setVisible(true);
//         let bossDamage = Phaser.Math.Between(20, 30);
//         playerHP -= bossDamage;
//         console.log(`Boss attacked! Player HP: ${playerHP}`);
//         // Cập nhật UI HP nếu có
//     }

//     // Kiểm tra thắng thua
//     checkWinLose.call(this);

//     // Chuyển lượt người chơi lại nếu chưa thắng thua
//     if (playerHP > 0 && (mobHP > 0 || bossHP > 0)) {
//         isPlayerTurn = true;
//     }
// }

// function checkWinLose() {
//     if (playerHP <= 0) {
//         showEndScreen.call(this, 'Game Over');
//     } else if (mobHP <= 0 && bossHP <= 0) {
//         showEndScreen.call(this, 'You Win!');
//     }
// }

// function showEndScreen(message) {
//     this.add.text(400, 300, message, {
//         font: '48px Arial',
//         fill: '#ffffff'
//     }).setOrigin(0.5);

//     this.physics.pause(); // Dừng game
// }
