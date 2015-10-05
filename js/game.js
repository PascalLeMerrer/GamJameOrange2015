var Spaceshooter = Spaceshooter || {};

Spaceshooter.Game = function () {

    this.ship = null;
    this.background = null;

    this.context = null;
    this.levelText = null;
    this.scoreText = null;
};

Spaceshooter.Game.prototype = {

    init: function (context) {

        this.context = context;

        this.game.renderer.renderSession.roundPixels = true;
    },

    create: function () {
        this.sound.play("twotones");
        this.background = this.add.tileSprite(0, 0, 640, 480, 'space');

        this.ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ship');
        this.ship.anchor.x = 0.5;
        this.ship.anchor.y = 0.5;
        this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
        this.ship.body.allowRotation = true;

        this.enemies = this.game.add.group();
        for (var i = 0; i < 10; i++) {
            var bullet = this.enemies.create(game.rnd.integerInRange(0, 640), game.rnd.integerInRange(0, 480), 'enemy1');
            this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
            bullet.body.allowRotation = true;
            bullet.anchor.x = 0.5;
            bullet.anchor.y = 0.5;
        }

        var style = { fill: "#ffffff", align: "center", fontSize: 32 };

        this.scoreText = this.createText(20, 20, this.context.score || '000', style);
        this.levelText = this.createText(520, 20, "level " + (this.context.level || '1'), style);

    },

    createText: function(x, y, text, style, size)
    {
        var textObject = this.add.text(x, y, text, style);
        textObject.font = "Roboto Slab";
        textObject.fixedToCamera = true;
        return textObject;
    },

    update: function () {

        this.enemies.forEachAlive(this.moveEnemy, this);  //make enemies accelerate to ship

        //  if it's overlapping the mouse, don't move any more
        if (Phaser.Rectangle.contains(this.ship.body, this.game.input.x, this.game.input.y))
        {
            this.ship.body.velocity.setTo(0, 0);
        } else {
          this.game.physics.arcade.moveToPointer(this.ship, 400);
        }
    },

    moveEnemy: function(bullet) {
        var angle = Math.atan2(this.ship.y - bullet.y, this.ship.x - bullet.x) + this.game.math.degToRad(90);
        bullet.rotation = angle;
        bullet.body.angle = angle;

        var velocityX = (this.ship.x - bullet.x);
        var velocityY = (this.ship.y - bullet.y);
        var speedRatio = 10;
        var maxVelocity = Math.max(velocityX, velocityY);
        if (maxVelocity > 100) {
          speedRatio = 0.3;
        }
        else if (maxVelocity > 50) {
          speedRatio = 0.5;
        }
        bullet.body.velocity.setTo(velocityX, velocityY);
    },

    die: function(){
        this.sound.play('death');
        this.ship.kill();
        this.context.lives--;
        if(this.context.lives === 0) {
            this.context.isGameOver = true;
            this.context.lives = 3;
            this.state.start('LevelFinished', true, false, this.context);
        }
        else {
            this.state.start('LevelFinished', true, false, this.context);
        }
    },

    levelUp: function() {
        this.sound.play('levelup');
        if(this.context.lives < 3) {
            this.context.lives++;
        }
        this.context.isGameFinished = (this.context.level === levels.length - 1);
        if(this.context.isGameFinished) {
            this.context.level = 1;
        }
        else {
            this.context.level++;
        }
        this.context.isGameOver = false;
        this.state.start('LevelFinished', true, false, this.context);
    }

};
