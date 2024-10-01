class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, healthBarId, nameId, healthNumberId) {
        super(scene, x, y, 'player');
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.world.enable(this);

        // Set up player properties
        this.setScale(5);
        this.healthBarId = healthBarId;
        this.nameId = nameId;
        this.healthNumberId = healthNumberId;
        this.health = 10000;
        this.maxHealth = 10000;
        this.isAttacking = false;
        this.skills = {
            Q: { name: 'Skill Q', cooldown: 0, maxCooldown: 3 },
            W: { name: 'Skill W', cooldown: 0, maxCooldown: 3 },
            E: { name: 'Skill E', cooldown: 0, maxCooldown: 3 },
            R: { name: 'Skill R', cooldown: 0, maxCooldown: 3 }
        };
        this.on('animationcomplete', this.handleAnimationComplete, this);
    }

    handleAnimationComplete(animation) {
        if (animation.key === 'attack') {
            this.isAttacking = false;
            this.play('player');
            console.log('Player is Idle.');
        }
    }

    updateHealthBar() {
        const healthBar = document.getElementById(this.healthBarId);
        const healthNumber = document.getElementById(this.healthNumberId);
        const healthPercentage = (this.health / this.maxHealth) * 100;

        healthBar.style.width = `${healthPercentage}%`;
        healthNumber.innerText = `${this.health}/${this.maxHealth}`;
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
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        this.updateHealthBar(); // Update health UI
    }

    useSkill(skill, enemies) {
        const skillData = this.skills[skill];
        if (skillData.cooldown === 0) {
            this[`useSkill${skill}`](enemies);
            skillData.cooldown = skillData.maxCooldown; // Reset cooldown
        } else {
            console.log(`${skillData.name} is on cooldown for ${skillData.cooldown.toFixed(1)} seconds.`);
        }
    }

    attack(enemies) {
        if (!this.isAttacking) {
            this.isAttacking = true;
            this.play("playerAttack");
            const attackHitbox = this.createHitbox(this.x, this.y, 'attack', 3);

            const activeEnemies = this.scene.enemies.getChildren().filter(enemy => enemy && enemy.active);
            if (activeEnemies.length === 0) {
                this.scene.checkGameOver();
                this.isAttacking = false;
                attackHitbox.destroy();
                this.play('player');
                return;
            }

            const centerX = activeEnemies.reduce((sum, enemy) => sum + enemy.x, 0) / activeEnemies.length;

            this.scene.tweens.add({
                targets: attackHitbox,
                x: centerX,
                duration: 200,
                ease: 'Power2',
                onComplete: () => {
                    attackHitbox.play('attack');
                    attackHitbox.once('animationcomplete', () => this.applyDamage(activeEnemies, attackHitbox));
                }
            });

            this.scene.physics.add.overlap(attackHitbox, activeEnemies, (hitbox, enemy) => {
                if (enemy.active && !hitbox.hasPlayedAttack) {
                    hitbox.play('attack');
                    hitbox.hasPlayedAttack = true;
                }
            });
        }
    }

    applyDamage(activeEnemies, attackHitbox) {
        activeEnemies.forEach(enemy => {
            const hitChance = Phaser.Math.Between(0, 100);
            if (hitChance <= 70) {
                enemy.takeDamage(10);
                console.log(`Enemy took 10 damage. Current health: ${enemy.health}`);
                if (enemy.health <= 0) {
                    this.scene.handleEnemyDeath(enemy);
                }
            } else {
                console.log('Attack missed the enemy.');
            }
        });

        attackHitbox.destroy();
        this.isAttacking = false;
        this.play('player');
    }

    createHitbox(x, y, type, scale) {
        return this.scene.physics.add.sprite(x, y, type).setScale(scale);
    }

    useSkillQ(enemies) {
        this.performSkill(enemies, 'skillQ', 10);
    }

    useSkillW(enemies) {
        this.performSkill(enemies, 'skillW', 30);
    }

    useSkillE(enemies) {
        this.performSkill(enemies, 'skillE', 25);
    }

    useSkillR(enemies) {
        if (!this.isAttacking) {
            console.log('Skill R activated.');
            this.isAttacking = true;
            this.play("playerAttack");

            const activeEnemies = this.scene.enemies.getChildren().filter(enemy => enemy && enemy.active);
            if (activeEnemies.length === 0) {
                this.scene.checkGameOver();
                this.isAttacking = false;
                this.play('player');
                return;
            }

            const centerY = activeEnemies.reduce((sum, enemy) => sum + enemy.y, 0) / activeEnemies.length;
            const centerX = activeEnemies.reduce((sum, enemy) => sum + enemy.x, 0) / activeEnemies.length;

            const attackHitbox = this.createHitbox(centerX, centerY - 200, 'skillR', 0.8);

            this.scene.tweens.add({
                targets: attackHitbox,
                y: centerY,
                duration: 500,
                ease: 'Power1',
                onComplete: () => {
                    attackHitbox.play('skillR');
                    attackHitbox.once('animationcomplete', () => {
                        activeEnemies.forEach(enemy => {
                            if (enemy.active) {
                                enemy.takeDamage(50);
                                console.log(`Enemy took 50 damage from Skill R. Current health: ${enemy.health}`);
                                if (enemy.health <= 0) {
                                    this.scene.handleEnemyDeath(enemy);
                                    console.log('Enemy killed by Skill R.');
                                }
                            }
                        });
                        attackHitbox.destroy();
                        this.isAttacking = false;
                        this.play('player');
                    });
                }
            });
        }
    }

    performSkill(enemies, skillType, damage) {
        if (!this.isAttacking) {
            console.log(`${skillType} activated.`);
            this.isAttacking = true;
            this.play("playerAttack");

            const attackHitbox = this.createHitbox(this.x, this.y, skillType, 5);
            const activeEnemies = this.scene.enemies.getChildren().filter(enemy => enemy && enemy.active);

            if (activeEnemies.length === 0) {
                this.scene.checkGameOver();
                this.isAttacking = false;
                attackHitbox.destroy();
                this.play('player');
                return;
            }

            const centerX = activeEnemies.reduce((sum, enemy) => sum + enemy.x, 0) / activeEnemies.length;

            this.scene.tweens.add({
                targets: attackHitbox,
                x: centerX,
                duration: 500,
                ease: 'Power1',
                onComplete: () => {
                    attackHitbox.play(skillType);
                    attackHitbox.once('animationcomplete', () => {
                        activeEnemies.forEach(enemy => {
                            if (enemy.active) {
                                enemy.takeDamage(damage);
                                console.log(`Enemy took ${damage} damage from ${skillType}. Current health: ${enemy.health}`);
                                if (enemy.health <= 0) {
                                    this.scene.handleEnemyDeath(enemy);
                                    console.log(`Enemy killed by ${skillType}.`);
                                }
                            }
                        });
                        attackHitbox.destroy();
                        this.isAttacking = false;
                        this.play('player');
                    });
                }
            });
        }
    }

    update(time, delta) {
        // Update cooldowns
        for (const skill in this.skills) {
            if (this.skills[skill].cooldown > 0) {
                this.skills[skill].cooldown -= delta / 1000; // Convert delta to seconds
                if (this.skills[skill].cooldown < 0) {
                    this.skills[skill].cooldown = 0; // Ensure cooldown does not go below 0
                }
            }
        }
    }
}

export default Player;
