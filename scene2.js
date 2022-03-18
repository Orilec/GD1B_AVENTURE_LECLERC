class scene2 extends Phaser.Scene {
    constructor() {
        super("scene2");
    }

    init(data) {this.positionX = data.positionX, this.positionY = data.positionY; }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('perso', 'assets/perso.png',
            { frameWidth: 32, frameHeight: 48 });
    }
    create() {
        this.add.image(400, 300, 'sky');
        this.add.image(400, 300, 'ground');

        this.physics.world.setBounds(0, 0, 800, 600);

        this.player = this.physics.add.sprite(this.positionX, this.positionY, 'perso');
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'perso', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('perso', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setBounds(0, 0, 800, 600);
        this.cameras.main.startFollow(this.player);

    }

    update() {
        if (this.gameOver) { return; }
        if (this.cursors.left.isDown) { //si la touche gauche est appuyée
            this.player.setVelocityY(0);
            this.player.setVelocityX(-240); //alors vitesse négative en X
            this.player.anims.play('left', true); //et animation => gauche
        }
        else if (this.cursors.right.isDown) { //sinon si la touche droite est appuyée
            this.player.setVelocityY(0);
            this.player.setVelocityX(240); //alors vitesse positive en X
            this.player.anims.play('right', true); //et animation => droite
        }
        else if (this.cursors.up.isDown) {
            //si touche haut appuyée ET que le perso touche le sol
            this.player.setVelocityY(-240); //alors vitesse verticale négative
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
            //(on saute)

        }
        else if (this.cursors.down.isDown) {
            //si touche haut appuyée ET que le perso touche le sol
            this.player.setVelocityY(240); //alors vitesse verticale négative
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
            //(on saute)

        }
        else { // sinon
            this.player.setVelocityX(0); //vitesse nulle
            this.player.setVelocityY(0);
            this.player.anims.play('turn'); //animation fait face caméra
        }

        if (this.player.x <= 20){
            this.positionX = 765;
            this.positionY = this.player.y;
            this.scene.start("scene1", { positionX: this.positionX, positionY: this.positionY });
        }
    }


};
