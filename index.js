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

var imgTriangle = new Image();
imgTriangle.src = "img/triangle.png";

var field = {
    height : 400,
    width : 800,
    isLose : false,
    x : 0,
    speed : 8,
    
    nextX : function(){
        if (this.x <= -this.width)
            this.x = 0;
        this.x -= this.speed;
    }
};

Cell = {
    x : 0,
    y : 300,
    height : 50,
    width : 50,

    nextX : function() {
        this.x -= field.speed;
    },

    draw : function() {
        context.drawImage(imgWall, this.x, this.y, this.width, this.height);
    },

    checkCollision : function() {
        if (250 > this.x && 200 < this.x + this.width && user.y > this.y - this.height
            && user.y < this.y + this.height) {
            field.speed = 0;
            field.isLose = true;
        }
        else if (250 > this.x && 200 < this.x + this.width && user.y == this.y - this.height && !user.isJumping) {
            user.isOnPlatform = true;
        }
        else if ( 200 > this.x + this.width + 20 && 200 < this.x + this.width + 30) {
            user.isOnPlatform = false;
        }
    }
};

CellTriangle = {
    x : 0,
    y : 300,
    height : 50,
    width : 50,

    nextX : function() {
        this.x -= field.speed;
    },

    draw : function() {
        context.drawImage(imgTriangle, this.x, this.y, this.width, this.height);
    },

    checkCollision : function() {
        if (250 > this.x && 200 < this.x + this.width && 
            user.y > this.y - this.height
            && user.y < this.y + this.height) {
          
            field.speed = 0;
            field.isLose = true;
        }
    }
}

var user = {
    y : 300,
    heightJump : 140,
    platform : 300,
    isOnPlatform : true,
    canJump : false,
    isJumping : false,
    speedJump : 10,
    speedFall : 10,
    loseUp : true,

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
            this.y += this.y + this.speedFall < this.platform ?
             this.speedFall : this.platform - this.y;
        } else if (this.y == this.platform) {
            this.isOnPlatform = true;
        }
    },

    lose : function() {

        if(this.y > 0 && this.loseUp)
            this.y -= 5; 
        else{
            this.y += 10;
            this.loseUp = false;
        }
    }
};
 
window.onload = function() {
    window.onkeydown = function(e) {
        if (user.isOnPlatform && e.keyCode == 32) {
            user.canJump = true;
            user.heightJump = 130 + (user.y - 300) * -1;
        }
    };

    initMap();
    gameLoop();
};

x = 0;

function drawField() {
    context.drawImage(imgBackground, x, 0, field.width, field.height);
    context.drawImage(imgBackground, x + field.width - 5, 0, field.width, field.height);
    context.drawImage(imgPlatform, field.x, 400 - 50, field.width, 50);
    context.drawImage(imgPlatform, field.x + field.width - 5, 400 - 50, field.width, 50);
}

function draw() {
    context.drawImage(imgCube_first, 200, user.y, 50, 50);
};

var elements = [];
var countGenerate = 0;
var distance = [];
var allDistance = 0;
var map = ["0000000 10  0 0 0 0 1", 
           "0000000"];
map.reverse();

function fieldX(i) {
    for (var j = 0; j < elements[i].length; j++) {
        elements[i][j].checkCollision();
        elements[i][j].nextX();
        elements[i][j].draw();
    }
}

function initMap(){
    for (var i = 0; i < map.length; i++) {
        elements.push([]);
        distance.push(0);
    }
}

function generateMap(){
    allDistance += field.speed;    
    for (var i = 0; i < map.length; i++) {
        generateRow(i);
        fieldX(i);
    }
}

function generateRow(i) {
    
    if (countGenerate + 1 < map[i].length){
        if (elements[i].length > 0) {
            while (elements[i].x < 0) {
                elements.shift();
            }
        }

        if (elements.length  < 20) {
            distance[i] += 50;

            if (map[i][countGenerate] == "0") {
                var cell = Object.create(Cell);
                cell.x = distance[i] + field.width;
                cell.y = cell.y - 50 * i;
                elements[i].push( cell );
            } else if (map[i][countGenerate] == "1"){
                var cell = Object.create(CellTriangle);
                cell.x = distance[i] + field.width;
                cell.y = cell.y - 50 * i;
                elements[i].push( cell );
            }
            
        } else
           distance[i] = elements[19].x - field.width;
        console.log(elements.length);
        countGenerate++;
    }
    if( allDistance > map[0].length * 50)
        console.log("you win!");
};

function gameLoop() {
   
    console.log(field.isLose);
    context.clearRect(0, 0, 800, 400);
    drawField();
    generateMap();

    if ( !field.isLose ) {
      if (x < -790)
        x = 0;
        x -= 1;
        field.nextX();
        user.jump();
        user.checkGravity();

    } else {
        user.lose();  
    } 
    draw(); 
    requestAnimationFrame(gameLoop);
};