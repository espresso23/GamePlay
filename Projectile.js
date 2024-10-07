class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, damage, speed, targetX, targetY) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.damage = damage;
        this.speed = speed;

        // Add the projectile to the physics engine and enable collision
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        // Set the velocity to make the projectile move towards a target position
        this.scene.physics.moveTo(this, targetX, targetY, speed);

        // Set a timer to destroy the projectile if it doesn't hit anything
        this.scene.time.delayedCall(3000, () => this.destroy());
    }

    // Method to handle the collision with an enemy
    hitEnemy(enemy) {
        enemy.takeDamage(this.damage); // Apply damage to the enemy
        console.log(`Enemy hit by projectile. Took ${this.damage} damage. Current health: ${enemy.health}`);
        if (enemy.health <= 0) {
            enemy.die();
            console.log('Enemy killed by projectile.');
        }
        this.destroy(); // Destroy the projectile after hitting the enemy
    }
}
