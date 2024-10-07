class Skill {
    constructor(name, cooldownTime, damage) {
        this.name = name;             // Tên kỹ năng
        this.cooldownTime = cooldownTime; // Thời gian hồi
        this.cooldown = 0;            // Thời gian hồi hiện tại
        this.damage = damage;         // Sát thương
    }

    canUse() {
        return this.cooldown === 0;
    }
    use() {
        if (this.canUse()) {
            this.cooldown = this.cooldownTime; // Đặt lại thời gian hồi
            console.log(`${this.name} đã được sử dụng!`);
            return true;
        } else {
            console.log(`${this.name} đang trong thời gian hồi (${this.cooldown} lượt).`);
            return false;
        }
    }

    // Cập nhật thời gian hồi
    updateCooldown() {
        if (this.cooldown > 0) {
            this.cooldown--;
        }
    }
}

