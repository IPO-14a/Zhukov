var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var img = new Image();
img.src = "img/background_blue.jpg";

var imgCube = new Image();
imgCube.src = "img/Cube_first.png";

var width = 800;
var height = 400;
var platform = height - 100;
var y = platform;
var speedJump = 10;
var speedFall = 5;
var heightJump = 130;
var isOnPlatform = true;
var isJumping = false;
var canJump = false;
var speed = 5;
var backPositionX = 0;

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
	context.clearRect(0, 0, 800, 400);
	if(backPositionX <= -width)
		backPositionX = 0;
	backPositionX -= speed;
	context.drawImage(img, backPositionX, 0, width, height);
	context.drawImage(img, backPositionX + width, 0, width, height);
	context.drawImage(imgCube, 200, y, 100, 100);
}

var gameLoop = function() {
	jump();
	checkGravity()
	drawRect(); 
	requestAnimationFrame(gameLoop);
}



gameLoop();
