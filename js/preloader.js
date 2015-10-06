var Spaceshooter = Spaceshooter || {};

Spaceshooter.Preloader = function (game) {
    this.logo = null;
    this.preloadBar = null;
    this.ready = false;
};

Spaceshooter.Preloader.prototype = {

    init: function () {

        // this.add.sprite(265, 400, 'logo');
        this.fontLoaded = false;

    },

    preload: function () {

        this.preloadBar = this.add.sprite(120, 260, 'preload');
        this.load.setPreloadSprite(this.preloadBar);
        this.load.image('ship', 'spaceshooter/PNG/ship.png');
        this.load.image('enemy1', 'spaceshooter/PNG/Enemies/enemy3.png');
        this.load.image('space', 'spaceshooter/backgrounds/darkpurple.png');
        this.load.audio('twotones', 'spaceshooter/bonus/sfx_twoTone.ogg');

        //  Load the Google WebFont Loader script
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },

    create: function () {
    },

    update: function () {

        //  Make sure all our mp3s have decoded before starting the game

        if (!this.ready)
        {
            if (this.cache.isSoundDecoded('twotones') &&
                this.game.fontLoaded)
            {
                this.ready = true;

                var context = {
                    score: 0,
                    level: 1,
                    lives: 3
                }
                this.state.start('MainMenu', true, false, context);
            }
        }

    }

};
