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

        game.renderer.renderSession.roundPixels = true;
    },

    create: function () {
        this.sound.play("twotones");
        this.background = this.add.tileSprite(0, 0, 640, 480, 'space');

        game.physics.startSystem(Phaser.Physics.P2JS);

        this.ship = game.add.sprite(game.world.centerX, game.world.centerY, 'ship');
        game.physics.p2.enable(this.ship);

        //  Length, xAnchor, yAnchor
        this.createChain(4, this.ship)
        this.game.world.bringToTop(this.ship);

        this.enemies = this.game.add.group();
        this.enemiesTimer = this.time.create(false);
        this.configEnemyTimer(5000);
        this.createEnemy();

        var style = { fill: "#ffffff", align: "center", fontSize: 32 };

        this.scoreText = this.createText(20, 20, this.context.score || '000', style);
        this.levelText = this.createText(520, 20, "level " + (this.context.level || '1'), style);

        this.arcade = new Phaser.Physics.Arcade(this.game);
    },

    configEnemyTimer: function(interval) {
        this.enemiesTimer.removeAll();
        this.enemiesTimer.loop(interval, this.createEnemy, this);
        this.enemiesTimer.start();
    },

    randomBorderPosition: function() {
        var randx = function() {return this.game.rnd.integerInRange(0, 640);}
        var randy = function() {return this.game.rnd.integerInRange(0, 480);}
        var border = this.game.rnd.integerInRange(1, 4);
        if (border==1) { return {x:randx(), y:0}   }
        if (border==2) { return {x:randx(), y:480} }
        if (border==3) { return {x:0, y:randy()}   }
        if (border==4) { return {x:640, y:randy()} }
    },


    createEnemy: function() {
        var pos = this.randomBorderPosition();
        var x = pos.x;
        var y = pos.y;
        console.log('x'+x+' '+y)
        var enemy = this.enemies.create(x, y, 'enemy1');
        this.game.physics.p2.enable(enemy, false);
        enemy.body.enableBodyDebug = true;
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
        var mousePosition = game.input.mousePointer.position;
        var mouseHovered = game.physics.p2.hitTest(mousePosition, [ this.ship ]);

        if (mouseHovered.length > 0)
        {
          this.ship.body.velocity.x = 0;
          this.ship.body.velocity.y = 0;
        } else {
          var speed = 400;
          var deltaAngle = Math.atan2(game.input.mousePointer.y - this.ship.y, game.input.mousePointer.x - this.ship.x);
          this.ship.body.rotation = deltaAngle + game.math.degToRad(90);
          this.ship.body.force.x = Math.cos(deltaAngle) * speed;
          this.ship.body.force.y = Math.sin(deltaAngle) * speed;
        }
        
    },

    moveEnemy: function(enemy) {
        var deltaAngle = Math.atan2(this.ship.y - enemy.y, this.ship.x - enemy.x);
        enemy.body.rotation = deltaAngle + game.math.degToRad(90);
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
    },

    createChain: function(length, ship) {

        var lastRect;
        var height = 20;        //  Height for the physics body - your image height is 8px
        var width = 16;         //  This is the width for the physics body. If too small the rectangles will get scrambled together.
        var maxForce = 20000;   //  The force that holds the rectangles together.

        for (var i = 0; i <= length; i++)
        {
            var x = ship.x;                    //  All rects are on the same x position
            var y = ship.y + (i * height);     //  Every new rect is positioned below the last

            if (i % 2 === 0)
            {
                //  Add sprite (and switch frame every 2nd time)
                newRect = game.add.sprite(x, y, 'chain', 1);
            }
            else
            {
                newRect = game.add.sprite(x, y, 'chain', 0);
                lastRect.bringToTop();
            }

            //  Enable physicsbody
            game.physics.p2.enable(newRect, false);

            //  Set custom rectangle
            newRect.body.setRectangle(width, height);

            if (i === 0)
            {
                //  Lock the two bodies together. The [0, 50] sets the distance apart (y: 80)
                var constraint = game.physics.p2.createLockConstraint(ship.body, newRect.body);
            }
            else
            {
                //  Anchor the first one created
                newRect.body.velocity.x = 400;      //  Give it a push :) just for fun
                newRect.body.mass = 0.1;     //  Reduce mass for evey rope element
            }

            //  After the first rectangle is created we can add the constraint
            if (lastRect)
            {
                game.physics.p2.createRevoluteConstraint(newRect, [0, -10], lastRect, [0, 10], maxForce);
            }

            lastRect = newRect;

        }

        this.createWeapon(lastRect);
      },

      createWeapon: function(chainEnd) {
        this.weapon = game.add.sprite(chainEnd.x + 10, chainEnd.y + 7, 'weapon');
        game.physics.p2.enable(this.weapon);
        game.physics.p2.createLockConstraint(this.weapon.body, chainEnd.body, [0, 0], 0);
        this.weapon.body.rotation = 90;
        this.weapon.body.mass = 0.1;
      }
};
