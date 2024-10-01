class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, healthBarId, nameId, healthNumberId, player) {
        super(scene, x, y, 'enemy1');
        scene.add.existing(this);
        scene.physics.world.enable(this);

        // Thiết lập thuộc tính
        this.player = player;
        this.setScale(5);
        this.flipX = true;
        this.healthBarId = healthBarId;
        this.nameId = nameId;
        this.healthNumberId = healthNumberId;
        this.health = 1000;
        this.maxHealth = 1000;
        this.isAttacking = false; // Theo dõi trạng thái tấn công
        this.enemyAttackDelay = 500;
        this.on('animationcomplete', this.handleAnimationComplete, this); // Nghe sự kiện kết thúc animation
    }

    // Phương thức xử lý khi kết thúc animation
    handleAnimationComplete(animation) {
        if (animation.key === 'enemy1Attack') {
            this.isAttacking = false; // Thiết lập lại trạng thái tấn công
            this.play('enemy1Idle'); // Trở về trạng thái idle sau khi tấn công
            console.log('Enemy is Idle.');
        }
    }

    // Phương thức tấn công của kẻ địch
    attack() {
        if (!this.isAttacking) {
            this.isAttacking = true; // Thiết lập trạng thái tấn công
            const attackHitbox = this.createAttackHitbox();

            this.scene.tweens.add({
                targets: attackHitbox,
                x: this.player.x,
                duration: 200,
                ease: 'Power2',
                onComplete: () => this.handleAttackComplete(attackHitbox)
            });
        }
    }

    createAttackHitbox() {
        const attackHitbox = this.scene.physics.add.sprite(this.x, this.y, 'enemyAttack').setScale(3);
        return attackHitbox;
    }

    handleAttackComplete(attackHitbox) {
        console.log('Attack hitbox has reached the target.');
        this.play('enemy1Attack');

        this.scene.physics.add.overlap(attackHitbox, this.player, () => this.onPlayerHit(attackHitbox));
    }

    onPlayerHit(attackHitbox) {
        const hitChance = Phaser.Math.Between(0, 100);
        if (hitChance <= 30) {
            this.player.takeDamage(10); // Gây sát thương cho người chơi
            if (this.player.health <= 0) {
                this.scene.handlePlayerDeath(this.player);
            }
        } else {
            console.log('Attack missed the player.');
        }

        attackHitbox.destroy(); // Xóa hitbox sau khi tấn công
        this.isAttacking = false; // Thiết lập lại trạng thái tấn công
    }

    // Cập nhật thanh máu
    updateHealthBar() {
        const healthPercentage = Math.max((this.health / this.maxHealth) * 100, 0); // Đảm bảo không âm
        this.updateHealthBarElement(this.healthBarId, healthPercentage);
        this.updateHealthNumberElement(this.healthNumberId);
        this.updateHealthBarPosition();
    }

    updateHealthBarElement(barId, healthPercentage) {
        const healthBarElement = document.getElementById(barId);
        if (healthBarElement) {
            healthBarElement.style.width = `${healthPercentage}%`;
            healthBarElement.style.backgroundColor = healthPercentage > 30 ? 'green' : 'red';
        } else {
            console.error(`Element with ID ${barId} not found`);
        }
    }

    updateHealthNumberElement(numberId) {
        const healthNumberElement = document.getElementById(numberId);
        if (healthNumberElement) {
            healthNumberElement.innerText = this.health > 0 ? this.health : 0;
        } else {
            console.error(`Element with ID ${numberId} not found`);
        }
    }

    updateHealthBarPosition() {
        const healthBarElement = document.getElementById(this.healthBarId);
        const nameElement = document.getElementById(this.nameId);
        const healthNumberElement = document.getElementById(this.healthNumberId);

        if (healthBarElement) {
            this.setElementPosition(healthBarElement, -100, -50);
        }

        if (nameElement) {
            this.setElementPosition(nameElement, -100, -70);
        }

        if (healthNumberElement) {
            this.setElementPosition(healthNumberElement, -100, -30);
        }
    }

    setElementPosition(element, offsetX, offsetY) {
        element.style.left = `${this.x + offsetX}px`;
        element.style.top = `${this.y + offsetY}px`;
    }

    takeDamage(amount) {
        this.play("enemy1Hurt");
        this.health -= amount;
        console.log("Enemy was attacked");
        this.updateHealthBar();
        if (this.health <= 0) {
            this.scene.handleEnemyDeath(this);
        }
    }

    handlePlayerAttack(playerAttack) {
        this.health -= playerAttack.damage;
        console.log(`Enemy took ${playerAttack.damage} damage. Current health: ${this.health}`);
        if (this.health <= 0) {
            this.destroy(); // Phá hủy đối tượng enemy sau khi chết
            console.log('Enemy defeated.');
        }
    }
}


export default Enemy;
