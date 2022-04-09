class scene1 extends Phaser.Scene {
    constructor() {
        super("scene1");

    }
    init(data) { this.sceneQuitee = data.sceneQuitee, this.spearCollected = data.spearCollected, this.jumpCollected = data.jumpCollected, this.keyCollected = data.keyCollected, this.health = data.health  };
    preload() {
        this.load.image('map', 'assets/map_test_02.png');
        this.load.image('trou', 'assets/trou.png');
        this.load.image('area1', 'assets/plateform1.png');
        this.load.image('area2', 'assets/plateform2.png');
        this.load.image('bridge', 'assets/pont.png');
        this.load.image('fond', 'assets/fond.png');
        this.load.image('neurone_1', 'assets/neurone_1.png');
        this.load.image('neurone_2', 'assets/neurone_2.png');
        this.load.image('fog', 'assets/brouillard.png');
        this.load.image('regen', 'assets/serotonin.png');
        this.load.spritesheet('perso', 'assets/sprite_sheet_heros.png',
            { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('monstre', 'assets/creature_spritesheet.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('vie', 'assets/vie_spritesheet.png',
            { frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet('attack', 'assets/attack_spritesheet.png',
            { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('inventaire', 'assets/inventaire_spritesheet.png',
            { frameWidth: 192, frameHeight: 64 });

        this.load.image("tileset", "assets/tileset.png");
        this.load.tilemapTiledJSON("map", "map.json");


    }



    create() {

        this.physics.world.setBounds(0, 0, 3200, 1280);

        function fall() {
            this.scene.scene.isFalling = true;
            this.scene.scene.player.setAlpha(0);
            this.scene.scene.health -= 1;
            if(this.scene.scene.health < 1){
                this.scene.scene.gameover = true;
            }
            setTimeout(() => {
                this.scene.scene.player.x = this.scene.scene.X_saved;
                this.scene.scene.player.y =  this.scene.scene.Y_saved;
                this.scene.scene.player.setAlpha(1);
                this.scene.scene.isFalling = false;
            }, 1000);
        }

        this.add.tileSprite(1600, 640, 3200, 1280, 'fond');
        this.add.tileSprite(1600, 640, 3200, 1280, 'neurone_1').setScrollFactor(0.80);
        this.add.tileSprite(1600, 640, 3200, 1280, 'neurone_2').setScrollFactor(0.90);

        this.button1Activated = false;
        this.button2Activated = false;
        this.bridgeAppeared = false;
        this.keyJustDown = "down";
        this.isAttacking = false;
        this.isJumping = false;
        this.invulnerable = false;
        this.monstre_alive = true;
        this.monstreUp = true;
        this.isFalling = false;

        
        if (this.sceneQuitee!= "scene2" && this.sceneQuitee!= "scene3" && this.sceneQuitee!= "scene4"){
            this.health = 3;
            this.spearCollected = false;
            this.jumpCollected = false;
            this.keyCollected = false;
        }

        const map = this.add.tilemap("map");

        const tileset = map.addTilesetImage(
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

        const plateformes = map.createLayer(
            "Calque de Tuiles 1",
            tileset
        );

        plateformes.depth = 0;
        plateformes.setCollisionByProperty({ estSolide: true });

        const portail1 = map.createLayer(
            "portail1",
            tileset
        );
        portail1.setCollisionByProperty({ portail1: true });

        const portail3 = map.createLayer(
            "portail3",
            tileset
        );
        portail3.setCollisionByProperty({ portail3: true });

        const portail4 = map.createLayer(
            "portail4",
            tileset
        );
        portail4.setCollisionByProperty({ portail4: true });

        const trou = map.createLayer(
            "trou",
            tileset

        )

        this.regen = this.physics.add.group()

        this.ennemies = this.physics.add.group();

        map.getObjectLayer('monstres').objects.forEach((enemy) => {


            const enemySprite = this.ennemies.create(enemy.x, enemy.y, 'monstre').setOrigin(0);
            enemySprite.setPushable(false);


        })

        trou.setAlpha(1);

        trou.setCollisionByProperty({ trou: true });

        this.trous = this.physics.add.staticGroup();
        this.trou1 = this.trous.create(550, 150, 'trou')


        this.buttons = this.physics.add.staticGroup();
        this.button1 = this.buttons.create(200, 100, 'button_unactivated');
        this.button2 = this.buttons.create(100, 150, 'button_unactivated');


        if (this.sceneQuitee == "scene3") {
            this.player = this.physics.add.sprite(1990, 20, 'perso');
        }
        else if (this.sceneQuitee == "scene2") {
            this.player = this.physics.add.sprite(500, 500, 'perso');
        }
        else if (this.sceneQuitee == "scene4") {
            this.player = this.physics.add.sprite(2850, 480, 'perso');
        }
        else {
            this.player = this.physics.add.sprite(2000, 1000, 'perso');
        }

        this.player.setCollideWorldBounds(true);

        this.player.body.setSize(20, 16);
        this.player.body.setOffset(5, 45);

        this.cameras.main.setBounds(0, 0, 3200, 1280);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2)

        // this.physics.add.overlap(this.player, this.platforms, checkBounds, null, this);
        this.physics.add.collider(this.player, plateformes);
        this.physics.add.overlap(this.player, this.button1, activate1, null, this);
        this.physics.add.overlap(this.player, this.button2, activate2, null, this);
        this.physics.add.collider(this.player, portail1, passageScene2, null, this);
        this.physics.add.collider(this.player, portail3, passageScene3, null, this);
        this.physics.add.collider(this.player, portail4, passageScene4, null, this);
        this.collider = this.physics.add.collider(this.player, trou, fall, null, this);
        this.physics.add.collider(this.player, this.regen, regenVie, null, this);





        // this.monstre = this.physics.add.sprite(50, 150, 'monstre');
        // this.monstre.setPushable(false);
        // this.monstreRight = true;

        this.physics.add.collider(this.player, this.ennemies, ennemyCollider, null, this);
        this.add.tileSprite(1600, 640, 3200, 1280, 'fog').setScrollFactor(0.80);
        this.vie = this.add.sprite(370, 220, 'vie');
        this.vie.setScrollFactor(0);

        this.inventaire = this.add.sprite(850, 220, 'inventaire')
        this.inventaire.setScrollFactor(0);

        this.anims.create({
            key: 'attack_right',
            frames: this.anims.generateFrameNumbers('attack', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 1
        });
        this.anims.create({
            key: 'attack_up',
            frames: this.anims.generateFrameNumbers('attack', { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'attack_left',
            frames: this.anims.generateFrameNumbers('attack', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: 1
        });
        this.anims.create({
            key: 'attack_down',
            frames: this.anims.generateFrameNumbers('attack', { start: 18, end: 23 }),
            frameRate: 10,
            repeat: 1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 1
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
        this.anims.create({
            key: 'inv_empty',
            frames: this.anims.generateFrameNumbers('inventaire', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'inv_spear',
            frames: this.anims.generateFrameNumbers('inventaire', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'inv_jump',
            frames: this.anims.generateFrameNumbers('inventaire', { start: 2, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'inv_full',
            frames: this.anims.generateFrameNumbers('inventaire', { start: 3, end: 3 }),
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

        function passageScene2() {
            this.scene.start("scene2", { sceneQuitee: "scene1" , spearCollected: this.spearCollected, jumpCollected: this.jumpCollected, keyCollected: this.keyCollected, health: this.health});

        }

        function passageScene3() {
            this.scene.start("scene3", { sceneQuitee: "scene1", spearCollected: this.spearCollected, jumpCollected: this.jumpCollected, keyCollected: this.keyCollected, health: this.health });

        }

        function passageScene4() {
            this.scene.start("scene4", { sceneQuitee: "scene1", spearCollected: this.spearCollected, jumpCollected: this.jumpCollected, keyCollected: this.keyCollected, health: this.health });

        }

        function regenVie(player, regen) {
            regen.destroy();
            this.scene.scene.health += 1;
            if (this.scene.scene.health > 3) {
                this.scene.scene.health = 3;
            }
        }

        function ennemyCollider(player, ennemy) {
            if (this.scene.scene.isAttacking) {
                ennemy.destroy();
                var drop = Math.floor(Math.random() * 3);
                if (drop == 1) {
                    this.scene.scene.regen.create(ennemy.x, ennemy.y, 'regen');
                }

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
            const bridge = map.createLayer(
                "pont",
                tileset
            );
            this.player.depth = 2;
            bridge.depth = 1;
        }

        this.varTrou = function saut() {
            this.scene.scene.isJumping = true;
            this.physics.world.removeCollider(this.collider);
            if (this.scene.scene.keyJustDown == "right") {
                this.scene.scene.player.anims.play('turn');
                this.scene.scene.player.setAccelerationX(10000);
            }
            else {
                this.scene.scene.player.anims.play('turn');
                this.scene.scene.player.setAccelerationX(-10000);
            }

            setTimeout(() => {
                this.scene.scene.player.setAccelerationX(0);
                this.scene.scene.collider = this.physics.add.collider(this.scene.scene.player, trou, fall, null, this);
                this.scene.scene.isJumping = false;
            }, 800);

        }
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors2 = this.input.keyboard.addKeys('space, A');
        this.timer = 0;
        this.timer2 = 0;

    }





    update(time, delta) {

        if (this.gameOver) { return}

        this.timer2 += delta;
        if (this.timer2 > 2000){
            this.X_saved = this.player.x;
            this.Y_saved = this.player.y;
            this.timer2 = 0;
        }
        

        this.ennemies.children.each(function (ennemy) {

            this.scene.scene.timer += delta;

            if (this.scene.scene.timer > 0 && this.scene.scene.timer < 1000) {
                ennemy.setVelocityY(0)
                ennemy.setVelocityX(100);
                ennemy.anims.play('m_right', true);
            }

            else if (this.scene.scene.timer > 3000 && this.scene.scene.timer < 4500) {
                ennemy.setVelocityY(0)
                ennemy.setVelocityX(-100);
                ennemy.anims.play('m_left', true);
            }
            else if (this.scene.scene.timer > 1500 && this.scene.scene.timer < 3000) {
                ennemy.setVelocityX(0);
                ennemy.setVelocityY(-100);
                ennemy.anims.play('m_up', true);
            }
            else if (this.scene.scene.timer > 4500) {
                ennemy.setVelocityX(0);
                ennemy.setVelocityY(100);
                ennemy.anims.play('m_down', true);
                if (this.scene.scene.timer > 6000){
                    this.scene.scene.timer = 0;
                }
            }

        }, this);





        if (this.cursors2.space.isDown && this.jumpCollected) {
            if (!this.isJumping && !this.isMoving) {
                this.varTrou();
            }
        }


        if (this.health == 3) {
            this.vie.anims.play('pv3', true);
        }
        else if (this.health == 2) {
            this.vie.anims.play('pv2', true);
        }
        else if (this.health == 1) {
            this.vie.anims.play('pv1', true);
        }
        else {
            this.vie.anims.play('pv0', true);
            this.gameOver = true; //si les pvs sont à 0, game over
        }

        if (this.spearCollected && !this.jumpCollected) {
            this.inventaire.anims.play('inv_spear', true);
        }
        else if (this.jumpCollected && !this.keyCollected) {
            this.inventaire.anims.play('inv_jump', true);
        }
        else if (this.keyCollected) {
            this.inventaire.anims.play('inv_full', true);
        }
        else {
            this.inventaire.anims.play('inv_empty', true);
        }


        if (this.button1Activated && this.button2Activated && !this.bridgeAppeared) {
            this.physics.world.removeCollider(this.collider2);
            this.varBridge();
        }

        if (this.spearCollected && this.cursors2.A.isDown && this.keyJustDown == "down") {
            if (!this.isAttacking) {
                this.isAttacking = true;
                this.player.body.setSize(20, 40);
                this.player.body.setOffset(15, 30);
                this.player.anims.play('attack_down');
                setTimeout(() => {
                    this.player.body.setSize(20, 16);
                    this.player.body.setOffset(5, 45);
                    this.isAttacking = false;
                }, 500);
            }

        }

        if (this.spearCollected && this.cursors2.A.isDown && this.keyJustDown == "up") {
            if (!this.isAttacking) {
                this.isAttacking = true;
                this.player.body.setSize(20, 40);
                this.player.body.setOffset(15, 0);
                this.player.anims.play('attack_up', true);
                setTimeout(() => {
                    this.player.body.setSize(20, 16);
                    this.player.body.setOffset(5, 45);
                    this.isAttacking = false;
                }, 500);
            }
        }

        if (this.spearCollected && this.cursors2.A.isDown && this.keyJustDown == "right") {
            if (!this.isAttacking) {
                this.isAttacking = true;
                this.player.body.setSize(40, 20);
                this.player.body.setOffset(15, 25);
                this.player.anims.play('attack_right', true);
                setTimeout(() => {
                    this.player.body.setSize(20, 16);
                    this.player.body.setOffset(5, 45);
                    this.isAttacking = false;
                }, 500);
            }
        }

        if (this.spearCollected && this.cursors2.A.isDown && this.keyJustDown == "left") {
            if (!this.isAttacking) {
                this.isAttacking = true;
                this.player.body.setSize(40, 20);
                this.player.body.setOffset(0, 25);
                this.player.anims.play('attack_left', true);
                setTimeout(() => {
                    this.player.body.setSize(20, 16);
                    this.player.body.setOffset(5, 45);
                    this.isAttacking = false;
                }, 500);
            }
        }



if (!this.isFalling){
    if (this.cursors.left.isDown) {
        this.isMoving = true;
        this.player.setVelocityY(0);
        this.player.setVelocityX(-240);
        this.player.anims.play('left', true);
        this.keyJustDown = "left";
    }
    else if (this.cursors.right.isDown) {
        this.isMoving = true;
        this.player.setVelocityY(0);
        this.player.setVelocityX(240);
        this.player.anims.play('right', true);
        this.keyJustDown = "right";
    }
    else if (this.cursors.up.isDown) {
        this.isMoving = true;
        this.player.setVelocityY(-240);
        this.player.setVelocityX(0);
        this.player.anims.play('up', true);
        this.keyJustDown = "up";

    }
    else if (this.cursors.down.isDown) {
        this.isMoving = true;
        this.player.setVelocityY(240);
        this.player.setVelocityX(0);
        this.player.anims.play('down', true);
        this.keyJustDown = "down";

    }
    else if (!this.isAttacking) { // sinon
        this.isMoving = false;
        this.player.setVelocityX(0); //vitesse nulle
        this.player.setVelocityY(0);
        this.player.anims.play('turn'); //animation fait face caméra
    }
}




        // if (this.player.x >= 770){
        //     this.positionX = 30;
        //     this.positionY = this.player.y;
        //     this.scene.start("scene2", { positionX: this.positionX, positionY: this.positionY });
        // }


    }


};