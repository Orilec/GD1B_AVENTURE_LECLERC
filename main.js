var config = {
    type: Phaser.CANVAS,
    width: 600, height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y : 0},
            debug: false
        }
    },

    scene: [menu, scene1, scene2]
};
new Phaser.Game(config);