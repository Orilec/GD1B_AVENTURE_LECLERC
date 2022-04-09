var config = {
    type: Phaser.CANVAS,
    width: 1280, height: 720,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y : 0},
            debug: false
            
        }
    },

    scene: [menu, scene1, scene3, scene2, scene4]
};
new Phaser.Game(config);