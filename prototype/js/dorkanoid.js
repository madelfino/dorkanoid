var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var Bricks = [];

window.onload = function() {

    Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT);
    
        Crafty.scene("loading", function(){

        Crafty.load(["images/dorkanoidSpriteSheet.png"], function() {
            Crafty.sprite(1, "images/dorkanoidSpriteSheet.png", {
                brickSprite: [0,0,800,20],
                ballSprite: [0,20,20,20],
                paddleSprite: [20,20,120,20]
            });
            Crafty.scene("main");
        });

        Crafty.background("#000");
        Crafty.e("2D, DOM, Text").attr({w:100,h:20,x:150,y:120})
                .text("Loading")
                .css({"text-align":"center"});
    });

    Crafty.scene("loading");
    
    Crafty.scene("main", function(){
        level = getCurrentLevel();
        generateMap(level);
        createBackground();
        var start = 0;
        var player = Crafty.e("2D, DOM, paddleSprite, Keyboard, solid")
                .attr({x: 340, y: 500, z: 2, left: false, right: false, speed: 7})
                .bind('EnterFrame', function() {
                    if (this.right && this.x < 680)
                        this.x += this.speed;
                    if (this.left && this.x > 0)
                        this.x -= this.speed;
                    if (levelComplete()) {
                        ++level_index;
                        Crafty.scene("main");
                    }
                })
                .bind('KeyDown', function(e) {
                    if(e.key == Crafty.keys['LEFT_ARROW']) {
                        if (!start) start = 1;
                        this.left = true;
                    } else if (e.key == Crafty.keys['RIGHT_ARROW']) {
                        if (!start) start = -1;
                        this.right = true;
                    }
                    if(e.key == Crafty.keys['SPACE'] && !start) start = 1;
                })
                .bind('KeyUp', function(e) {
                    if (e.key == Crafty.keys['LEFT_ARROW']) {
                        this.left = false;
                    } else if (e.key == Crafty.keys['RIGHT_ARROW']) {
                        this.right = false;
                    }
                });
                
        var ball = Crafty.e("2D, DOM, ballSprite, Collision")
                .attr({x: 390, y: 480, z: 2, vx: 0, vy: 0, speed: 10})
                .onHit('solid', function() {
                    this.vy = -this.vy;
                })
                .bind('EnterFrame', function() {
                    if (this.vx == 0 && this.vy == 0 && start) {
                        this.vx = this.speed * start;
                        this.vy = -this.speed;
                    }
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x >= SCREEN_WIDTH - 20 || this.x <= 0) this.vx = -this.vx;
                    if (this.y >= SCREEN_HEIGHT - 20 || this.y <= 0) this.vy = -this.vy;
                });
    });
};

function getCurrentLevel() {
    return LEVEL_DATA.Levels[level_index];
}

//  GenerateMap
function generateMap(level) {
    var bricks = level.bricks;
    for(var j = 0; j < bricks.length; j++)
    {
        for(var i = 0; i < bricks[j].length; i++)
        {
            if(bricks[j][i]!=0)
                addBrick(i,j,bricks[j][i]-1);
        }
    }
};

function levelComplete() {
    for(var i=0; i<Bricks.length; ++i)
        if(Bricks[i] != undefined)
            return false;
    return true;
}

function addBrick(i,j,hp)
{
    Bricks.push(Crafty.e("2D, DOM, brickSprite, solid, Collision")
        .attr({x: i*BRICK_WIDTH, y: j*BRICK_HEIGHT, w:BRICK_WIDTH, h:BRICK_HEIGHT, z: 1, hp: hp, index: Bricks.length})
        .onHit('ballSprite', function() {
            --this.hp;
            if (this.hp < 0) {
                delete Bricks[this.index];
                this.destroy();
            } else {
                this.sprite(this.hp*BRICK_WIDTH, 0);
            }
        })
        .sprite(hp*BRICK_WIDTH, 0)
    );
}

function createBackground() {
    //create background
}