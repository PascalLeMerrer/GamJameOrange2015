var Spaceshooter = Spaceshooter || {};

Spaceshooter.Boot = function (game) {
};

Spaceshooter.Boot.prototype = {

    preload: function () {

        this.load.image('preload', 'assets/preload.png');
        this.load.audio('death', 'assets/death.mp3')
        this.load.audio('mydeath', 'assets/coin2.mp3')
        this.load.audio('touched', 'assets/casing.mp3')
    },

    create: function () {
        this.state.start('Preloader');
    }

};
