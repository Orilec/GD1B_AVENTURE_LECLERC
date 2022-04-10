class scene4 extends Phaser.Scene {
    constructor() {
        super("scene4");

    }
    init(data) { this.sceneQuitee = data.sceneQuitee, this.spearCollected = data.spearCollected, this.jumpCollected = data.jumpCollected, this.keyCollected = data.keyCollected, this.health = data.health };
    preload() {

        this.load.image('fond', 'assets/fond.png');
        this.load.image('neurone_1', 'assets/neurone_1.png');
        this.load.image('neurone_2', 'assets/neurone_2.png');
        this.load.image('item_clef', 'assets/item_clef.png');
        this.load.image('vision', 'assets/vision.png');
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
        this.load.tilemapTiledJSON("map4", "map4.json");


    }



    create() {

        this.physics.world.setBounds(0, 0, 1280, 1280);

        function fall() {
            this.scene.scene.isFalling = true;
            this.scene.scene.player.setAlpha(0);
            this.scene.scene.health -= 1;
            if (this.scene.scene.health < 1) {
                this.scene.scene.gameover = true;
            }
            setTimeout(() => {
                this.scene.scene.player.x = this.scene.scene.X_saved;
                this.scene.scene.player.y = this.scene.scene.Y_saved;
                this.scene.scene.player.setAlpha(1);
                this.scene.scene.isFalling = false;
            }, 1000);
        }

        this.add.tileSprite(1120, 800, 2240, 1600, 'fond');
        this.add.tileSprite(1120, 800, 2240, 1600, 'neurone_1').setScrollFactor(0.80);
        this.add.tileSprite(1120, 800, 2240, 1600, 'neurone_2').setScrollFactor(0.90);

        this.keyJustDown = "down";
        this.isAttacking = false;
        this.isJumping = false;
        this.isFalling = false;
        this.invulnerable = false;
        this.end = false;


        const map4 = this.add.tilemap("map4");

        const tileset = map4.addTilesetImage(
            "tileset", "tileset"
        );

        const plateformes = map4.createLayer(
            "plateformes",
            tileset
        );

        plateformes.setCollisionByProperty({ estSolide: true });

        //création de la barrière
        const barriere = map4.createLayer(
            "barriere",
            tileset
        );

        barriere.setCollisionByProperty({ estSolide: true });

        const portail4 = map4.createLayer(
            "portail4",
            tileset
        );
        portail4.setCollisionByProperty({ portail4: true });

        const trou = map4.createLayer(
            "trou",
            tileset

        )

        trou.setCollisionByProperty({ trou: true });

        //création de la porte
        const porte = map4.createLayer(
            "porte",
            tileset

        )

        porte.setCollisionByProperty({ porte: true });

        //création du téléporteur de fin
        const fin = map4.createLayer(
            "fin",
            tileset

        )

        fin.setCollisionByProperty({ fin: true });

        this.regen = this.physics.add.group();

        this.ennemies = this.physics.add.group();

        map4.getObjectLayer('monstres').objects.forEach((enemy) => {


            const enemySprite = this.ennemies.create(enemy.x, enemy.y, 'monstre').setOrigin(0);
            enemySprite.setPushable(false);


        });

        //création de l'item clé
        this.key = this.physics.add.group()
        map4.getObjectLayer('key').objects.forEach((key) => {

            const keySprite = this.key.create(key.x, key.y, 'item_clef').setOrigin(0);
            keySprite.setScale(2);
        });

        this.player = this.physics.add.sprite(700, 1100, 'perso');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.player.body.setSize(20, 16);
        this.player.body.setOffset(5, 45);

        this.cameras.main.setBounds(0, 0, 2000, 1280);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2)

        this.physics.add.collider(this.player, plateformes);
        this.physics.add.collider(this.player, barriere);
        this.physics.add.collider(this.player, portail4, passageScene1, null, this);
        this.collider = this.physics.add.collider(this.player, trou, fall, null, this);
        this.physics.add.collider(this.player, this.ennemies, ennemyCollider, null, this);
        this.physics.add.collider(this.player, this.regen, regenVie, null, this);
        this.physics.add.collider(this.player, this.key, itemClef, null, this);
        this.physics.add.collider(this.player, fin, finNiveau, null, this);
        this.colliderPorte = this.physics.add.collider(this.player, porte, passagePorte, null, this);

        //ajout de la vision rétrécie
        this.add.tileSprite(640, 360, 700, 1100, 'vision').setScrollFactor(0);


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
            this.scene.start("scene1", { sceneQuitee: "scene4", spearCollected: this.spearCollected, jumpCollected: this.jumpCollected, keyCollected: this.keyCollected, health: this.health });
            // , { positionX: this.positionX, positionY: this.positionY });
        }

        function regenVie(player, regen) {
            regen.destroy();
            this.scene.scene.health += 1;
            if (this.scene.scene.health > 3) {
                this.scene.scene.health = 3;
            }
        }

        //même principe que la récupération des items précédents
        function itemClef(player, clef) {
            clef.destroy();
            this.scene.scene.keyCollected = true;
        }

        function passagePorte(player) {
            if (this.scene.scene.keyCollected) { //si on a la clé
                this.physics.world.removeCollider(this.scene.scene.colliderPorte); //le collider avec la porte est détruit et on peut passer
            }
        }


        function finNiveau(player) {
            this.scene.stop(); //arrêt de la scene: fin du niveau
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
                ennemy.setVelocityX(190);
                ennemy.anims.play('m_right', true);
            }

            else if (this.scene.scene.timer > 6000 && this.scene.scene.timer < 9000) {
                ennemy.setVelocityY(0)
                ennemy.setVelocityX(-190);
                ennemy.anims.play('m_left', true);
            }
            else if (this.scene.scene.timer > 3000 && this.scene.scene.timer < 6000) {
                ennemy.setVelocityX(0);
                ennemy.setVelocityY(-190);
                ennemy.anims.play('m_up', true);
            }
            else if (this.scene.scene.timer > 9000) {
                ennemy.setVelocityX(0);
                ennemy.setVelocityY(190);
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




        if (!this.isFalling) {
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


    }


};