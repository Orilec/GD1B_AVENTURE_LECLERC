class menu extends Phaser.Scene {
    constructor() {
        super("menu");
        
    }

    preload(){
        this.load.image('menu', 'assets/menu.png')
        this.load.image('play', 'assets/play_button.png')
    }

    create(){
        this.add.image(640, 360, 'menu');
        var playButton =  this.add.image(640, 360, 'play').setInteractive() ;

        playButton.on('pointerdown', function(pointer){
            this.scene.scene.start("scene1");

        });
    }
};
