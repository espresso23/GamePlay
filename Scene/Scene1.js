class Scene1 extends Phaser.Scene {
    constructor() {
        super("BootGame");
    }

    preload() {
        this.load.image('background', 'assets/background/background3.png');
        this.load.image('gold','assets/gold.png')
        this.load.image('experience','assets/experience.png')
        this.load.image('health','assets/health.png')

        this.load.spritesheet("enemy1", 'assets/NightBorne.png', {
            frameWidth: 80,
            frameHeight: 80
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
        this.load.spritesheet('skillR', 'assets/BlastQ.png', {
            frameWidth: 440,
            frameHeight: 549
        });

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
        this.load.spritesheet("attack", 'assets/SlashAttack.png', {
            frameWidth: 72,
            frameHeight: 72
        })
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");



    }
}

export default Scene1;
