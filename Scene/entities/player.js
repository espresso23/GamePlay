class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.world.enable(this);

        // Thiết lập các thuộc tính cho player
        this.setScale(5);
        this.attackDamage = 10;
        this.skillDamage = { Q: 20, W: 30, E: 40, R: 50 };
        this.experience = 0;
        this.level = 1;
        this.nextLevelExperience = 50; // Max experience for level up
        this.gold = 0;
        this.name = "Samurai";
        this.health = this.maxHealth = 200;
        this.isDead = false;
        this.isAnimating = false; // Trạng thái hoạt ảnh

        this.updateUI();
    }
    updateUI() {
        // Cập nhật tên người chơi
        document.getElementById('player-name').innerText = this.name;
        document.getElementById('player-experience-name').innerText = 'EXP'

        // Cập nhật vàng
        document.getElementById('gold').innerText = this.gold;

        // Cập nhật cấp độ
        document.getElementById('player-level').innerText = `Level ${this.level}`;

        // Cập nhật thanh máu và chỉ số máu
        this.updateHealthBar();

        // Cập nhật thanh kinh nghiệm và chỉ số kinh nghiệm
        this.updateExperienceBar();
    }
    gainExperience(amount) {
        this.experience += amount;
        console.log(`Experience Gained: ${this.experience}, Next Level Experience: ${this.nextLevelExperience}`);

        const experienceBar = document.getElementById('player-experience');
        const experiencePercentage = (this.experience / this.nextLevelExperience) * 100;
        experienceBar.style.width = experiencePercentage + '%';

        document.getElementById('player-experience-number').innerText = `${this.experience}/${this.nextLevelExperience}`;

        if (this.experience >= this.nextLevelExperience) {
            this.levelUp();
        }
        this.updateUI();
    }


    levelUp() {
        this.level++;
        this.experience = 0;  // Reset experience after level up
        this.nextLevelExperience += 50;  // Tăng kinh nghiệm cần để lên cấp sau
        document.getElementById('player-level').innerText = `Level ${this.level}`;
        document.getElementById('player-experience-number').innerText = `${this.experience}/${this.nextLevelExperience}`;
        console.log("Level up! Now at level: " + this.level);
        this.updateUI();
    }
    updateExperienceBar() {
        const experienceBar = document.getElementById('player-experience');
        const experiencePercentage = (this.experience / this.nextLevelExperience) * 100; // Tính toán tỷ lệ phần trăm kinh nghiệm
        experienceBar.style.width = experiencePercentage + '%';
        document.getElementById('player-experience-number').innerText = `${this.experience}/${this.nextLevelExperience}`; // Cập nhật hiển thị kinh nghiệm
    }

    basicAttack(target) {
        this.play('playerAttack');
        this.moveAttack(target, 'attack', 800, () => {
            target.takeDamage(this.attackDamage);
        });
    }

    useSkill(skill, target) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.play('playerAttack');

        const skillConfigs = {
            Q: { scale: 3, offset: { x: 0, y: 0 } },
            W: { scale: 3, offset: { x: 0, y: 0 } },
            E: { scale: 3, offset: { x: 0, y: 0 } },
            R: { scale: 0.8, offset: { x: 0, y: 0 } }
        };

        const config = skillConfigs[skill];
        const skillSprite = this.createSkillSprite(config, skill);

        this.moveSkill(skillSprite, target, skill);
    }

    createSkillSprite(config, skill) {
        const skillSprite = this.scene.add.sprite(
            this.x + config.offset.x,
            this.y + config.offset.y,
            `skill${skill}`
        )
            .setScale(config.scale)
            .play(`skill${skill}`);

        skillSprite.on('animationcomplete', () => skillSprite.destroy());
        return skillSprite;
    }

    moveSkill(skillSprite, target, skill) {
        this.scene.tweens.add({
            targets: skillSprite,
            x: target.x,
            y: target.y,
            duration: 500,
            ease: 'Power1',
            onComplete: () => {
                target.takeDamage(this.skillDamage[skill]);
                this.isAnimating = false;
            }
        });
    }

    moveAttack(target, animation, speed, onComplete) {
        const attackSprite = this.scene.add.sprite(this.x, this.y, animation)
            .setScale(3)
            .play(animation);

        attackSprite.on('animationcomplete', () => attackSprite.destroy());

        this.scene.tweens.add({
            targets: attackSprite,
            x: target.x,
            y: target.y,
            ease: 'Power1',
            duration: speed,
            onComplete: () => {
                attackSprite.destroy();
                onComplete();
            }
        });
    }

    updatePlayerHub() {
        this.updateHealthBar();
        this.updateExperienceBar();
    }

    updateHealthBar() {
        const healthPercentage = (this.health / this.maxHealth) * 100;
        const healthBar = document.getElementById('player-health');
        if (healthBar) {
            healthBar.style.width = `${Math.max(healthPercentage, 0)}%`;
        }
        const healthNumber = document.getElementById('player-health-number');
        if (healthNumber) {
            healthNumber.innerText = `${this.health}/${this.maxHealth}`;
        }
    }

    updateExperienceBar() {
        const experiencePercentage = (this.experience / this.maxExperience) * 100;
        const experienceBar = document.getElementById('player-experience');
        if (experienceBar) {
            experienceBar.style.width = `${Math.max(experiencePercentage, 0)}%`;
        }
        const experienceNumber = document.getElementById('player-experience-number');
        if (experienceNumber) {
            experienceNumber.innerText = `${this.experience}/${this.maxExperience}`;
        }
    }

    gainExperience(amount) {
        this.experience = Math.min(this.experience + amount, this.maxExperience);
        this.updateExperienceBar();
        // Kiểm tra xem người chơi có đạt cấp độ mới không
        if (this.experience >= this.maxExperience) {
            this.levelUp();
        }
    }

    levelUp() {
        // Xử lý việc lên cấp, ví dụ:
        this.maxExperience += 50; // Tăng maxExperience cho cấp độ tiếp theo
        this.experience = 0; // Đặt lại kinh nghiệm
        this.maxHealth += 20; // Tăng máu tối đa
        this.health = this.maxHealth; // Khôi phục máu khi lên cấp
        console.log('Player leveled up!');
    }

    takeDamage(amount) {
        if (!this.hurtSprite) {
            this.hurtSprite = this.scene.add.sprite(this.x - 100, this.y, 'hurt').setDepth(1);
        } else {
            this.hurtSprite.setPosition(this.x - 100, this.y);
        }
        this.hurtSprite.play("hurt").setScale(2);

        this.play("player");
        this.health = Math.max(this.health - amount, 0);
        this.updateHealthBar();
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;

        this.play("dead").setScale(1.5);
        this.once('animationcomplete', () => {
            console.log('Player đã chết.');
            this.scene.checkGameOver();
        });
    }
    update() {
        this.updateUI();
    }
}

export default Player;
