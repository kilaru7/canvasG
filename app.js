
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var jetX = 100;
var jetY = 100;
var jetWidth = 120;
var jetHeight = 100;

var Keys = {up: false, down: false, left: false, right: false, sp: false};

var jet = new Image();
	jet.src = 'jetNew.svg';
	jet.onload = function(){ctx.drawImage(jet, jetX, jetY,jetWidth,jetHeight);}

var target = new Image();
	target.src = 'target1.svg';
var targetWidth = 50;

var shot = new Image();
	shot.src = 'target3.svg';
	
var bgImg = new Image();
bgImg.src = 'bg.png';
var bgWidth =canvas.width;
var scrollSpeed = 1;

var obstacles = new Array(); 
var c = 0;

var bullets = new Array();
var b = 0;

var score =0;

var fired = 0;var ms =0;
var bulletTimer;
function incrementSeconds() { ms += 1;}
  
var gameRunning = true;
  
updateGame();

function updateGame()
{
	bgScroll();
	ctx.drawImage(jet, jetX, jetY,jetWidth,jetHeight);
	moveJet();
	moveObstacles();
	checkCollision();
	//moveScenery
	if(b) 
	{
		bulletAction();
		checkHits();
	}
	if(gameRunning)
	{
	window.requestAnimationFrame(updateGame);
	}
}

function gameOver()
{
	jet.src = 'jetBlast.svg';
	ctx.drawImage(jet, jetX, jetY,jetWidth,jetHeight);
	ctx.drawImage(bgImg,bgWidth - canvas.width,0,canvas.width,canvas.height);
	gameRunning = false;
}

function moveJet()
{
	window.onkeydown = function(e) {
    var kc = e.keyCode;
    //e.preventDefault();

    if      (kc === 37) Keys.left = true;  
    else if (kc === 38) Keys.up = true;    
    else if (kc === 39) Keys.right = true;
    else if (kc === 40) Keys.down = true;
	else if (kc === 32) Keys.sp = true;
};

window.onkeyup = function(e) {
    var kc = e.keyCode;
    //e.preventDefault();

    if      (kc === 37) Keys.left = false;
    else if (kc === 38) Keys.up = false;
    else if (kc === 39) Keys.right = false;
    else if (kc === 40) Keys.down = false;
	else if (kc === 32) Keys.sp = false;
};

if (Keys.up) {
	ctx.clearRect(jetX, jetY,jetWidth+1,jetHeight+1);
    jetY-=3;
	if(jetY<10) gameOver();
	else ctx.drawImage(jet, jetX, jetY,jetWidth,jetHeight);
}
else if (Keys.down) { 
	ctx.clearRect(jetX, jetY,jetWidth+1,jetHeight+1);
    jetY+=3;
	if((jetY+jetHeight) > (canvas.height-10)) gameOver();
	else ctx.drawImage(jet, jetX, jetY,jetWidth,jetHeight);
}

if (Keys.left) {
	ctx.clearRect(jetX, jetY,jetWidth+1,jetHeight+1);
    jetX-=3;
	if(jetX<5) gameOver();
	else ctx.drawImage(jet, jetX, jetY,jetWidth,jetHeight);
}
else if (Keys.right) {
	ctx.clearRect(jetX, jetY,jetWidth+1,jetHeight+1);
    jetX+=3;
	if((jetX+jetWidth) > (canvas.width -5)) gameOver();
	else ctx.drawImage(jet, jetX, jetY,jetWidth,jetHeight);
}
else if(Keys.sp){
	if(!fired) 
	{
		fireBullet();
		fired = 1;
		bulletTimer = setInterval(incrementSeconds, 1);//startcounter
	}
	else if(ms>170)
	{
			clearInterval(bulletTimer);
			ms = 0;
			fired = 0;
	}
}

}

