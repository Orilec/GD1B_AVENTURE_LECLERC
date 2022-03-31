class menu extends Phaser.Scene {
    constructor() {
        super("menu");
        
    }

    preload(){
        this.load.image('sky', 'assets/sky.png')
        this.load.image('play', 'assets/play.png')
    }

    create(){
        this.add.image(300, 200, 'sky');
        var playButton =  this.add.image(300, 200, 'play').setInteractive() ;

        playButton.on('pointerdown', function(pointer){
            this.scene.scene.start("test_mecaniques");

        });
    }
};
