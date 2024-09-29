class Enemy {
    constructor(scene, x, y, healthBarId, nameId, healthNumberId) {
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, 'enemy1');
        this.sprite.setScale(5);
        this.sprite.flipX = true;
        this.healthBarId = healthBarId;
        this.nameId = nameId;
        this.healthNumberId = healthNumberId;
        this.health = 50;
        this.maxHealth = 50;
        this.sprite.play("enemy1Idle");
        this.sprite.isAttacking = false; // Trạng thái tấn công

        // Gọi hàm tấn công ngẫu nhiên
       // this.startRandomAttack();

        // Thêm sự kiện lắng nghe animationcomplete một lần
        this.sprite.on('animationcomplete', (animation) => {
            if (animation.key === 'enemy1Attack') {
                this.sprite.isAttacking = false; // Reset trạng thái tấn công
                this.sprite.play('enemy1Idle'); // Ngay lập tức chuyển về hoạt ảnh idle
                console.log('Enemy is Idle.');
                this.startRandomAttack();
            }
        });

        // Xử lý va chạm giữa enemy và player attack
        this.scene.physics.add.overlap(this.sprite, this.scene.playerAttacks, this.handlePlayerAttack, null, this);
    }

    startRandomAttack() {
        // Tạo thời gian ngẫu nhiên cho lần tấn công tiếp theo
        const attackDelay = Phaser.Math.Between(3000, 5000); // Thời gian tấn công ngẫu nhiên từ 3 đến 5 giây

        setTimeout(() => {
            this.attack();
        }, attackDelay);
    }

    attack() {
        if (!this.sprite.isAttacking) {
            this.sprite.isAttacking = true; // Đánh dấu trạng thái đang tấn công
            this.sprite.play('enemy1Attack'); // Chạy hoạt ảnh tấn công
            const attackHitbox = this.scene.physics.add.sprite(this.sprite.x, this.sprite.y, 'enemyAttack').setScale(3);
            const player = this.scene.player;

            if (!player || !player.sprite) {
                console.error('Player or player sprite is not defined.');
                this.sprite.isAttacking = false;
                this.sprite.play('enemy1Idle');
                attackHitbox.destroy();
                return;
            }


            console.log('Enemy is attacking.');

            // Tạo tween để di chuyển hitbox theo phương ngang
            this.scene.tweens.add({
                targets: attackHitbox,
                x: player.sprite.x, // Di chuyển đến vị trí của người chơi
                duration: 200, // Thời gian di chuyển
                ease: 'Power2',
                onComplete: () => {
                    console.log('Attack hitbox reached target.');

                    // Phát hoạt ảnh attack tại vị trí của hitbox
                    attackHitbox.play('enemyAttack');

                    // Đảm bảo hoạt ảnh tấn công phát đủ khung hình
                    attackHitbox.once('animationcomplete', (event) => {
                        if (event.key === 'enemyAttack') {
                            // Gây sát thương cho người chơi khi hitbox chạm đến
                            if (player.sprite.active) {
                                // Tạo tỉ lệ hụt ngẫu nhiên
                                const hitChance = Phaser.Math.Between(0, 100);
                                if (hitChance <= 70) { // Giả sử tỉ lệ trúng là 70%
                                    player.takeDamage(10);
                                    console.log(`Player took 10 damage. Current health: ${player.health}`);
                                    if (player.health <= 0) {
                                        this.scene.handlePlayerDeath(player); // Kiểm tra cái chết của người chơi
                                    }
                                } else {
                                    console.log('Attack missed the player.');
                                }
                            }

                            attackHitbox.destroy(); // Xóa hitbox sau khi hoàn tất
                        }
                    });
                }
            });

            // Xử lý va chạm giữa hitbox và người chơi
            this.scene.physics.add.overlap(attackHitbox, player, (hitbox, player) => {
                if (player.sprite.active) {
                    // Phát hoạt ảnh attack khi va chạm xảy ra
                    attackHitbox.play('enemyAttack');

                    // Đảm bảo hitbox bị phá hủy sau khi va chạm
                    attackHitbox.once('animationcomplete', (event) => {
                        if (event.key === 'enemyAttack') {
                            attackHitbox.destroy();
                        }
                    });
                }
            });
        }
    }
    updateHealthBar() {
        const healthPercentage = (this.health / this.maxHealth) * 100;
        const healthBarElement = document.getElementById(this.healthBarId);
        const healthNumberElement = document.getElementById(this.healthNumberId);

        if (healthBarElement) {
            healthBarElement.style.width = healthPercentage + '%';
        } else {
            console.error(`Element with ID ${this.healthBarId} not found`);
        }

        if (healthNumberElement) {
            healthNumberElement.innerText = this.health;
        } else {
            console.error(`Element with ID ${this.healthNumberId} not found`);
        }

        // Cập nhật vị trí của thanh máu
        if (healthBarElement) {
            healthBarElement.style.left = `${this.sprite.x - 100}px`;
            healthBarElement.style.top = `${this.sprite.y - 50}px`;
        }
        this.updateHealthBarPosition();
    }
    updateHealthBarPosition() {
        const healthBarElement = document.getElementById(this.healthBarId);
        const nameElement = document.getElementById(this.nameId);
        const healthNumberElement = document.getElementById(this.healthNumberId);

        if (healthBarElement) {
            healthBarElement.style.left = `${this.sprite.x - 100}px`;
            healthBarElement.style.top = `${this.sprite.y - 50}px`;
        }

        if (nameElement) {
            nameElement.style.left = `${this.sprite.x - 100}px`;
            nameElement.style.top = `${this.sprite.y - 70}px`; // Điều chỉnh nếu cần
        }

        if (healthNumberElement) {
            healthNumberElement.style.left = `${this.sprite.x - 100}px`;
            healthNumberElement.style.top = `${this.sprite.y - 30}px`; // Điều chỉnh nếu cần
        }
    }
    takeDamage(amount) {
        this.sprite.play("enemy1Hurt");
        this.health -= amount;
        console.log("Enemy was attacked");
        this.updateHealthBar();
        if (this.health <= 0) {
            this.scene.handleEnemyDeath(this); // Xử lý cái chết của kẻ thù
        } else {
            this.startRandomAttack();
        }
    }

    handlePlayerAttack(enemy, playerAttack) {
        // Implement logic to handle player attack on enemy
        this.health -= playerAttack.damage;
        console.log(`Enemy took ${playerAttack.damage} damage. Current health: ${this.health}`);
        if (this.health <= 0) {
            this.sprite.destroy();
            console.log('Enemy defeated.');
        }
    }
}

export default Enemy;
