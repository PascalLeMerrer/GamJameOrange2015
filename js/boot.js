var Spaceshooter = Spaceshooter || {};

Spaceshooter.Boot = function (game) {
};

Spaceshooter.Boot.prototype = {

    preload: function () {

        this.load.image('preload', 'assets/preload.png');

    },

    create: function () {
        this.state.start('Preloader');
    }

};
