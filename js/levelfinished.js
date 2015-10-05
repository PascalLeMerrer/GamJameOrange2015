var Spaceshooter = Spaceshooter || {};

Spaceshooter.LevelFinished = function () {
    this.endText = null;
    this.instructions = null;
    this.context = null;
    this.sky = null;
};

Spaceshooter.LevelFinished.prototype = {

    init: function(context) {
        this.context = context;
    },

    preload: function () {
    },

    create: function () {

        this.sky = this.add.tileSprite(0, 0, 640, 480, 'clouds');

        this.endText = this.createText(this.camera.view.width / 2,
                                       this.camera.view.height / 2,
                                       60);

        this.instructions = this.createText(this.camera.view.width / 2,
                                            this.camera.view.height * 0.75,
                                            45);

        if (this.context.isGameOver)
        {
            this.endText.setText("Game Over\nFinal score: " + this.context.score);
            this.instructions.setText("Press Enter to restart");
        }
        else if (this.context.isGameFinished)
        {
            this.endText.setText("The End\nFinal score: " + this.context.score);
            this.instructions.setText("Press Enter to restart");
        }
        else
        {
            this.endText.setText("Level " + this.context.level + "\nscore: " + this.context.score);
            this.instructions.setText("Press Enter to start");
        }

    },

    createText: function (x, y, fontSize) {
        var style = { fill: "#ffffff", align: "center" };
        var text = this.add.text(x, y, '', style);
        text.font = "Roboto Slab";
        text.fontSize = fontSize;
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;
        text.align = 'center';
        text.fixedToCamera = true;
        return text;
    },

    update: function () {
        if (this.input.keyboard.isDown(Phaser.Keyboard.ENTER))
        {
            if(this.context.isGameOver) {
                this.context.score = 0;
                this.context.level = 1;
                this.context.isGameOver = false;
                this.state.start('Game', true, false, this.context);
            }
            else
            {
                this.state.start('Game', true, false, this.context);
            }
        }
    }
};
