import Enemy from "./entities/Enemy.js";
import Player from "./entities/player.js";

class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    preload() {

    }

    create() {
        // Background setup
        document.getElementById('health-bars').style.display = 'flex'; // Hiển thị thanh máu 
        this.background = this.add.image(0, 0, 'background');
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
       // this.add.text(20, 20, "Playing game", { font: "25px Arial", fill: "yellow" });

        // SkillQ setup
        this.skillQ = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "skillQ");
        this.skillQ.setVisible(false);
        this.skillW = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "skillW");
        this.skillW.setVisible(false);

        // Create player
        this.player = new Player(this, this.sys.game.config.width / 2 - 400, this.sys.game.config.height / 2 + 70,'player-health-bar', 'player-name', 'player-health-number');

        // Enemy Animations



        // Create enemies
        this.enemies = [];
        const positions = [
            { x: this.sys.game.config.width / 2 + 350, y: this.sys.game.config.height / 2 - 100 },
            { x: this.sys.game.config.width / 2 + 450, y: this.sys.game.config.height / 2 + 90 },
            { x: this.sys.game.config.width / 2 + 400, y: this.sys.game.config.height / 2 - 30 }
        ];

        // Initialize enemies at the given positions
        positions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y,'enemy-health-bar', 'enemy-name', 'enemy-health-number');
            this.enemies.push(enemy); // Add enemy to the array
        });

        // Animation for skill Q


        this.skillQ.on('animationcomplete', () => {
            this.skillQ.setVisible(false); // Hide skill sprite after animation
        });
        this.skillW.on('animationcomplete', () => {
            this.skillW.setVisible(false); // Hide skill sprite after animation
        });

        // Handle skill 'Q'
        this.input.keyboard.on('keydown-Q', () => {
            this.player.useSkillQ();
        });
        this.input.keyboard.on('keydown-W', () => {
            this.player.useSkillW();
        });
        this.input.keyboard.on('keydown-E', () => {
            this.player.useSkillE();
        });
        this.input.keyboard.on('keydown-R', () => {
            this.player.useSkillR();
        });
        this.attack = this.physics.add.sprite(this, this.sys.game.config.width / 2 - 400, this.sys.game.config.height / 2 + 70, 'attack');
        this.attack.play("attack")
        // Handle player attack
        this.input.on('pointerdown', () => {
            this.player.attack();
        });

        this.events.on('update', this.checkGameOver, this);
    }

    // Logic for player attacking enemy
    handlePlayerAttack(attack, enemy) {
        enemy.takeDamage(10); // Gọi phương thức takeDamage để xử lý
        if (enemy.health <= 0) {
            this.handleEnemyDeath(enemy); // Gọi phương thức chết
        }
        attack.destroy(); // Xóa hitbox
    }

    // Logic to randomly make enemy attack
    handleEnemyDeath(enemy) {
        if (enemy.health <= 0) {
            console.log('Enemy has died.');
            enemy.sprite.play('enemy1Dead'); // Chạy hoạt ảnh chết
            enemy.sprite.on('animationcomplete', () => {
                enemy.sprite.destroy(); // Xóa sprite sau khi hoạt ảnh hoàn tất
                const index = this.enemies.indexOf(enemy);
                if (index !== -1) {
                    this.enemies.splice(index, 1);
                }
            });
        }
    }
    handlePlayerDeath(player) {
        if (this.player.health <= 0) {
            console.log('Player has died.');
            this.player.sprite.play('dead').setScale(2); // Chạy hoạt ảnh chết
            this.player.sprite.on('animationcomplete', () => {
                this.player.sprite.destroy(); // Xóa sprite sau khi hoạt ảnh hoàn tất
            });
        }
    }
    checkGameOver() {
        if (this.enemies.length === 0) {
            this.showEndScreen('win');
        } else if (this.player.health <= 0) {
            this.showEndScreen('lose');
        }
    }

    showEndScreen(result) {
  // Chuyển cảnh sau một khoảng thời gian
        this.time.delayedCall(1200, () => {
            this.scene.start(result === 'win' ? 'WinScene' : 'LoseScene');
        });
    }
    update() {
        if (this.player) {
            this.player.updateHealthBarPosition();
        }
        this.enemies.forEach(enemy => {
            enemy.updateHealthBarPosition();
        });
        this.checkGameOver();
    }
}

export default Scene2;
