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

        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.ship = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ship');
        this.game.physics.p2.enable(this.ship);


        this.enemies = this.game.add.group();
        for (var i = 0; i < 10; i++) {
            var enemy = this.enemies.create(game.rnd.integerInRange(0, 640), game.rnd.integerInRange(0, 480), 'enemy1');
            this.game.physics.p2.enable(enemy, false);
            enemy.body.enableBodyDebug = true;
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
        var mousePosition = this.game.input.mousePointer.position;
        var mouseHovered = game.physics.p2.hitTest(mousePosition, [ this.ship ]);

        if (mouseHovered.length > 0)
        {
          this.ship.body.velocity.x = 0;
          this.ship.body.velocity.y = 0;
        } else {
          var speed = 400;
          var deltaAngle = Math.atan2(game.input.mousePointer.y - this.ship.y, game.input.mousePointer.x - this.ship.x);
          this.ship.body.rotation = deltaAngle + this.game.math.degToRad(90);
          this.ship.body.force.x = Math.cos(deltaAngle) * speed;
          this.ship.body.force.y = Math.sin(deltaAngle) * speed;
        }
    },

    moveEnemy: function(enemy) {
        var deltaAngle = Math.atan2(this.ship.y - enemy.y, this.ship.x - enemy.x);
        enemy.body.rotation = deltaAngle + this.game.math.degToRad(90);
        if (typeof speed === 'undefined') { speed = 60; }
        enemy.body.force.x = Math.cos(deltaAngle) * speed;
        enemy.body.force.y = Math.sin(deltaAngle) * speed;
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