function moveObstacles()
{
	var t = new Object();
	if(!c) 
	{
		var edge = 1+Math.floor(Math.random() * 3);
		switch(edge)
		{
			case 1://top edge
			t.targetX = 100*( 1 + Math.floor(Math.random() * 8));
			t.targetY = 6;
			break;
			case 2://right edge
			t.targetX = canvas.width-targetWidth-6;
			t.targetY = 100*(1+ Math.floor(Math.random() * 4));
			break;
			case 3://bottom edge
			t.targetX = 100*(1 + Math.floor(Math.random() * 8));
			t.targetY = canvas.height-targetWidth-6;
			break;
		}
		t.direction = 1+Math.floor(Math.random() * 4);
		ctx.drawImage(target,t.targetX , t.targetY,targetWidth,targetWidth);
		obstacles[c]=t;
		c++;
	}
	else
	{
		var i;
		for (i=0;i<c;i++)
		{
			t=obstacles[i]
			clearTarget(t.targetX, t.targetY);
			if(t.targetX > 5 && t.targetY > 5 && t.targetX < (canvas.width - targetWidth - 5) && t.targetY < (canvas.height- targetWidth - 5))
			{
				switch(t.direction){
				case 1: //north-west
				t.targetX -= 1; t.targetY -= 1;
				break;
				case 2: //south-west
				t.targetX -= 1; t.targetY += 1;
				break;
				case 3: //south-east
				t.targetX += 1; t.targetY += 1;
				break;
				case 4: //north-east
				t.targetX += 1; t.targetY -= 1;
				break;
				}
			}
			else if(t.targetX <= 5)//left boundary
			{
				switch(t.direction){
				case 1: //north-west collision
				t.targetX += 1; t.direction = 4;//north-east
				//obstacles[c]={targetX:t.targetX, targetY:t.targetY, direction:3};//south-east
				//c++;
				break;
				case 2: //south-west collision
				t.targetX += 1; t.direction = 3;//south-east
				//obstacles[c]={targetX:t.targetX, targetY:t.targetY, direction:4};//north-east
				//c++;
				break;
				}				
			}
			else if(t.targetY <= 5)//top boundary
			{
				switch(t.direction){
				case 1: //north-west collision
				t.targetY += 1; t.direction = 2;//south-west
				obstacles[c]={targetX:t.targetX, targetY:t.targetY, direction:3};//south-east
				c++;
				break;
				case 4: //north-east collision
				t.targetY += 1; t.direction = 3;//south-east
				obstacles[c]={targetX:t.targetX, targetY:t.targetY, direction:2};//south-west
				c++;
				break;
				}	
			}
			else if(t.targetX >= (canvas.width- targetWidth - 5))//right boundary
			{
				switch(t.direction){
				case 3: //south-east collision
				t.targetX -= 1; t.direction = 2;//south-west
				obstacles[c]={targetX:t.targetX, targetY:t.targetY, direction:1};//north-west
				c++;
				break;
				case 4: //north-east 
				t.targetX -= 1; t.direction = 1;//north-west
				obstacles[c]={targetX:t.targetX, targetY:t.targetY, direction:2};//south-west
				c++;
				break;
				}	
			}
			else if(t.targetY >= (canvas.height- targetWidth - 5))//bottom boundary
			{
				switch(t.direction){
				case 2: //south-west collision
				t.targetY -= 1; t.direction = 1;//north-west
				obstacles[c]={targetX:t.targetX, targetY:t.targetY, direction:4};//north-east 
				c++;
				break;
				case 3: //south-east 
				t.targetY -= 1; t.direction = 4;//north-east 
				obstacles[c]={targetX:t.targetX, targetY:t.targetY, direction:1};//north-west 
				c++;
				break;
				}	
			}
			ctx.drawImage(target,t.targetX , t.targetY,targetWidth,targetWidth);
			obstacles[i]=t;
		}
	}
}

function clearTarget(x,y)
{
	ctx.save();
	ctx.beginPath();
	var r = targetWidth/2;
	ctx.arc(x+r, y+r, r+1, 0, 2 * Math.PI);
	ctx.clip();
	ctx.clearRect(x,y,targetWidth,targetWidth);
	ctx.restore();
}


