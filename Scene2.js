import Enemy from "./entities/Enemy.js";
import Player from "./entities/player.js";

class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
        this.currentTurn = 'player';
        this.playerTurnsLeft = 20;
        this.cooldowns = { Q: 0, W: 0, E: 0, R: 0 };
    }

    create() {

        this.setupGameDimensions();
        this.setupBackground();

        this.createPlayerAnimations(); // Tạo hoạt ảnh trước
        this.setupPlayer(); // Sau đó khởi tạo player

        this.createEnemyAnimations(); // Tạo hoạt ảnh trước
        this.setupEnemies(); // Sau đó khởi tạo enemy

        this.createActionButtons();
        this.setupTurnText();
        this.startTurn();

    }

    setupGameDimensions() {
        this.posW = this.sys.game.config.width;
        this.posH = this.sys.game.config.height;
        console.log(`Width: ${this.posW}, Height: ${this.posH}`);
    }

    setupBackground() {
        document.getElementById('health-bars').style.display = 'flex';
        this.background = this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(this.posW, this.posH);
    }

    setupPlayer() {
        this.player = new Player(this, this.posW / 2 - 400, this.posH / 2 + 70, 'player-health-bar', 'player-name', 'player-health-number');
        this.add.existing(this.player);
        this.player.play("player");
        this.createSkillAnimations();
        this.createPlayerAnimations();
    }

    setupEnemies() {
        this.enemies = this.add.group();
        this.createEnemies();
        this.createEnemyAnimations();
    }

    createEnemies() {
        for (let i = 0; i < 3; i++) {
            const enemy = new Enemy(this, this.posW / 2 + 100 + i * 50, this.posH / 2 - 100 + i * 70, 'enemy-health-bar', 'enemy-name', 'enemy-health-number', this.player);
            this.enemies.add(enemy);
            enemy.play("enemy1Idle");
        }
        console.log("Entities Activated!");
    }

    createPlayerAnimations() {
        this.anims.create({
            key: "player",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "attack",
            frames: this.anims.generateFrameNumbers("attack", { start: 0, end: 22 }),
            frameRate: 60,
            repeat: 0,
        });
        this.anims.create({ key: "playerAttack", frames: this.anims.generateFrameNumbers("playerAttack", { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
        this.anims.create({ key: "hurt", frames: this.anims.generateFrameNumbers("playerHurt"), frameRate: 30, repeat: 0 });
        this.anims.create({ key: "dead", frames: this.anims.generateFrameNumbers("playerDead"), frameRate: 25, repeat: 0 });
    }

    createEnemyAnimations() {
        this.anims.create({ key: "enemy1Idle", frames: this.anims.generateFrameNumbers("enemy1", { start: 0, end: 8 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: "enemy1Attack", frames: this.anims.generateFrameNumbers("enemy1", { start: 49, end: 55 }), frameRate: 20, repeat: 0 });
        this.anims.create({ key: "enemy1Hurt", frames: this.anims.generateFrameNumbers("enemy1", { start: 68, end: 73 }), frameRate: 8, repeat: 0 });
        this.anims.create({ key: "enemy1Dead", frames: this.anims.generateFrameNumbers("enemy1", { start: 89, end: 110 }), frameRate: 20, repeat: 0, hideOnComplete: true });
    }

    createSkillAnimations() {
        ['Q', 'W', 'E', 'R'].forEach(skill => {
            this.anims.create({
                key: `skill${skill}`,
                frames: this.anims.generateFrameNumbers(`skill${skill}`),
                frameRate: 10 + (skill.charCodeAt(0) - 'Q'.charCodeAt(0)) * 10, // Example scaling
                repeat: 0,
                hideOnComplete: true
            });
        });
    }

    createActionButtons() {
        console.log('Creating action buttons...');
        this.attackButton = this.createButton(30, this.posH / 2 - 100, 'Attack', this.attack.bind(this));
        this.skillButtons = {};
        ['Q', 'W', 'E', 'R'].forEach((skill, index) => {
            this.skillButtons[skill] = this.createButton(30, this.posH / 2 - 50 + index * 50, `Skill ${skill}`, () => this.useSkill(skill));
        });
    }

    createButton(x, y, text, callback) {
        return this.add.text(x, y, text, { fontSize: '32px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', callback);
    }

    attack() {
        console.log('Attack button clicked');
        const enemies = this.enemies.getChildren();
        if (enemies.length > 0) {
            const randomEnemy = Phaser.Math.RND.pick(enemies);
            this.player.attack(randomEnemy);
            this.endTurn();
        }
    }

    useSkill(skill) {
        if (this.currentTurn === 'player' && this.cooldowns[skill] === 0) {
            this.player.useSkill(skill, this.enemies.getChildren());
            this.cooldowns[skill] = 3; // Set cooldown for the skill
            this.endTurn();
        } else {
            displayMessage(`Skill ${skill} is on cooldown.`);
        }
    }

    setupTurnText() {
        this.turnText = this.add.text(500, 30, `Turns Left: ${this.playerTurnsLeft}`, { fontSize: '32px', fill: '#fff' });
    }

    startTurn() {
        if (this.currentTurn === 'player') {
            this.showActionButtons(true);
        } else {
            this.showActionButtons(false);
            const enemy = Phaser.Math.RND.pick(this.enemies.getChildren());
            if (enemy) {
                // Tạo một chút delay trước khi enemy tấn công
                this.time.delayedCall(1000, () => {
                    enemy.attack(this.player);
                    // Thêm delay trước khi kết thúc lượt
                    this.time.delayedCall(2000, this.endTurn.bind(this));
                });
            }
        }
    }


    endTurn() {
        if (this.currentTurn === 'player') {
            this.playerTurnsLeft--;
            this.turnText.setText(`Turns Left: ${this.playerTurnsLeft}`);
            this.updateCooldowns();

            if (this.playerTurnsLeft <= 0 || this.player.health <= 0) {
                this.checkGameOver();
            }
        }

        this.currentTurn = this.currentTurn === 'player' ? 'enemy' : 'player';
        this.startTurn();
    }

    updateCooldowns() {
        for (let skill in this.cooldowns) {
            if (this.cooldowns[skill] > 0) {
                this.cooldowns[skill]--;
                if (this.cooldowns[skill] < 0) {
                    this.cooldowns[skill] = 0;
                }
            }
        }

        for (let skill in this.skillButtons) {
            const cooldownText = this.cooldowns[skill] > 0 ? `Skill ${skill} (${this.cooldowns[skill]})` : `Skill ${skill}`;
            this.skillButtons[skill].setText(cooldownText);
        }
    }

    checkGameOver() {
        if (this.playerTurnsLeft <= 0 || this.player.health <= 0) {
            console.log("Game Over! Player loses.");
            this.showEndScreen('lose');
        } else if (this.enemies.getChildren().length === 0) {
            console.log("Player wins.");
            this.showEndScreen('win');
        }
    }

    showEndScreen(result) {
        this.time.delayedCall(1200, () => {
            this.scene.start(result === 'win' ? 'WinScene' : 'LoseScene');
        });
    }

    showActionButtons(show) {
        this.attackButton.setVisible(show);
        for (let skill in this.skillButtons) {
            this.skillButtons[skill].setVisible(show);
        }
    }

    update() {
        if (this.player) {
            this.player.updateHealthBarPosition();
        }

        this.enemies.getChildren().forEach(enemy => enemy.updateHealthBarPosition());
        this.updateCooldowns();
    }
}

export default Scene2;

function displayMessage(message) {
    const messageDiv = document.getElementById('gameMessages');
    messageDiv.innerText = message;
}
