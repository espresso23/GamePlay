class Player {
    constructor(scene, x, y, healthBarId, nameId, healthNumberId) {
        // Call the parent class constructor
        this.scene = scene;
        this.sprite = this.scene.physics.add.sprite(x, y, 'player');
        // Set up player properties
        this.sprite.setScale(5);
        this.healthBarId = healthBarId;
        this.nameId = nameId;
        this.healthNumberId = healthNumberId;
        this.health = 100;
        this.maxHealth = 100;
        this.isAttacking = false;

        // Create animations
        this.createAnimations();

        // Play the idle animation

        this.sprite.play("player");

        // Add collision with enemies (assuming enemies are in a physics group)
        // scene.physics.add.collider(this, scene.enemies, scene.handleEnemyAttack, null, scene);

        // Set up input handling
        this.setupInput();
    }

    createAnimations() {
        // Create player idle animation
        this.scene.anims.create({
            key: "player",
            frames: this.scene.anims.generateFrameNumbers("player"),
            frameRate: 8,
            repeat: -1
        });

        // Create player attack animation
        this.scene.anims.create({
            key: "playerAttack",
            frames: this.scene.anims.generateFrameNumbers("playerAttack", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0,
        });
        this.scene.anims.create({
            key: "attack",
            frames: this.scene.anims.generateFrameNumbers("attack", { start: 0, end: 22 }),
            frameRate: 60,
            repeat: 0,
        });
        this.scene.anims.create({
            key: "hurt",
            frames: this.scene.anims.generateFrameNumbers("playerHurt"),
            frameRate: 30,
            repeat: 0
        });
        this.scene.anims.create({
            key: "dead",
            frames: this.scene.anims.generateFrameNumbers("playerDead"),
            frameRate: 25,
            repeat: 0
        })
    }

    setupInput() {
        // Handle player attack on mouse click
        this.scene.input.on('pointerdown', () => {
            this.attack();
        });

        // Handle mouse release to return to idle
        this.scene.input.on('pointerup', () => {
            if (!this.isAttacking) {
                this.sprite.play('player'); // Return to idle when mouse button is released
            }
        });
    }

    attack() {
        if (!this.isAttacking) {
            this.isAttacking = true;
            this.sprite.play("playerAttack");

            // Tạo hitbox cho đòn tấn công
            const attackHitbox = this.scene.physics.add.sprite(this.sprite.x, this.sprite.y, 'attack').setScale(3);

            // Lọc ra các kẻ thù còn sống
            const activeEnemies = this.scene.enemies.filter(enemy => enemy && enemy.sprite && enemy.sprite.active);

            if (activeEnemies.length === 0) {
                this.scene.checkGameOver();
                console.log('No active enemies to target.');
                this.isAttacking = false;
                attackHitbox.destroy();
                this.sprite.play('player');
                return;
            }

            // Tính toán vị trí trung tâm của các kẻ thù còn sống
            const centerX = activeEnemies.reduce((sum, enemy) => sum + enemy.sprite.x, 0) / activeEnemies.length;

            // Tạo tween để di chuyển hitbox theo phương ngang
            this.scene.tweens.add({
                targets: attackHitbox,
                x: centerX, // Di chuyển đến vị trí trung tâm của các kẻ thù
                duration: 200, // Thời gian di chuyển
                ease: 'Power2',
                onComplete: () => {
                    console.log('Attack hitbox reached target.');

                    // Phát hoạt ảnh attack tại vị trí của hitbox
                    attackHitbox.play('attack');

                    // Đảm bảo hoạt ảnh tấn công phát đủ khung hình
                    attackHitbox.once('animationcomplete', (event) => {
                        if (event.key === 'attack') {
                            // Gây sát thương cho tất cả kẻ thù khi hitbox chạm đến
                            activeEnemies.forEach(enemy => {
                                if (enemy.sprite.active) {
                                    // Tạo tỉ lệ hụt ngẫu nhiên
                                    const hitChance = Phaser.Math.Between(0, 100);
                                    if (hitChance <= 70) { // Giả sử tỉ lệ trúng là 70%
                                        enemy.takeDamage(10);
                                        console.log(`Enemy took 10 damage. Current health: ${enemy.health}`);
                                        if (enemy.health <= 0) {
                                            this.scene.handleEnemyDeath(enemy); // Kiểm tra cái chết của kẻ thù
                                        }
                                    } else {
                                        console.log('Attack missed the enemy.');
                                    }
                                }
                            });

                            attackHitbox.destroy(); // Xóa hitbox sau khi hoàn tất
                            this.isAttacking = false;
                            this.sprite.play('player'); // Trở về hoạt ảnh idle
                        }
                    });
                }
            });

            // Xử lý va chạm giữa hitbox và kẻ thù
            this.scene.physics.add.overlap(attackHitbox, this.scene.enemies, (hitbox, enemy) => {
                if (enemy.sprite.active) {
                    // Phát hoạt ảnh attack khi va chạm xảy ra
                    attackHitbox.play('attack');
                }
            });
        }
    }





    useSkillQ() {
        if (!this.isAttacking) {
            console.log('Skill W activated.');
            this.isAttacking = true;
            this.sprite.play("playerAttack");
            console.log('Skill Q activated.');

            // Xóa sprite cũ nếu tồn tại
            if (this.skillQSprite && this.skillQSprite.active) {
                this.skillQSprite.destroy();
                console.log('Old Skill Q sprite destroyed.');
            }

            // Lọc ra các kẻ thù còn sống
            const activeEnemies = this.scene.enemies.filter(enemy => enemy && enemy.sprite && enemy.sprite.active);

            if (activeEnemies.length === 0) {
                console.log('No active enemies to target.');
                this.isAttacking = false;
                this.sprite.play('player');
                return;
            }

            // Tính toán vị trí trung tâm của các kẻ thù còn sống
            const centerX = activeEnemies.reduce((sum, enemy) => sum + enemy.sprite.x, 0) / activeEnemies.length;
            const centerY = activeEnemies.reduce((sum, enemy) => sum + enemy.sprite.y, 0) / activeEnemies.length;

            // Tạo sprite cho kỹ năng Q ở vị trí trung tâm của các kẻ thù
            this.skillQSprite = this.scene.physics.add.sprite(centerX, centerY - 200, 'skillQ'); // Đặt y cao hơn vị trí trung tâm
            this.skillQSprite.setOrigin(0.5, 0.5); // Căn giữa sprite
            this.skillQSprite.play('skillQ'); // Phát hoạt ảnh
            this.skillQSprite.setScale(0.8);
            console.log('Skill Q sprite created and animation started.');

            // Tạo tween để di chuyển từ trên xuống
            this.scene.tweens.add({
                targets: this.skillQSprite,
                y: centerY, // Di chuyển đến vị trí trung tâm
                duration: 1000, // Thời gian di chuyển
                ease: 'Power1',
                onComplete: () => {
                    console.log('Skill Q animation complete.');
                    // Gây sát thương cho tất cả kẻ thù khi hoạt ảnh hoàn tất
                    activeEnemies.forEach(enemy => {
                        if (enemy.sprite.active) {
                            // Tạo tỉ lệ hụt ngẫu nhiên
                            const hitChance = Phaser.Math.Between(0, 100);
                            if (hitChance <= 70) { // Giả sử tỉ lệ trúng là 70%
                                enemy.takeDamage(30); // Gây sát thương 30
                                console.log(`Enemy took 30 damage. Current health: ${enemy.health}`);
                                if (enemy.health <= 0) {
                                    this.scene.handleEnemyDeath(enemy); // Kiểm tra cái chết của kẻ thù
                                }
                            } else {
                                console.log('Skill Q missed the enemy.');
                            }
                        }
                    });

                    // Kiểm tra nếu vẫn còn kẻ thù sống sót
                    const remainingActiveEnemies = this.scene.enemies.some(enemy => enemy.sprite.active);
                    if (!remainingActiveEnemies) {
                        this.skillQSprite.destroy(); // Xóa sprite sau khi hoàn tất nếu không còn kẻ thù
                        console.log('Skill Q sprite destroyed.');
                    } else {
                        console.log('Skill Q continues as there are still active enemies.');
                    }
                    this.isAttacking = false;
                    this.sprite.play("player");
                }
            });
        }
    }

    useSkillW() {
        if (!this.isAttacking) {
            console.log('Skill W activated.');
            this.isAttacking = true;
            this.play("playerAttack");

            // Xóa sprite cũ nếu tồn tại
            if (this.skillWSprite && this.skillWSprite.active) {
                this.skillWSprite.destroy();
                console.log('Old Skill W sprite destroyed.');
            }
            const attackHitbox = this.scene.physics.add.sprite(this.x, this.y, 'skillW').setScale(5.5);
            // Lọc ra các kẻ thù còn sống
            const activeEnemies = this.scene.enemies.filter(enemy => enemy && enemy.sprite && enemy.sprite.active);

            if (activeEnemies.length === 0) {
                console.log('No active enemies to target.');
                return;
            }


            // Tính toán vị trí trung tâm của các kẻ thù còn sống
            const centerX = activeEnemies.reduce((sum, enemy) => sum + enemy.sprite.x, 0) / activeEnemies.length;
            //  const centerY = activeEnemies.reduce((sum, enemy) => sum + enemy.sprite.y, 0) / activeEnemies.length;

            // Tạo sprite cho kỹ năng Q ở vị trí trung tâm của các kẻ thù
            console.log('Skill W sprite created and animation started.');

            // Tạo tween để di chuyển từ trên xuống
            this.scene.tweens.add({
                targets: attackHitbox,
                x: centerX, // Di chuyển đến vị trí trung tâm
                duration: 600, // Thời gian di chuyển
                ease: 'Power2',
                onComplete: () => {
                    console.log('Skill W animation complete.');
                    // Gây sát thương cho tất cả kẻ thù khi hoạt ảnh hoàn tất
                    attackHitbox.play("skillW");
                    attackHitbox.once('animationcomplete', (event) => {
                        if (event.key === 'skillW') {
                            // Gây sát thương cho tất cả kẻ thù khi hitbox chạm đến
                            activeEnemies.forEach(enemy => {
                                if (enemy.sprite.active) {
                                    // Tạo tỉ lệ hụt ngẫu nhiên
                                    const hitChance = Phaser.Math.Between(0, 100);
                                    if (hitChance <= 70) { // Giả sử tỉ lệ trúng là 70%
                                        enemy.takeDamage(20);
                                        console.log(`Enemy took 20 damage. Current health: ${enemy.health}`);
                                        if (enemy.health <= 0) {
                                            this.scene.handleEnemyDeath(enemy); // Kiểm tra cái chết của kẻ thù
                                        }
                                    } else {
                                        console.log('Attack missed the enemy.');
                                    }
                                }
                            });

                            attackHitbox.destroy(); // Xóa hitbox sau khi hoàn tất
                            this.isAttacking = false;
                            this.play('player'); // Trở về hoạt ảnh idle
                        }
                    });
                }
            });
            this.scene.physics.add.overlap(attackHitbox, this.scene.enemies, (hitbox, enemy) => {
                if (enemy.sprite.active) {
                    // Phát hoạt ảnh attack khi va chạm xảy ra
                    attackHitbox.play('attack');
                }
            });
            // Kiểm tra nếu vẫn còn kẻ thù sống sót
            const remainingActiveEnemies = this.scene.enemies.some(enemy => enemy.sprite.active);
            if (!remainingActiveEnemies) {
                this.skillWSprite.destroy(); // Xóa sprite sau khi hoàn tất nếu không còn kẻ thù
                console.log('Skill W sprite destroyed.');
            } else {
                console.log('Skill W continues as there are still active enemies.');
            }
        }
    }


    useSkillE() {
        console.log('Skill E activated.');

        // Xóa sprite cũ nếu tồn tại
        if (this.skillESprite && this.skillESprite.active) {
            this.skillESprite.destroy();
            console.log('Old Skill E sprite destroyed.');
        }

        // Lọc ra các kẻ thù còn sống
        const activeEnemies = this.scene.enemies.filter(enemy => enemy && enemy.sprite && enemy.sprite.active);

        if (activeEnemies.length === 0) {
            console.log('No active enemies to target.');
            return;
        }

        // Tính toán vị trí trung tâm của các kẻ thù còn sống
        const centerX = activeEnemies.reduce((sum, enemy) => sum + enemy.sprite.x, 0) / activeEnemies.length;
        const centerY = activeEnemies.reduce((sum, enemy) => sum + enemy.sprite.y, 0) / activeEnemies.length;

        // Tạo sprite cho kỹ năng Q ở vị trí trung tâm của các kẻ thù
        this.skillESprite = this.scene.physics.add.sprite(centerX, centerY - 200, 'skillE'); // Đặt y cao hơn vị trí trung tâm
        this.skillESprite.setOrigin(0.5, 0.5); // Căn giữa sprite
        this.skillESprite.play('skillE'); // Phát hoạt ảnh
        this.skillESprite.setScale(0.9);
        console.log('Skill E sprite created and animation started.');

        // Tạo tween để di chuyển từ trên xuống
        this.scene.tweens.add({
            targets: this.skillESprite,
            y: centerY, // Di chuyển đến vị trí trung tâm
            duration: 600, // Thời gian di chuyển
            ease: 'Power1',
            onComplete: () => {
                console.log('Skill E animation complete.');
                // Gây sát thương cho tất cả kẻ thù khi hoạt ảnh hoàn tất
                activeEnemies.forEach(enemy => {
                    if (enemy.sprite.active) {
                        // Tạo tỉ lệ hụt ngẫu nhiên
                        const hitChance = Phaser.Math.Between(0, 100);
                        if (hitChance <= 70) { // Giả sử tỉ lệ trúng là 70%
                            enemy.takeDamage(30); // Gây sát thương 30
                            console.log(`Enemy took 30 damage. Current health: ${enemy.health}`);
                            if (enemy.health <= 0) {
                                this.scene.handleEnemyDeath(enemy); // Kiểm tra cái chết của kẻ thù
                            }
                        } else {
                            console.log('Skill Q missed the enemy.');
                        }
                    }
                });

                // Kiểm tra nếu vẫn còn kẻ thù sống sót
                const remainingActiveEnemies = this.scene.enemies.some(enemy => enemy.sprite.active);
                if (!remainingActiveEnemies) {
                    this.skillESprite.destroy(); // Xóa sprite sau khi hoàn tất nếu không còn kẻ thù
                    console.log('Skill E sprite destroyed.');
                } else {
                    console.log('Skill E continues as there are still active enemies.');
                }
            }
        });
    }

    useSkillR() {
        console.log('Skill R activated.');

        // Xóa sprite cũ nếu tồn tại
        if (this.skillRSprite && this.skillRSprite.active) {
            this.skillRSprite.destroy();
            console.log('Old Skill R sprite destroyed.');
        }

        // Lọc ra các kẻ thù còn sống
        const activeEnemies = this.scene.enemies.filter(enemy => enemy && enemy.sprite && enemy.sprite.active);

        if (activeEnemies.length === 0) {
            console.log('No active enemies to target.');
            return;
        }

        // Tính toán vị trí trung tâm của các kẻ thù còn sống
        const centerX = activeEnemies.reduce((sum, enemy) => sum + enemy.sprite.x, 0) / activeEnemies.length;
        const centerY = activeEnemies.reduce((sum, enemy) => sum + enemy.sprite.y, 0) / activeEnemies.length;

        // Tạo sprite cho kỹ năng Q ở vị trí trung tâm của các kẻ thù
        this.skillRSprite = this.scene.physics.add.sprite(centerX, centerY - 200, 'skillR'); // Đặt y cao hơn vị trí trung tâm
        this.skillRSprite.setOrigin(0.5, 0.5); // Căn giữa sprite
        this.skillRSprite.play('skillR'); // Phát hoạt ảnh
        this.skillRSprite.setScale(0.9);
        console.log('Skill R sprite created and animation started.');

        // Tạo tween để di chuyển từ trên xuống
        this.scene.tweens.add({
            targets: this.skillRSprite,
            y: centerY, // Di chuyển đến vị trí trung tâm
            duration: 600, // Thời gian di chuyển
            ease: 'Power1',
            onComplete: () => {
                console.log('Skill R animation complete.');
                // Gây sát thương cho tất cả kẻ thù khi hoạt ảnh hoàn tất
                activeEnemies.forEach(enemy => {
                    if (enemy.sprite.active) {
                        // Tạo tỉ lệ hụt ngẫu nhiên
                        const hitChance = Phaser.Math.Between(0, 100);
                        if (hitChance <= 70) { // Giả sử tỉ lệ trúng là 70%
                            enemy.takeDamage(30); // Gây sát thương 30
                            console.log(`Enemy took 30 damage. Current health: ${enemy.health}`);
                            if (enemy.health <= 0) {
                                this.scene.handleEnemyDeath(enemy); // Kiểm tra cái chết của kẻ thù
                            }
                        } else {
                            console.log('Skill Q missed the enemy.');
                        }
                    }
                });

                // Kiểm tra nếu vẫn còn kẻ thù sống sót
                const remainingActiveEnemies = this.scene.enemies.some(enemy => enemy.sprite.active);
                if (!remainingActiveEnemies) {
                    this.skillQSprite.destroy(); // Xóa sprite sau khi hoàn tất nếu không còn kẻ thù
                    console.log('Skill R sprite destroyed.');
                } else {
                    console.log('Skill R continues as there are still active enemies.');
                }
            }
        });
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
        // Phát hoạt ảnh "hurt" trên sprite phụ
        if (!this.hurtSprite) {
            this.hurtSprite = this.scene.add.sprite(this.sprite.x - 100, this.sprite.y, 'hurt');
            this.hurtSprite.setDepth(1); // Đảm bảo sprite "hurt" nằm trên sprite chính
        } else {
            // Cập nhật vị trí của hurtSprite nếu nó đã tồn tại
            this.hurtSprite.setPosition(this.sprite.x - 100, this.sprite.y);
        }
        this.hurtSprite.play("hurt").setScale(2);

        // Phát hoạt ảnh "player" trên sprite chính
        this.sprite.play("player");

        this.health -= amount;
        this.updateHealthBar();
        console.log("Player was attacked");

        // Kiểm tra nếu sức khỏe <= 0 và xử lý cái chết của người chơi
        if (this.health <= 0) {
            this.scene.handlePlayerDeath(this);
        }
    }
}

export default Player;
