import ItemDrop from './ItemDrop.js'

class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, player) {
        super(scene, x, y, 'enemy1');
        scene.add.existing(this);
        scene.physics.world.enable(this);

        // Thiết lập thuộc tính
        this.scene = scene;
        this.player = player;
        this.setScale(5);
        this.flipX = true;
        this.healthBarId = 'enemy-health-bar';
        this.nameId = 'enemy-name';
        this.healthNumberId = 'enemy-health-number';
        this.health = this.maxHealth = 100;
        this.attackDamage = 10;
        this.active = true; // Trạng thái kẻ thù sống
        this.on('animationcomplete', this.onAnimationComplete, this);
        this.goldAmount = Phaser.Math.Between(10, 50); // Random gold
        this.healthPotionChance = 0.3; // 30% chance for health potion
        this.experiencePoints = 50; // Experience points given
    }

    moveAttack(target, animation, speed, onComplete) {
        if (this.isAnimating || !this.active) return; // Kiểm tra trạng thái kẻ thù

        this.isAnimating = true;

        // Tạo attack sprite với animation
        const attackSprite = this.scene.add.sprite(this.x, this.y, 'enemyAttack')
            .setScale(3)
            .play('enemyAttack');

        // Thêm event listener cho animation complete
        attackSprite.on('animationcomplete', () => {
            attackSprite.destroy();
        });

        // Tween movement
        this.scene.tweens.add({
            targets: attackSprite,
            x: target.x,
            y: target.y,
            duration: speed,
            ease: 'Power1',
            onComplete: () => {
                if (onComplete) onComplete();
                this.isAnimating = false;
            }
        });
    }

    basicAttack() {
        if (this.active && !this.isAnimating) {
            console.log("enemy attack");
            this.play('enemy1Attack');

            this.moveAttack(this.player, 'enemyAttack', 500, () => {
                if (this.active) {
                    this.player.takeDamage(this.attackDamage);
                    this.scene.time.delayedCall(500, () => {
                        if (this.active) {
                            this.play('enemy1Idle');
                        }
                    });
                }
            });
        }
    }

    onAnimationComplete(animation) {
        if (animation.key === 'enemy1Attack') {
            this.play('enemy1Idle');  // Quay lại hoạt ảnh idle sau khi tấn công
        }
    }

    updateHealthBar() {
        if (!this.active) return; // Không cập nhật thanh máu nếu đã chết
        const healthPercentage = Math.max((this.health / this.maxHealth) * 100, 0);
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
            healthNumberElement.innerText = Math.max(this.health, 0); // Hiển thị số lượng máu không âm
        } else {
            console.error(`Element with ID ${numberId} not found`);
        }
    }

    updateHealthBarPosition() {
        const offsets = { healthBar: [-100, -50], name: [-100, -70], healthNumber: [-100, -30] };
        for (const [key, [offsetX, offsetY]] of Object.entries(offsets)) {
            this.updateElementPosition(this[`${key}Id`], offsetX, offsetY);
        }
    }

    updateElementPosition(elementId, offsetX, offsetY) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.left = `${this.x + offsetX}px`;
            element.style.top = `${this.y + offsetY}px`;
        }
    }

    takeDamage(amount) {
        if (this.active) {
            console.log("enemy hurt");
            this.health -= amount;
            this.updateHealthBar(); // Cập nhật thanh máu trước khi kiểm tra trạng thái

            if (this.health > 0) {
                this.play("enemy1Hurt"); // Chỉ phát hoạt ảnh tổn thương khi vẫn còn máu
            } else {
                this.die();
                this.health = 0;
            }
        }
    }
    die() {
        console.log("die() called."); // Log when die() is called
        this.active = false; // Mark enemy as dead

        this.play("enemy1Dead");
        console.log("Enemy animation started."); // Log animation start

        this.scene.time.delayedCall(1000, () => { // Use a delay to simulate animation completion
            console.log("Delayed call for dropping items..."); // Log when delay ends
            const dropType = Phaser.Math.RND.pick(['gold', 'health', 'experience']);
            console.log(`Dropping item: ${dropType}`); // Log the type of item being dropped
            new ItemDrop(this.scene, this.x, this.y, this.scene.player, dropType);
            this.destroy(); // Destroy the enemy object
            console.log('Enemy has died and dropped an item.');

        });
        this.scene.checkGameOver();
    }


    update() {
        this.updateHealthBar();
    }
}

export default Enemy;
