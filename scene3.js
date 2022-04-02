class scene3 extends Phaser.Scene {
    constructor() {
        super("scene1");
        
    }
    init(data) {this.positionX = data.positionX, this.positionY = data.positionY};
    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('map', 'assets/map_test_02.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('perso', 'assets/sprite_sheet_heros.png',
            { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('monstre', 'assets/creature_spritesheet.png',
            { frameWidth: 32, frameHeight: 32 });
    }



    create() {
        this.add.image(2250, 1750, 'map');

        this.physics.world.setBounds(0, 0, 4500, 3500);

        this.player = this.physics.add.sprite(3000, 1400, 'perso');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

        this.monstre = this.physics.add.sprite(2000, 1000, 'monstre');

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('perso', { start: 6, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'perso', frame: 6 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('perso', { start: 10, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('perso', { start: 16, end: 21}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'm_up',
            frames: this.anims.generateFrameNumbers('monstre', { start: 6, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'm_down',
            frames: this.anims.generateFrameNumbers('monstre', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'm_right',
            frames: this.anims.generateFrameNumbers('monstre', { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'm_left',
            frames: this.anims.generateFrameNumbers('monstre', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });




        this.cursors = this.input.keyboard.createCursorKeys();


        this.cameras.main.setBounds(0, 0, 4500, 3500);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2)

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
            this.player.setVelocityY(-240); 
            this.player.setVelocityX(0);
            this.player.anims.play('up', true);

        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(240); 
            this.player.setVelocityX(0);
            this.player.anims.play('down', true);


        }
        else { // sinon
            this.player.setVelocityX(0); //vitesse nulle
            this.player.setVelocityY(0);
            this.player.anims.play('turn'); //animation fait face caméra
        }

        if (this.monstre.x < 400) {
            this.monstreRight = true;
            this.monstreLeft = false;

        }
        if (this.monstre.x > 1200) {
            this.monstreLeft = true;
            this.monstreRight = false;

        }

        if (this.monstreRight) {
            this.monstre.setVelocityX(100);
            this.monstre.anims.play('m_right', true);
        }
        if (this.monstreLeft) {
            this.monstre.setVelocityX(-100);
            this.monstre.anims.play('m_left', true);
        }


        // if (this.player.x >= 770){
        //     this.positionX = 30;
        //     this.positionY = this.player.y;
        //     this.scene.start("scene2", { positionX: this.positionX, positionY: this.positionY });
        // }


    }


};