function checkCollision()
{
	var q = new Object();
	var i;
		for (i=0;i<c;i++)
		{
			q=obstacles[i];
			if( jetX < q.targetX && q.targetX < (jetX+jetWidth) && q.targetY < (jetY+jetHeight) && jetY < q.targetY ) gameOver(); //north west collision
			else if ( jetX < q.targetX && q.targetX < (jetX+jetWidth) && q.targetY < jetY && jetY < (q.targetY + targetWidth)) gameOver(); //south west collision
			else if ( q.targetX < jetX && jetX < (q.targetX + targetWidth) && q.targetY < jetY && jetY < (q.targetY + targetWidth)) gameOver(); //south east collision
			else if ( q.targetX < jetX && jetX < (q.targetX + targetWidth)  && q.targetY < (jetY+jetHeight) && jetY < q.targetY ) gameOver(); //north east collision
		}
}

function fireBullet()
{
	var l = new Object();
	
	var x = jetX + (0.75*jetWidth);
	var y1 = jetY + (0.25*jetHeight) - 8;
	var y2 = jetY + (0.75*jetHeight) + 6;
	ctx.beginPath();
	ctx.arc(x, y1,4, 0, 2 * Math.PI);
	ctx.fillStyle = 'black';
    ctx.fill();
	l = { bulletX:x, bulletY:y1}; bullets[b] = l; b++;
	ctx.closePath();
	
	ctx.beginPath();
	ctx.arc(x, y2,4, 0, 2 * Math.PI);
	ctx.fillStyle = 'black';
    ctx.fill();
	l = { bulletX:x, bulletY:y2}; bullets[b] = l; b++;
	ctx.closePath();
	
}

function bulletAction()
{
	var l = new Object();
	//move bullet
	var i;
	for (i=0;i<b;i++)
		{
			l = bullets[i];
			ctx.clearRect(l.bulletX - 4, l.bulletY -4, 8,8);
			l.bulletX +=3;
			ctx.beginPath();
			ctx.arc(l.bulletX , l.bulletY,4, 0, 2 * Math.PI);
			ctx.fillStyle = 'black';
			ctx.fill();
			ctx.closePath() 
			bullets[i] = l;
		}
	
}

function checkHits()
{
	var i;var j;
	var l = new Object();var q = new Object();
	for (i=0;i<b;i++)
		{
			l=bullets[i];
			var bw = 8;
			var bx = l.bulletX-4;
			var by = l.bulletY -4;
			for (j=0;j<c;j++)
			{
				q=obstacles[j];
				if( bx < q.targetX && q.targetX < (bx+bw) && q.targetY < (by+bw) && by < q.targetY ) targetShot(i,j); //north west collision
				else if ( bx < q.targetX && q.targetX < (bx+bw) && q.targetY < by && by < (q.targetY + targetWidth)) targetShot(i,j); //south west collision
				else if ( q.targetX < bx && bx < (q.targetX + targetWidth) && q.targetY < by && by < (q.targetY + targetWidth)) targetShot(i,j); //south east collision
				else if ( q.targetX < bx && bx < (q.targetX + targetWidth)  && q.targetY < (by+bw) && by < q.targetY ) targetShot(i,j); //north east collision
			}
		}
}

function targetShot(i,j)
{
	var l = new Object();l=bullets[i];
	bullets.splice(i,1);b--;
	ctx.clearRect(l.bulletX-4 , l.bulletY -4,8,8);
	var q = new Object();q=q=obstacles[j];
	obstacles.splice(j,1);c--;
	ctx.clearRect(q.targetX , q.targetY,targetWidth,targetWidth);
	ctx.drawImage(shot,q.targetX , q.targetY,targetWidth,targetWidth);
	var blastTimer = setTimeout(function() {clearShot(q)},150);
	score++;document.getElementById("scoreCount").innerHTML = score;
	return;
}

function clearShot(q)
{
	ctx.clearRect(q.targetX , q.targetY,targetWidth,targetWidth);
}

function bgScroll()
{
	ctx.drawImage(bgImg,bgWidth,0,canvas.width,canvas.height);
	ctx.drawImage(bgImg,bgWidth - canvas.width,0,canvas.width,canvas.height);
	bgWidth -= scrollSpeed;
	if(!bgWidth) bgWidth =canvas.width;
}
	

