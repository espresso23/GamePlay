class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    preload() {
        this.load.image('win', 'assets/win.png');
        this.load.image('backgroundOver', 'assets/background/backgroundGameover.jpg');
    }

    create() {
        // Hiển thị background nền
        document.getElementsByClassName('logo')[0].style.display  = 'none';
        document.getElementById('health-bars').style.display = 'none';
        const background = this.add.image(0, 0, 'backgroundOver').setOrigin(0, 0);
        background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // Tạo lớp phủ màu đen
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7); // Màu đen với độ mờ 70%
        overlay.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        // Hiển thị hình ảnh "Win" với hiệu ứng transition
        const winImage = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'win').setOrigin(0.5, 0.8)
        winImage.setScale(0.1); // Bắt đầu với kích thước nhỏ

        // Tạo hiệu ứng transition cho hình ảnh "Win"
        this.tweens.add({
            targets: winImage,
            scale: 1, // Tăng kích thước lên 1
            duration: 1000, // Thời gian hiệu ứng là 1 giây
            ease: 'Bounce.easeOut'
        });

        // Quay lại game khi nhấn chuột
        this.add.text(this.sys.game.config.width / 2 - 30, this.sys.game.config.height / 2 + 50, "Click to continue", { font: "25px Arial", fill: "yellow" }).setOrigin(0.5);
        this.input.on('pointerdown', () =>  window.location.href = "stage.html");
    }
}

export default WinScene;
