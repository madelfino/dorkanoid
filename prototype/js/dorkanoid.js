var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var Bricks = [];
var DEBUG = false; //aka cheat mode
var mute = false;

window.onload = function() {

    Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT);
    
        Crafty.scene("loading", function(){

        Crafty.load(["images/dorkanoidSpriteSheet.png", "sfx/hit1.wav", "sfx/hit2.wav"], function() {
            Crafty.sprite(1, "images/dorkanoidSpriteSheet.png", {
                brickSprite: [0,0,800,20],
                ballSprite: [0,20,20,20],
                paddleSprite: [20,20,120,20],
                speakerSprite: [140,20,20,20]
            });
            Crafty.audio.add("hit1", "sfx/hit1.wav");
            Crafty.audio.add("hit2", "sfx/hit2.wav");
            Crafty.scene("main");
        });

        Crafty.background("#2980F7");
        Crafty.e("2D, DOM, Text").attr({w:100,h:20,x:150,y:120})
                .text("Loading")
                .css({"text-align":"center"});
    });

    Crafty.scene("loading");
    
    Crafty.scene("main", function(){
        level = getCurrentLevel();
        generateMap(level);
        createBackground();
        var paused = false;
        var start = 0;
        var player = Crafty.e("2D, DOM, paddleSprite, Keyboard, solid")
                .attr({x: 340, y: 500, z: 2, left: false, right: false, speed: 15, name: "paddle"})
                .bind('EnterFrame', function() {
                    if  (!paused) {
                        if (this.right && this.x < 680)
                            this.x += this.speed;
                        if (this.left && this.x > 0)
                            this.x -= this.speed;
                        if (levelComplete()) {
                            nextLevel();
                        }
                    }
                })
                .bind('KeyDown', function(e) {
                    if(e.key == Crafty.keys['LEFT_ARROW']) {
                        if (!start) start = 1;
                        this.left = true;
                    } else if (e.key == Crafty.keys['RIGHT_ARROW']) {
                        if (!start) start = -1;
                        this.right = true;
                    } else if (e.key == Crafty.keys['P']) {
                        paused = !paused;
                        if (paused) {
                            screenText.text("PAUSED");
                        } else {
                            screenText.text("");
                        }
                    } else if(e.key == Crafty.keys['SPACE'] && !start) {
                        start = 1;
                    } else if(e.key == Crafty.keys['S'] && DEBUG) {
                        nextLevel();
                    }
                })
                .bind('KeyUp', function(e) {
                    if (e.key == Crafty.keys['LEFT_ARROW']) {
                        this.left = false;
                    } else if (e.key == Crafty.keys['RIGHT_ARROW']) {
                        this.right = false;
                    }
                });

        var ball = Crafty.e("2D, DOM, ballSprite, Collision, solid")
                .attr({x: 390, y: 480, z: 2, vx: 0, vy: 0, speed: 7})
                .onHit('solid', function(data) {
                    console.log(data[0].obj);
                    if (data[0].obj.name == "paddle")
                        playSound("hit2");
                    var Rx = data[0].obj.x;
                    var Ry = data[0].obj.y;
                    var Rw = data[0].obj.w;
                    var Rh = data[0].obj.h;
                    var Cx = this.x + this.w/2;
                    var Cy = this.y + this.h/2;
                    if (Cx > Rx && Cx < (Rx + Rw)) {
                        this.vy = -this.vy;
                        if (this.y > Ry) this.y = Ry + Rh;
                        else this.y = Ry - this.h;
                    } else if (Cy > Ry && Cy < (Ry + Rh)) {
                        this.vx = -this.vx;
                        if (this.x < Rx + Rh/2) this.x = Rx - this.w;
                        else this.x = Rx + Rw;
                    } else {
                        this.vx = -this.vx;
                        this.vy = -this.vy;
                    }
                })
                .bind('EnterFrame', function() {
                    if (!paused) {
                        if (this.vx == 0 && this.vy == 0 && start) {
                            this.vx = this.speed * start;
                            this.vy = -this.speed;
                        }
                        this.x += this.vx;
                        this.y += this.vy;
                        if (this.x >= SCREEN_WIDTH - 20 || this.x <= 0) this.vx = -this.vx;
                        if (this.y <= 0) this.vy = -this.vy;
                        if (this.y >= SCREEN_HEIGHT) {
                            if (DEBUG)
                                this.vy = -this.vy;
                            else
                                Crafty.scene("Lose");
                        }
                    }
                });

        var muteButton = Crafty.e("2D, DOM, speakerSprite, Mouse, Keyboard")
            .attr({x: 780, y: 580, z: 3})
            .bind('KeyDown', function(e) {
                if(e.key == Crafty.keys['M']) {
                    mute = !mute;
                    if(mute) {
                        this.sprite(160, 20);
                    } else {
                        this.sprite(140,20);
                    }
                }
            })
            .bind('Click', function() {
                mute = !mute;
                if(mute) {
                    this.sprite(160, 20);
                } else {
                    this.sprite(140,20);
                }
            });

        if(mute) muteButton.sprite(160,20);

        var screenText = Crafty.e("2D, DOM, Text, Keyboard")
            .attr({w:200,h:20,x:300,y:200})
    });

    Crafty.scene("Lose", function() {
        cleanupBricks();
        Crafty.e("2D, DOM, Text, Keyboard").attr({w:200,h:20,x:300,y:200})
            .text("YOU DEAD")
            .css({"text-align":"center", "color":"red"})
            .bind('KeyDown', function(e) {
                if(e.key == Crafty.keys['SPACE']) {
                    Crafty.scene("main");
                }
            });
    });
};

function playSound(sound, repeat, volume)
{
    if (!repeat) repeat = 1;
    if (!volume) volume = 1;
    if (!mute) Crafty.audio.play(sound);
}

function nextLevel() {
    cleanupBricks();
    ++level_index;
    //For now, just repeat the levels infinietly, //TODO: Add Victory Screen
    level_index %= LEVEL_DATA.Levels.length;
    Crafty.scene("main");
}

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
    return (Bricks.length == 0);
}

function cleanupBricks() {
    for (var i=0; i<Bricks.length; ++i)
        Bricks[i].destroy();
    Bricks = [];
}

function addBrick(i,j,hp)
{
    Bricks.push(Crafty.e("2D, DOM, brickSprite, Collision, solid")
        .attr({x: i*BRICK_WIDTH, y: j*BRICK_HEIGHT, w:BRICK_WIDTH, h:BRICK_HEIGHT, z: 1, hp: hp, index: Bricks.length, gotHit: false})
        .onHit('ballSprite', function() {
            this.gotHit = true;
            }, function() {
            if (this.gotHit) {
                this.gotHit = false;
                playSound("hit1");
                --this.hp;
                if (this.hp < 0) {
                    Bricks.splice(this.index, 1);
                    for (var i=this.index; i<Bricks.length; ++i)
                        --Bricks[i].index;
                    this.destroy();
                } else {
                    this.sprite(this.hp*BRICK_WIDTH, 0);
                }
            }
        })
        .sprite(hp*BRICK_WIDTH, 0)
    );
}

function createBackground() {
    //create background
}