var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.fillStyle = 'black';

var imgBackground = new Image();
imgBackground.src = "img/background_blue.jpg";

var imgCube_first = new Image();
imgCube_first.src = "img/Cube_first.png";

var imgCube_second = new Image();
imgCube_second.src = "img/Cube_second.png";

var imgPlatform = new Image();
imgPlatform.src = "img/platform.png";

var imgWall = new Image();
imgWall.src = "img/wall.png";

var field = {
    height : 400,
    width : 800,
    x : 0,
    speed : 10,
    nextX : function(){
        if (this.x <= -this.width)
            this.x = 0;
        this.x -= this.speed;
    }
};

var user = {
    y : 300,
    heightJump : 130,
    platform : 300,
    isOnPlatform : true,
    canJump : false,
    isJumping : false,
    speedJump : 10,
    speedFall : 5,
    jump : function () {
        if (this.isOnPlatform && this.canJump) {
            this.isOnPlatform = false;
            this.isJumping = true;
            this.canJump = false;    
        }
        if (this.isJumping && this.platform < this.y + this.heightJump) {
            this.y -= this.speedJump;
        } else {
            this.isJumping = false;
        }
    },
    checkGravity : function() {
        if (!this.isJumping && this.y != this.platform && !this.isOnPlatform) {
            this.y += this.speedFall;
        } else if (this.y == this.platform) {
            this.isOnPlatform = true;
        }
    }
};

function checkCollision(x, y, width, height) {
    console.log(field.x);
    if (field.x < x + width && field.x > x - width  && user.y > y - height) {
        console.log("gg");
        field.speed = 0;
    }
    else if ( field.x < x + width && field.x > x - width && user.y == y - height 
        && !user.isJumping) {
        console.log("yeah");
        user.isOnPlatform = true;
    }
    else if ( field.x == x - width) {
        console.log("yeahdddddddddd");
        user.isOnPlatform = false;
    }
};
 
window.onload = function() {
    window.onkeydown = function(e) {
        if (user.isOnPlatform && e.keyCode == 32) {
            user.canJump = true;
            user.heightJump = 130 + (user.y - 300) * -1;
        }
    };
};

function checkGravity() {
    if (!isJumping && y != platform && !isOnPlatform) {
       y += speedFall;
    } else if (y == platform) {
       isOnPlatform = true;
    }
};

function drawField() {
    context.clearRect(0, 0, 800, 400);
    field.nextX();
    context.drawImage(imgBackground, field.x, 0, field.width, field.height);
    context.drawImage(imgBackground, field.x + field.width, 0, field.width, field.height);
    context.drawImage(imgPlatform, field.x, 400 - 50, field.width, 50);
    context.drawImage(imgPlatform, field.x + field.width - 5, 400 - 50, field.width, 50);
}

function draw() {
    context.drawImage(imgWall, field.x, 400 - 100, 50, 50);
    context.drawImage(imgWall, field.x + field.width, 400 - 100, 50, 50);
    context.drawImage(imgCube_first, 200, user.y, 50, 50);
};

var gameLoop = function() {
    checkCollision( -600, 400 - 100, 50, 50);
    user.jump();
    user.checkGravity();
    drawField();
    draw(); 
    requestAnimationFrame(gameLoop);
};

gameLoop();