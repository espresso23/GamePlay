class Scene1 extends Phaser.Scene {
    constructor() {
        super("BootGame");
    }

    preload() {
        this.load.image('background', 'assets/background/background3.png');
        this.load.spritesheet('skillR', 'assets/BlastQ.png', {
            frameWidth: 440,
            frameHeight: 549
        });
        this.load.spritesheet('enemyAttack', 'assets/enemyAttack.png', {
            frameWidth: 64,
            frameHeight: 56
        });
        this.load.spritesheet('skillW', 'assets/splashW.png', {
            frameWidth: 64,
            frameHeight: 72
        });
        this.load.spritesheet('skillE', 'assets/skillE.png', {
            frameWidth: 64,
            frameHeight: 57
        });
        this.load.spritesheet('skillQ', 'assets/skillQ.png', {
            frameWidth: 64,
            frameHeight: 57
        });
        this.load.spritesheet("enemy1", 'assets/NightBorne.png', {
            frameWidth: 80,
            frameHeight: 80
        })
        this.load.spritesheet("player", 'assets/playerIdle.png', {
            frameWidth: 93,
            frameHeight: 40
        })
        this.load.spritesheet("playerAttack", 'assets/playerAttack.png', {
            frameWidth: 90,
            frameHeight: 43
        })
        this.load.spritesheet("playerHurt", 'assets/playerHurt.png', {
            frameWidth: 100,
            frameHeight: 100
        })
        this.load.spritesheet("playerDead", 'assets/playerDead.png', {
            frameWidth: 130,
            frameHeight: 128
        })
        this.load.spritesheet("attack", 'assets/SlashAttack.png',{
            frameWidth: 72,
            frameHeight: 72
        })
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");
        this.anims.create({
            key: "enemy1Idle",
            frames: this.anims.generateFrameNumbers("enemy1", { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "enemy1Attack",
            frames: this.anims.generateFrameNumbers("enemy1", { start: 49, end: 55 }),
            frameRate: 20,
            repeat: 0, // Play once
            // hideOnComplete: true
        });
        this.anims.create({
            key: "enemyAttack",
            frames: this.anims.generateFrameNumbers("enemyAttack"),
            frameRate: 60,
            repeat: 0,
        });
        this.anims.create({
            key: "enemy1Hurt",
            frames: this.anims.generateFrameNumbers("enemy1", { start: 68, end: 73 }),
            frameRate: 8,
            repeat: 0, // Play once
        });
        this.anims.create({
            key: "enemy1Dead",
            frames: this.anims.generateFrameNumbers("enemy1", { start: 89, end: 110 }),
            frameRate: 20,
            repeat: 0, // Play once
            hideOnComplete: true
        });
        this.anims.create({
            key: "skillR",
            frames: this.anims.generateFrameNumbers("skillR"),
            frameRate: 10,
            repeat: 0,
            hideOnComplete: true
        });
        this.anims.create({
            key: "skillW",
            frames: this.anims.generateFrameNumbers("skillW"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });
        this.anims.create({
            key: "skillE",
            frames: this.anims.generateFrameNumbers("skillE"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });
        this.anims.create({
            key: "skillQ",
            frames: this.anims.generateFrameNumbers("skillQ"),
            frameRate: 30,
            repeat: 0,
            hideOnComplete: true
        });

        
    }
}

export default Scene1;
