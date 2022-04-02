var config = {
    type: Phaser.CANVAS,
    width: 1280, height: 720,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y : 0},
            debug: true
            
        }
    },

    scene: [menu, test_mecaniques, scene3, scene2]
};
new Phaser.Game(config);