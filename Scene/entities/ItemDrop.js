class ItemDrop extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, player, type) {
        // Choose the sprite based on the item type
        let spriteKey;
        switch (type) {
            case 'gold':
                spriteKey = 'gold'; // The 'gold' image from preload
                break;
            case 'health':
                spriteKey = 'health'; // The 'health' image from preload
                break;
            case 'experience':
                spriteKey = 'experience'; // The 'experience' image from preload
                break;
            default:
                spriteKey = 'gold'; // Default to 'gold' if no type is specified
        }

        super(scene, x, y, spriteKey); // Use the correct sprite key
        this.scene = scene;
        this.player = player;
        this.type = type; // Store the item type for later use

        // Add the item sprite to the scene
        scene.add.existing(this);
        scene.physics.world.enable(this);

        // Move the item towards the player
        scene.tweens.add({
            targets: this,
            x: player.x,
            y: player.y,
            duration: 1000,
            ease: 'Power1',
            onComplete: () => {
                this.onCollect();
            }
        });

        // Add a slight bounce effect to the item drop
        this.scene.tweens.add({
            targets: this,
            y: y - 20, // Jump up slightly
            yoyo: true,
            repeat: -1,
            duration: 500,
            ease: 'Sine.easeInOut'
        });
    }

    onCollect() {
        // Handle rewards based on item type
        switch (this.type) {
            case 'gold':
                this.player.gold += 10; // Increase player's gold by 10 (adjust as needed)
                document.getElementById('gold').innerText = this.player.gold; // Update UI
                break;
            case 'health':
                this.player.health = Math.min(this.player.health + 20, this.player.maxHealth); // Heal player (capped by maxHealth)
                this.player.updateHealthBar(); // Update health bar in UI
                break;
            case 'experience':
                this.player.gainExperience(50); // Increase player's experience by 50 (adjust as needed)
                break;
        }
        this.destroy(); // Remove the item sprite after collection
    }
}

export default ItemDrop;
