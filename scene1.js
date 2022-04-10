class scene1 extends Phaser.Scene {
    constructor() {
        super("scene1");
        //constructeur de la scene

    }

    //on récupère les variables passées d'une scene à l'autre
    init(data) { this.sceneQuitee = data.sceneQuitee, this.spearCollected = data.spearCollected, this.jumpCollected = data.jumpCollected, this.keyCollected = data.keyCollected, this.health = data.health };

    preload() {

        //load des assets utilisés
        this.load.image('map', 'assets/map_test_02.png');
        this.load.image('fond', 'assets/fond.png');
        this.load.image('neurone_1', 'assets/neurone_1.png');
        this.load.image('neurone_2', 'assets/neurone_2.png');
        this.load.image('fog', 'assets/brouillard.png');
        this.load.image('regen', 'assets/serotonin.png');

        //load des spritesheets
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

        //load de la map tiled
        this.load.image("tileset", "assets/tileset.png");
        this.load.tilemapTiledJSON("map", "map.json");


    }



    create() {

        //limites du monde
        this.physics.world.setBounds(0, 0, 3200, 1280);

        //fonction appelée quand on tombe dans un trou
        function fall() {
            this.scene.scene.isFalling = true;
            this.scene.scene.player.setAlpha(0); //le joueur "disparaît"
            this.scene.scene.health -= 1; //on perds un point de vie

            setTimeout(() => { //au bout d'une seconde
                this.scene.scene.player.x = this.scene.scene.X_saved; //le joueur est placé aux coordonées enregistrées
                this.scene.scene.player.y = this.scene.scene.Y_saved;
                this.scene.scene.player.setAlpha(1); //le joueur réapparait
                this.scene.scene.isFalling = false;
            }, 1000);
        }

        //création du background en différents layers
        this.add.tileSprite(1600, 640, 3200, 1280, 'fond');
        this.add.tileSprite(1600, 640, 3200, 1280, 'neurone_1').setScrollFactor(0.80); //les scroll factors différents donnent l'effet parallaxe
        this.add.tileSprite(1600, 640, 3200, 1280, 'neurone_2').setScrollFactor(0.90);

        //déclaration des variables 
        this.keyJustDown = "down";
        this.isAttacking = false;
        this.isJumping = false;
        this.invulnerable = false;
        this.isFalling = false;

        //si c'est le joueur n'a visité aucune autre scene avant, initialisation des variables
        if (this.sceneQuitee != "scene2" && this.sceneQuitee != "scene3" && this.sceneQuitee != "scene4") {
            this.health = 3;
            this.spearCollected = false;
            this.jumpCollected = false;
            this.keyCollected = false;
        }

        //création des différents layers de la map via tiled
        const map = this.add.tilemap("map");

        const tileset = map.addTilesetImage(
            "tileset", "tileset"
        );

        const plateformes = map.createLayer(
            "Calque de Tuiles 1",
            tileset
        );

        plateformes.depth = 0;
        plateformes.setCollisionByProperty({ estSolide: true }); //permet de déterminer quelles tiles entrent en collision avec le joueur

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
        trou.setCollisionByProperty({ trou: true });

        //création du groupe pour les items de regen
        this.regen = this.physics.add.group()

        //création des ennemis en fonction de leur position sur le layer object de tiled
        this.ennemies = this.physics.add.group();
        map.getObjectLayer('monstres').objects.forEach((enemy) => {
            const enemySprite = this.ennemies.create(enemy.x, enemy.y, 'monstre').setOrigin(0);
            enemySprite.setPushable(false); //permet que les ennemis ne bougent pas lors d'une collision avec le joueur
        })

        //création du joueur à différentes coordonées selon la scene qu'il vient de quitter
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

        //on redimensionne la hitbox du joueur au niveau de ses pieds
        this.player.body.setSize(20, 16);
        this.player.body.setOffset(5, 45);


        //création de la caméra, qui suit le joueur 
        this.cameras.main.setBounds(0, 0, 3200, 1280);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2)

        //création de tous les colliders
        this.physics.add.collider(this.player, plateformes);
        this.physics.add.collider(this.player, portail1, passageScene2, null, this);
        this.physics.add.collider(this.player, portail3, passageScene3, null, this);
        this.physics.add.collider(this.player, portail4, passageScene4, null, this);
        this.collider = this.physics.add.collider(this.player, trou, fall, null, this);
        this.physics.add.collider(this.player, this.regen, regenVie, null, this);
        this.physics.add.collider(this.player, this.ennemies, ennemyCollider, null, this);

        //ajout du brouillard
        this.add.tileSprite(1600, 640, 3200, 1280, 'fog').setScrollFactor(0.80);

        //création de la jauge de santé mentale et de l'inventaire
        this.vie = this.add.sprite(370, 220, 'vie');
        this.vie.setScrollFactor(0);//le scroll factor 0 fait qu'elle reste constamment à l'écran

        this.inventaire = this.add.sprite(850, 220, 'inventaire')
        this.inventaire.setScrollFactor(0);


        //création de toute les animations
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

        //fonctions de passage entre scenes
        function passageScene2() {
            this.scene.start("scene2", { sceneQuitee: "scene1", spearCollected: this.spearCollected, jumpCollected: this.jumpCollected, keyCollected: this.keyCollected, health: this.health });
            //on "envoie" les variables pour les récupérer dans la scene suivante
        }

        function passageScene3() {
            this.scene.start("scene3", { sceneQuitee: "scene1", spearCollected: this.spearCollected, jumpCollected: this.jumpCollected, keyCollected: this.keyCollected, health: this.health });

        }

        function passageScene4() {
            this.scene.start("scene4", { sceneQuitee: "scene1", spearCollected: this.spearCollected, jumpCollected: this.jumpCollected, keyCollected: this.keyCollected, health: this.health });

        }


        //fonction appelée quand on récupère un item de regen
        function regenVie(player, regen) {
            regen.destroy();
            this.scene.scene.health += 1; //on récupère un point de vie
            if (this.scene.scene.health > 3) {
                this.scene.scene.health = 3; //empêche le joueur d'avoir plus de 3 points de vie
            }
        }


        //fonction appelée lors de la collision avec un ennemi
        function ennemyCollider(player, ennemy) {
            if (this.scene.scene.isAttacking) { //si on est en train d'attaquer
                ennemy.destroy(); //l'ennemi meurt
                var drop = Math.floor(Math.random() * 3); //random pour savoir si l'ennemi drop de la regen
                if (drop == 1) {
                    this.scene.scene.regen.create(ennemy.x, ennemy.y, 'regen'); //création de la regen aux coordonées de l'ennemi
                }

            }
            else { //sinon
                if (!this.scene.scene.invulnerable) {
                    this.scene.scene.invulnerable = true;
                    this.scene.scene.health -= 1; //on prend un dégat
                    setTimeout(() => { //1s d'invulnérabilité
                        this.scene.scene.invulnerable = false;
                    }, 1000);
                }
            }


        }

        //fonction de saut, mise dans une varibale pour pouvoir l'appeler dans le update
        this.varTrou = function saut() {
            this.scene.scene.isJumping = true;
            this.physics.world.removeCollider(this.collider); //on enlève temporairement le collider avec les trous
            if (this.scene.scene.keyJustDown == "right") { //selon la dernière direction dans laquelle on est allé, on saute
                this.scene.scene.player.anims.play('turn');
                this.scene.scene.player.setAccelerationX(10000);
            }
            else {
                this.scene.scene.player.anims.play('turn');
                this.scene.scene.player.setAccelerationX(-10000);
            }

            setTimeout(() => { //aubout de 800ms
                this.scene.scene.player.setAccelerationX(0); //le saut s'arrête
                this.scene.scene.collider = this.physics.add.collider(this.scene.scene.player, trou, fall, null, this); //on recrée le collider avec les trous
                this.scene.scene.isJumping = false;
            }, 800);

        }

        //création des touches pour le contrôle clavier
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors2 = this.input.keyboard.addKeys('space, A');

        //création des timers utilisés dans le update
        this.timer = 0;
        this.timer2 = 0;

    }





    update(time, delta) {

        //si gameover, le jeu s'arrête
        if (this.gameOver) { return }

        this.timer2 += delta;
        if (this.timer2 > 2000) { //toutes les 2s
            this.X_saved = this.player.x; //on enregistre les coordonées du joueur, pour le faire réaparaitre en cas de chute
            this.Y_saved = this.player.y;
            this.timer2 = 0;
        }

        //pattern de déplacement des ennemis
        this.ennemies.children.each(function (ennemy) {

            this.scene.scene.timer += delta;

            if (this.scene.scene.timer > 0 && this.scene.scene.timer < 1500) {
                ennemy.setVelocityY(0)
                ennemy.setVelocityX(180);
                ennemy.anims.play('m_right', true);
            }

            else if (this.scene.scene.timer > 3000 && this.scene.scene.timer < 4500) {
                ennemy.setVelocityY(0)
                ennemy.setVelocityX(-180);
                ennemy.anims.play('m_left', true);
            }
            else if (this.scene.scene.timer > 1500 && this.scene.scene.timer < 3000) {
                ennemy.setVelocityX(0);
                ennemy.setVelocityY(-180);
                ennemy.anims.play('m_up', true);
            }
            else if (this.scene.scene.timer > 4500) {
                ennemy.setVelocityX(0);
                ennemy.setVelocityY(180);
                ennemy.anims.play('m_down', true);
                if (this.scene.scene.timer > 6000) {
                    this.scene.scene.timer = 0;
                }
            }

        }, this);


        //si on appuie sur espace et qu'on a l'item permettant le saut
        if (this.cursors2.space.isDown && this.jumpCollected) {
            if (!this.isJumping && !this.isMoving) { //et si on est ni déjà en train de sauter ou en train de bouger
                this.varTrou();// on appelle la fonction de saut
            }
        }

        //actualisation de la jauge de vie en fonction des pv que l'on a
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


        //actualisation de l'inventaire en fonction des objets récupérés
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

        //fonctions d'attaque
        //si l'on appuie sur A et que l'on a obtenu la lance, on attaque dans la direction utilisée la dernière fois
        if (this.spearCollected && this.cursors2.A.isDown && this.keyJustDown == "down") {
            if (!this.isAttacking) {
                this.isAttacking = true;
                this.player.body.setSize(20, 40); //on change la hitbox du perso pour s'adapter à l'attaque
                this.player.body.setOffset(15, 30);
                this.player.anims.play('attack_down');
                setTimeout(() => {
                    this.player.body.setSize(20, 16); //puis on remet la hitbox normal quand l'attaque est finie
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


        //mouvements du joueur
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