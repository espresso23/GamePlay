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
        this.createAnimations();
        this.setupPlayer();
        this.setupEnemies();
        this.createActionButtons();  // Tạo nút cho kỹ năng và tấn công thường
        this.setupTurnText();
        this.updateSkillButtons();  // Cập nhật nút kỹ năng dựa trên thời gian hồi chiêu
        this.startTurn();
    }

    setupGameDimensions() {
        this.posW = this.sys.game.config.width;
        this.posH = this.sys.game.config.height;
        console.log(`Width: ${this.posW}, Height: ${this.posH}`);
    }

    setupBackground() {
        this.background = this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(this.posW, this.posH);
    }

    createAnimations() {
        this.createPlayerAnimations();
        this.createEnemyAnimations();
        this.createSkillAnimations();
    }

    createPlayerAnimations() {
        const playerAnimations = [
            { key: "player", frames: this.anims.generateFrameNumbers("player"), frameRate: 8, repeat: -1 },
            { key: "attack", frames: this.anims.generateFrameNumbers("attack", { start: 0, end: 22 }), frameRate: 60, repeat: 0 },
            { key: "playerAttack", frames: this.anims.generateFrameNumbers("playerAttack", { start: 0, end: 3 }), frameRate: 10, repeat: 0 },
            { key: "hurt", frames: this.anims.generateFrameNumbers("playerHurt"), frameRate: 30, repeat: 0 },
            { key: "dead", frames: this.anims.generateFrameNumbers("playerDead"), frameRate: 25, repeat: 0 }
        ];
        playerAnimations.forEach(anim => this.anims.create(anim));
    }

    createEnemyAnimations() {
        const enemyAnimations = [
            { key: "enemy1Idle", frames: this.anims.generateFrameNumbers("enemy1", { start: 0, end: 8 }), frameRate: 10, repeat: -1 },
            { key: "enemy1Attack", frames: this.anims.generateFrameNumbers("enemy1", { start: 49, end: 55 }), frameRate: 20, repeat: 0 },
            { key: "enemy1Hurt", frames: this.anims.generateFrameNumbers("enemy1", { start: 68, end: 73 }), frameRate: 8, repeat: 0 },
            { key: "enemy1Dead", frames: this.anims.generateFrameNumbers("enemy1", { start: 89, end: 110 }), frameRate: 8, repeat: 0 },
            { key: "enemyAttack", frames: this.anims.generateFrameNumbers("enemyAttack"), frameRate: 8, repeat: 0 }
        ];
        enemyAnimations.forEach(anim => this.anims.create(anim));
    }

    createSkillAnimations() {
        const skillAnimations = [
            { key: "skillQ", frames: this.anims.generateFrameNumbers("skillQ"), frameRate: 8, repeat: 0 },
            { key: "skillW", frames: this.anims.generateFrameNumbers("skillW",), frameRate: 8, repeat: 0 },
            { key: "skillE", frames: this.anims.generateFrameNumbers("skillE",), frameRate: 8, repeat: 0 },
            { key: "skillR", frames: this.anims.generateFrameNumbers("skillR",), frameRate: 5, repeat: 0 },
        ];
        skillAnimations.forEach(anim => this.anims.create(anim));
    }

    setupPlayer() {
        this.player = new Player(this, this.posW / 2 - 400, this.posH / 2 + 70, 'player-health-bar', 'player-name', 'player-health-number');
        this.player.play("player");
    }

    setupEnemies() {
        this.enemies = this.createEnemies();
        this.enemies.getChildren().forEach(enemy => enemy.play("enemy1Idle"));
    }

    createEnemies() {
        return this.add.group(
            Array.from({ length: 3 }, (_, i) =>
                new Enemy(this, this.posW / 2 + 100 + i * 50, this.posH / 2 - 50 + i * 80, this.player)
            )
        );
    }
    createActionButtons() {
        // Tạo nút tấn công thường
        this.attackButton = this.add.text(50, 200, 'Attack', { fontSize: '32px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.handleAttack())
            .on('pointerover', () => this.attackButton.setStyle({ fill: '#ff0' })) // Đổi màu khi hover
            .on('pointerout', () => this.attackButton.setStyle({ fill: '#fff' })); // Đổi lại màu khi không hover

        // Tạo nút kỹ năng Q, W, E, R
        ['Q', 'W', 'E', 'R'].forEach((skill, index) => {
            this[`${skill}Button`] = this.add.text(50, 300 + 50 * index, `Skill ${skill}`, { fontSize: '32px', fill: '#fff' })
                .setInteractive()
                .on('pointerdown', () => this.handleSkill(skill))
                .on('pointerover', () => this[`${skill}Button`].setStyle({ fill: '#ff0' })) // Đổi màu khi hover
                .on('pointerout', () => this[`${skill}Button`].setStyle({ fill: '#fff' })); // Đổi lại màu khi không hover
        });
    }
    handleAttack() {
        if (this.currentTurn !== 'player') return;

        const aliveEnemies = this.enemies.getChildren().filter(enemy => enemy.active);

        if (this.currentTurn === 'player' && aliveEnemies.length > 0) {
            // Tùy chọn: Tấn công ngẫu nhiên một kẻ thù
            const randomEnemyIndex = Phaser.Math.Between(0, aliveEnemies.length - 1);
            const targetEnemy = aliveEnemies[randomEnemyIndex];
            if (targetEnemy && targetEnemy.active) { // Kiểm tra xem kẻ thù mục tiêu còn sống
                this.player.basicAttack(targetEnemy);
            }
        }

        this.time.delayedCall(500, () => {
            this.endPlayerTurn();
        });
    }


    handleSkill(skill) {
        if (this.currentTurn !== 'player' || this.cooldowns[skill] > 0) return;
        //this.player.play(`skill${skill}`);  // Phát hoạt ảnh kỹ năng
        // Gọi phương thức useSkill của Player
        const aliveEnemies = this.enemies.getChildren().filter(enemy => enemy.active);
        if (this.currentTurn === 'player' && aliveEnemies.length > 0) {
            // Tùy chọn: Tấn công ngẫu nhiên một kẻ thù
            const randomEnemyIndex = Phaser.Math.Between(0, aliveEnemies.length - 1);
            const targetEnemy = aliveEnemies[randomEnemyIndex];
            if (targetEnemy && targetEnemy.active) { // Kiểm tra xem kẻ thù mục tiêu còn sống
                this.player.useSkill(skill, targetEnemy);
                this.cooldowns[skill] = 4;  // Đặt thời gian hồi chiêu cho kỹ năng
            }
        }


        this.time.delayedCall(500, () => {
            this.endPlayerTurn();
        });
    }

    endPlayerTurn() {
        this.playerTurnsLeft--;
        this.turnText.setText(`Turns Left: ${this.playerTurnsLeft}`);
        this.currentTurn = 'enemy';
        this.updateSkillButtons();

        const result = this.checkGameOver();
        if (result) {
            this.showEndScreen(result);
            return;
        }

        // Bắt đầu lượt của kẻ địch
        this.enemyTurn();
    }

    enemyTurn() {
        const aliveEnemies = this.enemies.getChildren().filter(enemy => enemy.active);

        if (aliveEnemies.length > 0) {
            // Chọn một kẻ thù ngẫu nhiên để tấn công
            const randomIndex = Math.floor(Math.random() * aliveEnemies.length);
            const enemyToAttack = aliveEnemies[randomIndex];

            // Kẻ thù thực hiện tấn công
            enemyToAttack.basicAttack(); // Gọi tấn công cho kẻ địch được chọn

            // Đợi một khoảng thời gian trước khi kết thúc lượt
            this.time.delayedCall(1000, () => {
                // Kiểm tra game over
                if (!this.checkGameOver()) {
                    this.currentTurn = 'player'; // Chuyển lượt về người chơi
                    this.updateSkillButtons(); // Cập nhật các nút kỹ năng
                }
            });
        } else {
            // Nếu không còn kẻ thù nào sống sót
            this.currentTurn = 'player';
            this.updateSkillButtons();
        }
    }

    checkGameOver() {
        const aliveEnemies = this.enemies.getChildren().filter(enemy => enemy.active);

        if (this.playerTurnsLeft <= 0) {
            this.showEndScreen('lose');
            return true;
        }

        if (this.player.health <= 0) {
            this.showEndScreen('lose');
            return true;
        }

        if (aliveEnemies.length === 0) {
            this.showEndScreen('win');
            return true;
        }

        return false;
    }
    showEndScreen(result) {
        this.time.delayedCall(3000, () => {
            this.scene.start(result === 'win' ? 'WinScene' : 'LoseScene');
        });
    }

    updateSkillButtons() {
        ['Q', 'W', 'E', 'R'].forEach(skill => {
            // Cập nhật nội dung cho nút kỹ năng
            this[`${skill}Button`].setText(`Skill ${skill} (${this.cooldowns[skill] > 0 ? this.cooldowns[skill] : 'Ready'})`);

            // Vô hiệu hóa nút nếu đang hồi chiêu
            if (this.cooldowns[skill] > 0) {
                this[`${skill}Button`].setInteractive(false); // Không cho phép click
                this[`${skill}Button`].setStyle({ fill: '#888' }); // Thay đổi màu để chỉ rõ rằng nút không hoạt động
            } else {
                this[`${skill}Button`].setInteractive(true); // Cho phép click
                this[`${skill}Button`].setStyle({ fill: '#fff' }); // Đổi lại màu khi có thể sử dụng
            }
        });

        // Giảm thời gian hồi chiêu cho các kỹ năng
        this.cooldowns = Object.fromEntries(
            Object.entries(this.cooldowns).map(([skill, cd]) => [skill, Math.max(cd - 1, 0)])
        );
    }
    update() {

    }
    setupTurnText() {
        this.turnText = this.add.text(500, 50, `Turns Left: ${this.playerTurnsLeft}`, { font: '20px Arial', fill: '#ffffff' });
    }

    startTurn() {
        this.currentTurn = 'player';
        this.updateSkillButtons();  // Cho phép người chơi thực hiện lượt đầu tiên
    }
}

export default Scene2;
