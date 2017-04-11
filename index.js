var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var img = new Image();
img.src = "img/background_blue.jpg";

var imgCube = new Image();
imgCube.src = "img/Cube_first.png";


var platform = 400 - 70;
var y = platform;
var speedJump = 5;
var speedFall = 2;
var heightJump = 100;
var isOnPlatform = true;
var isJumping = false;
var canJump = false;


var keys = {
	'W' : 87,
	'A' : 65,
	'D' : 68
};

var keyDown = 0;

function jump(){
	if(isOnPlatform && canJump){
		isOnPlatform = false;
		isJumping = true;
		canJump = false;	
	}
	if(isJumping && platform != y + heightJump){
		y -= speedJump;
	}else{
		isJumping = false;
	}
}

window.onload = function(){
	window.onkeydown = function(e){
		if(isOnPlatform && e.keyCode == 87)
			canJump = true;
	};
}

function checkGravity(){
	if(!isJumping && y != platform){
		y += speedFall;
	}else if(y == platform){
		isOnPlatform = true;
	}
}

function drawRect(){
	context.fillStyle = 'black';
	context.clearRect(0, 0, 500, 400);
	context.drawImage(img, 0, 0, 500, 400);
	context.drawImage(imgCube, 200, y, 100, 100);
}

var gameLoop = function() {
	jump();
	checkGravity()
	drawRect(); 
	requestAnimationFrame(gameLoop);
}



gameLoop();
