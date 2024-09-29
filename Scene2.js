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
        // this.skillQ = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "skillQ");
        // this.skillQ.setVisible(false);
        // this.skillW = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "skillW");
        // this.skillW.setVisible(false);

        // Create player
        this.player = new Player(this, this.sys.game.config.width / 2 - 400, this.sys.game.config.height / 2 + 70, 'player-health-bar', 'player-name', 'player-health-number');
        this.turnsLeft = 25;
        this.playerTurn = true;
        this.cooldowns = { Q: 0, W: 0, E: 0, R: 0 };
        this.enemyTurn = true;


        // Create enemies
        this.enemies = [];
        const positions = [
            { x: this.sys.game.config.width / 2 + 350, y: this.sys.game.config.height / 2 - 100 },
            { x: this.sys.game.config.width / 2 + 450, y: this.sys.game.config.height / 2 + 90 },
            { x: this.sys.game.config.width / 2 + 400, y: this.sys.game.config.height / 2 - 30 }
        ];

        // Initialize enemies at the given positions
        positions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, 'enemy-health-bar', 'enemy-name', 'enemy-health-number');
            this.enemies.push(enemy); // Add enemy to the array
        });

        // Animation for skill Q


        // this.skillQ.on('animationcomplete', () => {
        //     this.skillQ.setVisible(false); // Hide skill sprite after animation
        // });
        // this.skillW.on('animationcomplete', () => {
        //     this.skillW.setVisible(false); // Hide skill sprite after animation
        // });

        // Handle skill 'Q'
        // this.input.keyboard.on('keydown-Q', () => {
        //     this.player.useSkillQ();
        // });
        // this.input.keyboard.on('keydown-W', () => {
        //     this.player.useSkillW();
        // });
        // this.input.keyboard.on('keydown-E', () => {
        //     this.player.useSkillE();
        // });
        // this.input.keyboard.on('keydown-R', () => {
        //     this.player.useSkillR();
        // });

        // this.input.on('pointerdown', () => {
        //     this.player.attack();
        // });
        this.createActionButtons();
        this.events.on('update', this.checkGameOver, this);
        this.nextTurn();
    }
    createActionButtons() {
        this.attackButton = this.add.text(50, 50, 'Attack', { fontSize: '32px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => this.playerAttack());

        this.skillButtons = {};
        ['Q', 'W', 'E', 'R'].forEach((skill, index) => {
            this.skillButtons[skill] = this.add.text(50, 100 + index * 50, `Skill ${skill}`, { fontSize: '32px', fill: '#fff' })
                .setInteractive()
                .on('pointerdown', () => this.useSkill(skill));
        });
    }
    useSkill(skill) {
        if (this.playerTurn && this.cooldowns[skill] === 0) { // Kiểm tra nếu là lượt người chơi và kỹ năng không trong cooldown
            if (skill === 'Q') {
                this.player.useSkillQ(); // Gọi phương thức sử dụng kỹ năng Q
            } else if (skill === 'W') {
                this.player.useSkillW(); // Gọi phương thức sử dụng kỹ năng W
            } else if (skill === 'E') {
                this.player.useSkillE(); // Gọi phương thức sử dụng kỹ năng E
            } else if (skill === 'R') {
                this.player.useSkillR(); // Gọi phương thức sử dụng kỹ năng R
            }
    
            this.cooldowns[skill] = 2; // Đặt cooldown là 2 lượt
            this.endPlayerTurn(); // Kết thúc lượt người chơi
        } else if (!this.playerTurn) {
            console.log(`Không thể sử dụng kỹ năng ${skill}. Chưa đến lượt người chơi.`);
            displayMessage(`Không thể sử dụng kỹ năng ${skill}. Chưa đến lượt người chơi.`);
        } else {
            console.log(`Kỹ năng ${skill} đang trong cooldown.`);
            displayMessage(`Kỹ năng ${skill} đang trong cooldown.`)
        }
    }
    
    playerAttack() {
        if (this.playerTurn) { // Kiểm tra nếu là lượt người chơi
            this.player.attack();
            console.log("Player attacks!");
            this.endPlayerTurn();
        } else {
            console.log("Không thể tấn công! Chưa đến lượt người chơi.");
            displayMessage("Không thể tấn công! Chưa đến lượt người chơi.");
        }
    }
    
    enemyAttack() {
        // Tấn công của kẻ địch
        if (this.enemyTurn) {
            console.log("Enemy attacks!");
            this.enemies.forEach(enemy => enemy.startRandomAttack());
            this.endEnemyTurn();
        }
        // Kết thúc lượt của kẻ địch, chuyển sang người chơi
    }
    endPlayerTurn() {
        this.playerTurn = false; // Kết thúc lượt người chơi
        console.log("PlayerTurn: OFF");
         // Giảm số lượt còn lại
         this.turnsLeft--;
        this.updateCooldowns(); // Cập nhật thời gian hồi chiêu cho các kỹ năng
    
        this.time.delayedCall(1000, () => { // Thêm thời gian chờ trước khi kẻ địch tấn công
            this.enemyAttack(); // Bắt đầu lượt tấn công của kẻ địch
            this.nextTurn();
        });
    }
    
    endEnemyTurn() {
        this.enemyTurn = false; // Kết thúc lượt của kẻ địch
        console.log("EnemyTurn: OFF");
        this.checkGameOver(); // Kiểm tra kết thúc game
    
        this.time.delayedCall(1000, () => { // Thêm thời gian chờ trước khi người chơi tiếp tục lượt
            this.playerTurn = true; // Bắt đầu lượt tấn công của người chơi
            this.nextTurn(); // Tiếp tục vào lượt tiếp theo của người chơi
        });
    }
    
    updateCooldowns() {
        for (let skill in this.cooldowns) {
            if (this.cooldowns[skill] > 0) {
                this.cooldowns[skill]--;
            }
        }
    }
    nextTurn() {
        if (this.playerTurn) {
            console.log("Player's turn");
            this.showActionButtons(true); // Hiển thị nút tấn công và kỹ năng khi đến lượt người chơi
        } else {
            console.log("Enemy's turn");
            this.showActionButtons(false); // Ẩn nút khi đến lượt kẻ địch
        }
    }
    
    showActionButtons(show) {
        this.attackButton.setVisible(show);
        for (let skill in this.skillButtons) {
            this.skillButtons[skill].setVisible(show);
        }
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
    // checkGameOver() {
    //     if (this.enemies.length === 0) {
    //         this.showEndScreen('win');
    //     } else if (this.player.health <= 0) {
    //         this.showEndScreen('lose');
    //     }
    // }
    checkGameOver() {
        if (this.turnsLeft <= 0 || this.player.health <= 0) {
            console.log("Game Over! Player loses.");
            this.showEndScreen('lose');
        } else if (this.enemies.length === 0) {
            this.showEndScreen('win');
        } else {
            if (this.playerTurn) {
                // Wait for player action
            } else {
                this.enemyAttack();
            }
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
        this.add.text(30, 30, `TurnsLeft: ${this.turnsLeft}`, { fontSize: '32px', fill: '#fff' });
    }
}

export default Scene2;
function displayMessage(message) {
    const messageDiv = document.getElementById('gameMessages');
    messageDiv.innerText = message;
}