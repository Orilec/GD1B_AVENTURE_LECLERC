class scene2 extends Phaser.Scene {
    constructor() {
        super("scene2");

    }
    init(data) { this.positionX = data.positionX, this.positionY = data.positionY };
    preload() {
        this.load.image('map', 'assets/map_test_02.png');
        this.load.image('button_unactivated', 'assets/bouton1_rouge.png');
        this.load.image('button_activated', 'assets/bouton1_vert.png');
        this.load.image('trou', 'assets/trou.png');
        this.load.image('area1', 'assets/plateform1.png');
        this.load.image('area2', 'assets/plateform2.png');
        this.load.image('bridge', 'assets/pont.png');
        this.load.image('fond', 'assets/fond.png');
        this.load.image('neurone_1', 'assets/neurone_1.png');
        this.load.image('neurone_2', 'assets/neurone_2.png');
        this.load.spritesheet('perso', 'assets/sprite_sheet_heros.png',
            { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('monstre', 'assets/creature_spritesheet.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('vie', 'assets/vie_spritesheet.png',
            { frameWidth: 96, frameHeight: 64 });

        this.load.image("tileset", "assets/tileset.png");
        this.load.tilemapTiledJSON("map2", "map2.json");


    }



    create() {

        this.physics.world.setBounds(0, 0, 1600, 2560);

        function fall() {
            this.scene.scene.gameOver = true;
            this.scene.scene.player.destroy();
        }
        this.add.tileSprite(800, 1280, 1600, 2560, 'fond');
        this.add.tileSprite(800, 1280, 1600, 2560, 'neurone_1').setScrollFactor(0.80);
        this.add.tileSprite(800, 1280, 1600, 2560, 'neurone_2').setScrollFactor(0.90);

        this.button1Activated = false;
        this.button2Activated = false;
        this.bridgeAppeared = false;
        this.keyJustDown = "down";
        this.health = 3;
        this.isAttacking = false;
        this.isJumping = false;
        this.invulnerable = false;
        this.monstre_alive = true;

        const map2 = this.add.tilemap("map2");

        const tileset = map2.addTilesetImage(
            "tileset", "tileset"
        );

        // this.platforms = this.physics.add.staticGroup();
        // this.platforms.create(96, 96, 'area1');
        // this.platforms.create(328, 96, 'area2');

        // const fond = map.createImageLayer(
        //     "neurone",
        //     tileset
        // );


        // const neurones_1 = map.createImageLayer(
        //     "neurone_1",
        //     tileset
        // );

        // const neurones_2 = map.createImageLayer(
        //     "neurone_2",
        //     tileset
        // );

        const plateformes = map2.createLayer(
            "plateformes",
            tileset
        );

        plateformes.setCollisionByProperty({ estSolide: true });

        const portail1 = map2.createLayer(
            "portail1",
            tileset
        );
        portail1.setCollisionByProperty({ portail1: true });

        const portail2 = map2.createLayer(
            "portail2",
            tileset
        );
        portail2.setCollisionByProperty({ portail2: true });

        // const trou = map2.createLayer(
        //     "trou",
        //     tileset

        // )

        // trou.setCollisionByProperty({ trou: true });

        // this.trous = this.physics.add.staticGroup();
        // this.trou1 = this.trous.create(550, 150, 'trou')


        this.buttons = this.physics.add.staticGroup();
        this.button1 = this.buttons.create(200, 100, 'button_unactivated');
        this.button2 = this.buttons.create(100, 150, 'button_unactivated');



        this.player = this.physics.add.sprite(670, 2320, 'perso');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.player.body.setSize(20, 16);
        this.player.body.setOffset(5, 45);

        this.cameras.main.setBounds(0, 0, 1600, 2560);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2)

        // this.physics.add.overlap(this.player, this.platforms, checkBounds, null, this);
        this.physics.add.collider(this.player, plateformes);
        this.physics.add.overlap(this.player, this.button1, activate1, null, this);
        this.physics.add.overlap(this.player, this.button2, activate2, null, this);
        this.collider = this.physics.add.collider(this.player, portail1, passageScene1, null, this);
        this.collider = this.physics.add.collider(this.player, portail2, passageScene3, null, this);
        // this.collider = this.physics.add.collider(this.player, trou, fall, null, this);
        




        this.monstre = this.physics.add.sprite(50, 150, 'monstre');
        this.monstre.setPushable(false);
        this.monstreRight = true;

        this.physics.add.collider(this.player, this.monstre, ennemyCollider, null, this);

        this.vie = this.add.sprite(370, 220, 'vie');
        this.vie.setScrollFactor(0);



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
            frames: this.anims.generateFrameNumbers('perso', { start: 16, end: 21 }),
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

        this.anims.create({
            key: 'pv3',
            frames: this.anims.generateFrameNumbers('vie', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'pv2',
            frames: this.anims.generateFrameNumbers('vie', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'pv1',
            frames: this.anims.generateFrameNumbers('vie', { start: 2, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'pv0',
            frames: this.anims.generateFrameNumbers('vie', { start: 3, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        function activate1() {
            this.scene.scene.button1.setTexture('button_activated')
            this.scene.scene.button1Activated = true;
        }

        function activate2() {
            this.scene.scene.button2.setTexture('button_activated')
            this.scene.scene.button2Activated = true;
        }

        function passageScene1() {
            this.scene.start("test_mecaniques");
            // , { positionX: this.positionX, positionY: this.positionY });
        }

        
        function passageScene3() {
            this.scene.start("scene3");
            // , { positionX: this.positionX, positionY: this.positionY });
        }

        function ennemyCollider() {
            if (this.scene.scene.isAttacking) {
                this.scene.scene.monstre.destroy();
                this.scene.scene.monstre_alive = false;
            }
            else {
                if (!this.scene.scene.invulnerable) {
                    this.scene.scene.invulnerable = true;
                    this.scene.scene.health -= 1;
                    setTimeout(() => {
                        this.scene.scene.invulnerable = false;
                    }, 1000);
                }
            }


        }


        this.varBridge = function bridgeActivation() {
            console.log("oui")
            this.bridgeAppeared = true;
            const bridge = map2.createLayer(
                "pont",
                tileset
            );
            this.player.depth = 2;
            bridge.depth = 1;
        }

        this.varTrou = function saut() {
            this.scene.scene.isJumping = true;
            this.physics.world.removeCollider(this.collider);
            this.scene.scene.player.anims.play('turn');
            this.scene.scene.player.setAccelerationX(10000);
            setTimeout(() => {
                this.scene.scene.player.setAccelerationX(0);
                this.scene.scene.collider = this.physics.add.collider(this.scene.scene.player, trou, fall, null, this);
                this.scene.scene.isJumping = false;
            }, 800);

        }


        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors2 = this.input.keyboard.addKeys('space, A');

    }





    update() {
        if (this.gameOver) { return; }



        if (this.cursors2.space.isDown) {
            if (!this.isJumping) {
                this.varTrou();
            }
        }


        if (this.health == 3) {
            this.vie.anims.play('pv3', true)
        }
        else if (this.health == 2) {
            this.vie.anims.play('pv2', true)
        }
        else if (this.health == 1) {
            this.vie.anims.play('pv1', true)
        }
        else {
            this.vie.anims.play('pv0', true)
            this.gameOver = true; //si les pvs sont à 0, game over
        }

        if (this.button1Activated && this.button2Activated && !this.bridgeAppeared) {
            this.physics.world.removeCollider(this.collider2);
            this.varBridge();
        }

        if (this.cursors2.A.isDown && this.keyJustDown == "down") {
            if (!this.isAttacking) {
                this.isAttacking = true;
                this.player.body.setSize(20, 40);
                this.player.body.setOffset(5, 45);

                setTimeout(() => {
                    this.player.body.setSize(20, 16);
                    this.player.body.setOffset(5, 45);
                    this.isAttacking = false;
                }, 500);
            }

        }

        if (this.cursors2.A.isDown && this.keyJustDown == "up") {
            if (!this.isAttacking) {
                this.isAttacking = true;
                this.player.body.setSize(20, 40);
                this.player.body.setOffset(5, 0);

                setTimeout(() => {
                    this.player.body.setSize(20, 16);
                    this.player.body.setOffset(5, 45);
                    this.isAttacking = false;
                }, 500);
            }
        }

        if (this.cursors2.A.isDown && this.keyJustDown == "right") {
            if (!this.isAttacking) {
                this.isAttacking = true;
                this.player.body.setSize(40, 20);
                this.player.body.setOffset(15, 25);

                setTimeout(() => {
                    this.player.body.setSize(20, 16);
                    this.player.body.setOffset(5, 45);
                    this.isAttacking = false;
                }, 500);
            }
        }

        if (this.cursors2.A.isDown && this.keyJustDown == "left") {
            if (!this.isAttacking) {
                this.isAttacking = true;
                this.player.body.setSize(40, 20);
                this.player.body.setOffset(-15, 25);

                setTimeout(() => {
                    this.player.body.setSize(20, 16);
                    this.player.body.setOffset(5, 45);
                    this.isAttacking = false;
                }, 500);
            }
        }




        if (this.cursors.left.isDown) {
            this.player.setVelocityY(0);
            this.player.setVelocityX(-240);
            this.player.anims.play('left', true);
            this.keyJustDown = "left";
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityY(0);
            this.player.setVelocityX(240);
            this.player.anims.play('right', true);
            this.keyJustDown = "right";
        }
        else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-240);
            this.player.setVelocityX(0);
            this.player.anims.play('up', true);
            this.keyJustDown = "up";

        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(240);
            this.player.setVelocityX(0);
            this.player.anims.play('down', true);
            this.keyJustDown = "down";

        }
        else { // sinon
            this.player.setVelocityX(0); //vitesse nulle
            this.player.setVelocityY(0);
            this.player.anims.play('turn'); //animation fait face caméra
        }


        if (this.monstre_alive) {
            if (this.monstre.x < 30) {
                this.monstreRight = true;
                this.monstreLeft = false;

            }
            if (this.monstre.x > 100) {
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
        }



        // if (this.player.x >= 770){
        //     this.positionX = 30;
        //     this.positionY = this.player.y;
        //     this.scene.start("scene2", { positionX: this.positionX, positionY: this.positionY });
        // }


    }


};