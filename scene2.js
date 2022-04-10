class scene2 extends Phaser.Scene {
    constructor() {
        super("scene2");

    }
    init(data) { this.sceneQuitee = data.sceneQuitee, this.spearCollected = data.spearCollected, this.jumpCollected = data.jumpCollected, this.keyCollected = data.keyCollected, this.health = data.health };
    preload() {

        this.load.image('fond', 'assets/fond.png');
        this.load.image('neurone_1', 'assets/neurone_1.png');
        this.load.image('neurone_2', 'assets/neurone_2.png');
        this.load.image('item_attack', 'assets/item_attaque.png');
        this.load.spritesheet('perso', 'assets/sprite_sheet_heros.png',
            { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('monstre', 'assets/creature_spritesheet.png',
            { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('vie', 'assets/vie_spritesheet.png',
            { frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet('vie', 'assets/vie_spritesheet.png',
            { frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet('attack', 'assets/attack_spritesheet.png',
            { frameWidth: 64, frameHeight: 64 });


        this.load.image("tileset", "assets/tileset.png");
        this.load.tilemapTiledJSON("map2", "map2.json");


    }



    create() {

        this.physics.world.setBounds(0, 0, 1600, 2560);

        function fall() {
            this.scene.scene.isFalling = true;
            this.scene.scene.player.setAlpha(0);
            this.scene.scene.health -= 1;
            setTimeout(() => {
                this.scene.scene.player.x = this.scene.scene.X_saved;
                this.scene.scene.player.y = this.scene.scene.Y_saved;
                this.scene.scene.player.setAlpha(1);
                this.scene.scene.isFalling = false;
            }, 1000);
        }
        this.add.tileSprite(800, 1280, 1600, 2560, 'fond');
        this.add.tileSprite(800, 1280, 1600, 2560, 'neurone_1').setScrollFactor(0.80);
        this.add.tileSprite(800, 1280, 1600, 2560, 'neurone_2').setScrollFactor(0.90);

        this.keyJustDown = "down";
        this.isAttacking = false;
        this.isJumping = false;
        this.invulnerable = false;
        this.isFalling = false;

        const map2 = this.add.tilemap("map2");

        const tileset = map2.addTilesetImage(
            "tileset", "tileset"
        );

        const plateformes = map2.createLayer(
            "plateformes",
            tileset
        );

        plateformes.setCollisionByProperty({ estSolide: true });

        const sillons = map2.createLayer(
            "sillons",
            tileset
        );

        sillons.setCollisionByProperty({ estSolide: true });

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

        this.regen = this.physics.add.group()

        this.ennemies = this.physics.add.group();

        //création de l'item "lance"
        this.attaque = this.physics.add.group()
        map2.getObjectLayer('attaque').objects.forEach((attaque) => {

            const spear = this.attaque.create(attaque.x, attaque.y, 'item_attack').setOrigin(0);
            spear.setScale(2);
        })


        map2.getObjectLayer('monstres').objects.forEach((enemy) => {


            const enemySprite = this.ennemies.create(enemy.x, enemy.y, 'monstre').setOrigin(0);
            enemySprite.setPushable(false);


        })



        if (this.sceneQuitee == "scene1") {
            this.player = this.physics.add.sprite(670, 2320, 'perso');
        }
        else if (this.sceneQuitee == "scene3") {
            this.player = this.physics.add.sprite(1400, 1000, 'perso');
        }

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.player.body.setSize(20, 16);
        this.player.body.setOffset(5, 45);

        this.cameras.main.setBounds(0, 0, 1600, 2560);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2)

        this.physics.add.collider(this.player, plateformes);
        this.physics.add.collider(this.player, sillons);
        this.physics.add.collider(this.player, portail1, passageScene1, null, this);
        this.physics.add.collider(this.player, portail2, passageScene3, null, this);
        this.physics.add.collider(this.player, this.ennemies, ennemyCollider, null, this);
        this.physics.add.collider(this.player, this.regen, regenVie, null, this);
        this.physics.add.collider(this.player, this.attaque, itemAttaque, null, this);

        this.vie = this.add.sprite(370, 220, 'vie');
        this.vie.setScrollFactor(0);

        this.inventaire = this.add.sprite(850, 220, 'inventaire');
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

        function passageScene1() {
            this.scene.start("scene1", { sceneQuitee: "scene2", spearCollected: this.spearCollected, jumpCollected: this.jumpCollected, keyCollected: this.keyCollected, health: this.health });

        }


        function passageScene3() {
            this.scene.start("scene3", { sceneQuitee: "scene2", spearCollected: this.spearCollected, jumpCollected: this.jumpCollected, keyCollected: this.keyCollected, health: this.health });

        }

        function regenVie(player, regen) {
            regen.destroy();
            this.scene.scene.health += 1;
            if (this.scene.scene.health > 3) {
                this.scene.scene.health = 3;
            }
        }

        //fonction appelée quand on récupère l'item d'attaque
        function itemAttaque(player, item) {
            item.destroy(); //l'item est détruit
            this.scene.scene.spearCollected = true; //la variable qui indique que l'on possède l'item passe à true
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
        if (this.gameOver) { return; }

        this.timer2 += delta;
        if (this.timer2 > 2000) {
            this.X_saved = this.player.x;
            this.Y_saved = this.player.y;
            this.timer2 = 0;
        }

        this.ennemies.children.each(function (ennemy) {

            this.scene.scene.timer += delta;

            if (this.scene.scene.timer > 0 && this.scene.scene.timer < 3000) {
                ennemy.setVelocityY(0)
                ennemy.setVelocityX(100);
                ennemy.anims.play('m_right', true);
            }

            else if (this.scene.scene.timer > 6000 && this.scene.scene.timer < 9000) {
                ennemy.setVelocityY(0)
                ennemy.setVelocityX(-100);
                ennemy.anims.play('m_left', true);
            }
            else if (this.scene.scene.timer > 3000 && this.scene.scene.timer < 6000) {
                ennemy.setVelocityX(0);
                ennemy.setVelocityY(-100);
                ennemy.anims.play('m_up', true);
            }
            else if (this.scene.scene.timer > 9000) {
                ennemy.setVelocityX(0);
                ennemy.setVelocityY(100);
                ennemy.anims.play('m_down', true);
                if (this.scene.scene.timer > 12000) {
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



        //les contrôles sont inversés
        if (!this.isFalling) {
            if (this.cursors.left.isDown) {
                this.isMoving = true;
                this.player.setVelocityY(0);
                this.player.setVelocityX(240);
                this.player.anims.play('left', true);
                this.keyJustDown = "right";
            }
            else if (this.cursors.right.isDown) {
                this.isMoving = true;
                this.player.setVelocityY(0);
                this.player.setVelocityX(-240);
                this.player.anims.play('right', true);
                this.keyJustDown = "left";
            }
            else if (this.cursors.up.isDown) {
                this.isMoving = true;
                this.player.setVelocityY(240);
                this.player.setVelocityX(0);
                this.player.anims.play('up', true);
                this.keyJustDown = "down";

            }
            else if (this.cursors.down.isDown) {
                this.isMoving = true;
                this.player.setVelocityY(-240);
                this.player.setVelocityX(0);
                this.player.anims.play('down', true);
                this.keyJustDown = "up";

            }
            else if (!this.isAttacking) { // sinon
                this.isMoving = false;
                this.player.setVelocityX(0); //vitesse nulle
                this.player.setVelocityY(0);
                this.player.anims.play('turn'); //animation fait face caméra
            }

        }

    }


};