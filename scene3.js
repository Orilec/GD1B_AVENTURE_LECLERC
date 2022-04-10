class scene3 extends Phaser.Scene {
    constructor() {
        super("scene3");

    }
    init(data) { this.sceneQuitee = data.sceneQuitee, this.spearCollected = data.spearCollected, this.jumpCollected = data.jumpCollected, this.keyCollected = data.keyCollected, this.health = data.health };
    preload() {

        this.load.image('button_unactivated', 'assets/neuron_unactivated.png');
        this.load.image('button_activated', 'assets/neuron_activated.png');
        this.load.image('fond', 'assets/fond.png');
        this.load.image('neurone_1', 'assets/neurone_1.png');
        this.load.image('neurone_2', 'assets/neurone_2.png');
        this.load.image('saut', 'assets/item_saut.png');
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
        this.load.tilemapTiledJSON("map3", "map3.json");


    }



    create() {

        this.physics.world.setBounds(0, 0, 2240, 1600);


        this.add.tileSprite(1120, 800, 2240, 1600, 'fond');
        this.add.tileSprite(1120, 800, 2240, 1600, 'neurone_1').setScrollFactor(0.80);
        this.add.tileSprite(1120, 800, 2240, 1600, 'neurone_2').setScrollFactor(0.90);

        //nouvelles variables servant à l'énigme d'activation du pont
        this.button1Activated = false;
        this.button2Activated = false;
        this.button3Activated = false;
        this.bridgeAppeared = false;

        this.keyJustDown = "down";
        this.isAttacking = false;
        this.isJumping = false;
        this.invulnerable = false;
        this.isFalling = false;

        const map3 = this.add.tilemap("map3");

        const tileset = map3.addTilesetImage(
            "tileset", "tileset"
        );

        const plateformes = map3.createLayer(
            "plateformes",
            tileset
        );

        plateformes.setCollisionByProperty({ estSolide: true });

        const portail2 = map3.createLayer(
            "portail2",
            tileset
        );
        portail2.setCollisionByProperty({ portail2: true });

        const portail3 = map3.createLayer(
            "portail3",
            tileset
        );
        portail3.setCollisionByProperty({ portail3: true });

        const trou = map3.createLayer(
            "trou",
            tileset

        );
        trou.setCollisionByProperty({ trou: true });

        const trou2 = map3.createLayer(
            "trou2",
            tileset

        );
        trou2.setCollisionByProperty({ trou2: true });

        const sillons = map3.createLayer(
            "sillons",
            tileset
        );
        sillons.setCollisionByProperty({ estSolide: true });

        this.regen = this.physics.add.group()

        this.ennemies = this.physics.add.group();

        map3.getObjectLayer('monstres').objects.forEach((enemy) => {


            const enemySprite = this.ennemies.create(enemy.x, enemy.y, 'monstre').setOrigin(0);
            enemySprite.setPushable(false);


        })

        //création des neurones à connecter
        this.plaque_1 = this.physics.add.group();
        map3.getObjectLayer('plaque_1').objects.forEach((plaque) => {


            const plaqueSprite = this.plaque_1.create(plaque.x, plaque.y, 'button_unactivated').setOrigin(0);
            plaqueSprite.setPushable(false);


        })
        this.plaque_2 = this.physics.add.group();
        map3.getObjectLayer('plaque_2').objects.forEach((plaque) => {


            const plaqueSprite = this.plaque_2.create(plaque.x, plaque.y, 'button_unactivated').setOrigin(0);
            plaqueSprite.setPushable(false);


        })
        this.plaque_3 = this.physics.add.group();
        map3.getObjectLayer('plaque_3').objects.forEach((plaque) => {


            const plaqueSprite = this.plaque_3.create(plaque.x, plaque.y, 'button_unactivated').setOrigin(0);
            plaqueSprite.setPushable(false);

        })

        //création de l'item de saut
        this.saut = this.physics.add.group();
        map3.getObjectLayer('saut').objects.forEach((saut) => {


            const sautSprite = this.saut.create(saut.x, saut.y, 'saut').setOrigin(0);
            sautSprite.setScale(2);



        })


        if (this.sceneQuitee == "scene2") {
            this.player = this.physics.add.sprite(370, 450, 'perso');
        }
        else {
            this.player = this.physics.add.sprite(1200, 1500, 'perso');
        }

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.player.body.setSize(20, 16);
        this.player.body.setOffset(5, 45);

        this.cameras.main.setBounds(0, 0, 2240, 1600);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2)


        this.physics.add.collider(this.player, plateformes);
        this.physics.add.collider(this.player, sillons);

        //nouveaux collider pour les neurones
        this.physics.add.collider(this.player, this.plaque_1, activate1, null, this);
        this.physics.add.collider(this.player, this.plaque_2, activate2, null, this);
        this.physics.add.collider(this.player, this.plaque_3, activate3, null, this);

        this.physics.add.collider(this.player, portail2, passageScene2, null, this);
        this.physics.add.collider(this.player, portail3, passageScene1, null, this);
        this.collider = this.physics.add.collider(this.player, trou, fall, null, this);

        //nouveau collider de trou qui se trouve sous le pont, pour pouvoir le désactiver quand le pont apparaît
        this.collider2 = this.physics.add.collider(this.player, trou2, fall, null, this);

        this.physics.add.collider(this.player, this.ennemies, ennemyCollider, null, this);
        this.physics.add.collider(this.player, this.regen, regenVie, null, this);
        this.physics.add.collider(this.player, this.saut, itemSaut, null, this);

        this.physics.add.collider(this.player, this.monstre, ennemyCollider, null, this);

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

        //fonctions appelées quand on active les neurones
        function activate1(player, button) {
            button.setTexture('button_activated') //changement d'asset
            this.scene.scene.button1Activated = true; //mise à jour de la variable
        }
        function activate2(player, button) {
            button.setTexture('button_activated')
            this.scene.scene.button2Activated = true;
        }
        function activate3(player, button) {
            button.setTexture('button_activated')
            this.scene.scene.button3Activated = true;
        }


        function passageScene1() {
            this.scene.start("scene1", { sceneQuitee: "scene3", spearCollected: this.spearCollected, jumpCollected: this.jumpCollected, keyCollected: this.keyCollected, health: this.health });
            // , { positionX: this.positionX, positionY: this.positionY });
        }
        // { positionX: 1550, positionY: 350, first: false}

        function passageScene2() {
            this.scene.start("scene2", { sceneQuitee: "scene3", spearCollected: this.spearCollected, jumpCollected: this.jumpCollected, keyCollected: this.keyCollected, health: this.health });
            // , { positionX: this.positionX, positionY: this.positionY });
        }

        function regenVie(player, regen) {
            regen.destroy();
            this.scene.scene.health += 1;
            if (this.scene.scene.health > 3) {
                this.scene.scene.health = 3;
            }
        }

        //même principe que la fonction de récupération de l'item d'attaque
        function itemSaut(player, item) {
            item.destroy();
            this.scene.scene.jumpCollected = true;
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

        //fonction servant à faire apparaître le pont
        this.varBridge = function bridgeActivation() {
            this.scene.scene.bridgeAppeared = true;
            const bridge = map3.createLayer( //création du layer pont via tiled
                "pont",
                tileset
            );
            this.player.depth = 2; //permet que le joueur reste au dessus du pont
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
                ennemy.setVelocityX(180);
                ennemy.anims.play('m_right', true);
            }

            else if (this.scene.scene.timer > 6000 && this.scene.scene.timer < 9000) {
                ennemy.setVelocityY(0)
                ennemy.setVelocityX(-180);
                ennemy.anims.play('m_left', true);
            }
            else if (this.scene.scene.timer > 3000 && this.scene.scene.timer < 6000) {
                ennemy.setVelocityX(0);
                ennemy.setVelocityY(-180);
                ennemy.anims.play('m_up', true);
            }
            else if (this.scene.scene.timer > 9000) {
                ennemy.setVelocityX(0);
                ennemy.setVelocityY(180);
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

        //si tous les neurones sont connectés
        if (this.button1Activated && this.button2Activated && this.button3Activated && !this.bridgeAppeared) {
            this.physics.world.removeCollider(this.collider2); //on désactive le collider du trou qui se trouve sous le pont
            this.varBridge(); // et on crée le pont
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