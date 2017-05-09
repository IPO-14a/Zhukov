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

var imgUnMute = new Image();
imgUnMute.src = "img/unMute.png";

var imgMute = new Image();
imgMute.src = "img/Mute.png";

var imgRestart = new Image();
imgRestart.src = "img/restart.png";

var backAudio = document.getElementById("backAudio");

var field = {
    height : 400,
    width : 800,
    isLose : false,
    x : 0,
    speed : 8,
    
    nextX : function() {
        if (this.x <= -this.width)
            this.x = 0;
        this.x -= this.speed;
    }
};

/**
 * Ячейка куб
 *
 * Класс описывает одно из
 * препятствий, куб
 *
 * @author  Alex Zhukov
 * @version 1.0
 * @todo    Протестировать класс
 */
CellCube = {
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
        else if (255 >= this.x && 205 <= this.x + this.width && user.y == this.y - this.height && !user.isJumping) {
            user.isOnPlatform = true;
        }
        else if ( 200 > this.x + this.width && 200 < this.x + this.width + 10 && this.y == user.y + 50) {
            user.isOnPlatform = false;
        }
    }
};

/**
 * Ячейка треугольник
 *
 * Класс описывает одно из
 * препятствий, шип. Оно убивает
 * игрока при любом столкновении
 * с ним.
 *
 * @author  Alex Zhukov
 * @version 1.0
 * @todo    Протестировать класс
 */
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
            user.y >= this.y - this.height
            && user.y <= this.y + this.height) {
          
            field.speed = 0;
            field.isLose = true;
        }
    }
};

/**
 * Ячейка пустоты
 *
 * Класс описывает пустую ячейку.
 *
 * @author  Alex Zhukov
 * @version 1.0
 */
CellBlank = {
    x : 0,
    y : 300,
    height : 50,
    width : 50,

    nextX : function() {

    },

    draw : function() {

    },

    checkCollision : function() {

    }
};

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
        if (this.y > 0 && this.loseUp) {
            this.y -= 5; 
        }
        else {
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
    backAudio.play();
    initMap();
    gameLoop();
};

x = 0;

function drawField() {
    context.drawImage(imgBackground, x, 0, field.width, field.height);
    context.drawImage(imgBackground, x + field.width - 5, 0, field.width, field.height);
    context.drawImage(imgPlatform, field.x, 400 - 50, field.width, 50);
    context.drawImage(imgPlatform, field.x + field.width - 5, 400 - 50, field.width, 50);
};

function draw() {
    context.drawImage(imgCube_first, 200, user.y, 50, 50);
};

var elements = [];
var countGenerate = [];
var distance = [];
var allDistance = 0;
var map = [
            "                                                 ",
            "                                                 ",
            "                                                 ",
            "                000                000           ",
            "            00                 00 000            ",
            "       0001100            000  00 000          00",
            "00000000000000000    1000 000110001000011110   00",
        ];

map.reverse();

function makeRow(i) {
    for (var j = 0; j < elements[i].length; j++) {
        elements[i][j].checkCollision();
        elements[i][j].nextX();
        elements[i][j].draw();
    }
};

function initMap() {
    for (var i = 0; i < map.length; i++) {
        elements.push([]);
        distance.push(0);
        countGenerate.push(0);
    }
};

function restartMap() {
    elements.length = 0;
    distance.length = 0;
    countGenerate.length = 0;
};

function generateMap() {
    allDistance += field.speed;    
    for (var i = 0; i < map.length; i++) {
        generateRow(i);
        makeRow(i);
    }
};

function generateRow(i) {
    if (countGenerate[i] + 1 < map[i].length) {
        if (elements[i].length > 0) {
            if (elements[i][0].x < 0) {
                elements[i].shift();
            }
        }
        distance[i] += 50;
        if (map[i][ countGenerate[i] ] == "0") {
            var cell = Object.create(CellCube);
            cell.x = distance[i] + field.width;
            cell.y = cell.y - 50 * i;
            elements[i].push( cell );
        } else if (map[i][ countGenerate[i] ] == "1") {
            var cell = Object.create(CellTriangle);
            cell.x = distance[i] + field.width;
            cell.y = cell.y - 50 * i;
            elements[i].push( cell );
        } else if (map[i][ countGenerate[i] ] == " ") {
            var cell = Object.create(CellBlank);
            cell.x = distance[i] + field.width; 
            elements[i].push(cell);
        }
        countGenerate[i]++;           
    }
};

function drawButton(button) {
    context.drawImage(button.image, button.x, button.y, button.w, button.h);
};

function Button(x, y, w, h, state, image, type) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.state = state;
    this.image = image;
    this.type = type;
};

var buttons = Array();
buttons.push( new Button(0, 0, 50, 50, true, imgUnMute, "volume") );
buttons.push( new Button(field.width - 50, 0, 50, 50, true, imgRestart, "restart") );

function drawButtons() {
    for (var i = 0; i < buttons.length; i++) {
        drawButton(buttons[i]);
    }
}

function gameLoop() {
    context.clearRect(0, 0, 800, 400);
    field.nextX();
    drawField();
    generateMap();
    if ( !field.isLose ) {
        user.jump();
        user.checkGravity();
    } else {
        
        //user.lose();
    } 
    draw(); 
    drawButtons();
    requestAnimationFrame(gameLoop);
};

function buttonVolume(button) {
     if (button.state) {
            button.state = false;
            backAudio.volume = 0;
            button.image = imgMute;
        } else {
            button.state = true;
            backAudio.volume = 1;
            button.image = imgUnMute;
        }
}; 

function buttonRestart(button) {
    field.isLose = false;
    restartMap();
    initMap();
    field.speed = 8;
    user.y = 300;
}; 

canvas.onmousedown = function(e) {
    var mouse = console.log(e.x + " " + e.y);
    for (var i = 0; i < buttons.length; i++) {
        if (e.x > buttons[i].x && e.x < buttons[i].x + buttons[i].w &&
         e.y > buttons[i].y && e.y < buttons[i].y + buttons[i].h) {
            if (buttons[i].type === "volume")
                buttonVolume(buttons[i]);
            else if (buttons[i].type === "restart")
                buttonRestart(buttons[i]);
        }
    }
};
