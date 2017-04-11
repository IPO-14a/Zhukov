var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var img = new Image();
img.src = "img/background_blue.jpg";

var imgCube = new Image();
imgCube.src = "img/Cube_first.png";

var imgPlatform = new Image();
imgPlatform.src = "img/platform.png";

var imgWall = new Image();
imgWall.src = "img/wall.png";

var width = 800;
var height = 400;
var platform = height - 100;
var y = platform;
var position = y;
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
	if(isJumping && platform < y + heightJump){
		y -= speedJump;
	}else{
		isJumping = false;
	}
}

function checkCollision(){
	//console.log(backPositionX);
	if(backPositionX < -600 + 50 && backPositionX > -650  && y > 400 - 150)
		console.log("ggg");
	else if( backPositionX < -600 + 50 && backPositionX > -650 && y == 400 - 150 && !isJumping){
		console.log("yeah");
		isOnPlatform = true;
	}
	else
		isOnPlatform = false;

}

window.onload = function(){
	window.onkeydown = function(e){
		console.log(e.keyCode);
		if(isOnPlatform && e.keyCode == 32){
			canJump = true;
			console.log(y);
			heightJump = 130 + (y - 300) * -1;
		}
	};
}

function checkGravity(){
	if(!isJumping && y != platform && !isOnPlatform){
		y += speedFall;
	}else if(y == platform){
		isOnPlatform = true;
	}
}

function draw(){
	context.fillStyle = 'black';
	context.clearRect(0, 0, 800, 400);
	if(backPositionX <= -width)
		backPositionX = 0;
	backPositionX -= speed;
	context.drawImage(img, backPositionX, 0, width, height);
	context.drawImage(img, backPositionX + width, 0, width, height);
	context.drawImage(imgWall, backPositionX, 400 - 100, 50, 50);
	context.drawImage(imgWall, backPositionX + width, 400 - 100, 50, 50);
	context.drawImage(imgPlatform, backPositionX, 400 - 50, width, 50);
	context.drawImage(imgPlatform, backPositionX + width - 5, 400 - 50, width, 50);
	context.drawImage(imgCube, 200, y, 50, 50);
}

var gameLoop = function() {
	jump();
	checkCollision();
	checkGravity()
	draw(); 
//	requestAnimationFrame(gameLoop);
}



setInterval(gameLoop, 1000/60);
