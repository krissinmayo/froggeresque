'use strict';

/*********************   Enemy   ***********************/

//initial setup of the bugs
var Enemy = function(y) {
	this.sprite = 'images/enemy-bug.png';
	this.x = Math.floor(Math.random() * -200);
	this.y = y;
	this.s = Math.floor(Math.random() * 250 + 50);
	this.width = 83;
	this.height = 50;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

	// multiply movement by the dt parameter
	this.x += this.s * dt;

	//send bug back to left side of screen
	if (this.x > ctx.canvas.width) {
		this.x = -100;
		this.s = Math.floor(Math.random() * 200) + 100;
	}
	this.checkCollision(player);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 101, 101);
};

//check if player has gotten hit by any of the bugs
Enemy.prototype.checkCollision = function(player) {
	if (player.x < this.x + this.width &&
		player.x + player.width > this.x &&
		player.y < this.y + this.height &&
		player.y + player.height > this.y) {
		player.reset();
		points(-20);
	}
};

/*********************   Coins   ************************/

//initial setup of the coins
var Coin = function() {
	this.sprite = 'images/coin.png';
	this.x = Math.floor(Math.random() * 595 + 50);
	this.y = Math.floor(Math.random() * 290 + 100);
	this.obtained = false;
	this.width = 30;
	this.height = 30;

};

//draw coins on screen only if the have not been picked up
Coin.prototype.render = function() {
	if (!this.obtained) {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 30, 30);
	}
};

Coin.prototype.update = function(dt) {
	this.checkCollision(player);
};

//check if player picked up a coin
Coin.prototype.checkCollision = function(player) {
	if (!this.obtained) {
		if (player.x < this.x + this.width &&
			player.x + player.width > this.x &&
			player.y < this.y + this.height &&
			player.y + player.height > this.y) {
			this.obtained = true;
			points(5);
		}
	}
};

/**********************   Key   ************************/

//initial setup of the key
var Key = function() {
	this.sprite = 'images/key.png';
	this.x = -300;
	this.y = 400;
	this.s = Math.floor(Math.random() * 200 + 80);
	this.obtained = false;
	this.height = 80;
	this.width = 47;
};

//draw key on screen
Key.prototype.render = function() {
	if (!this.obtained) {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 46, 86);
	}
};

//update movement
Key.prototype.update = function(dt) {
	this.x += this.s * dt;

	//send key back to left side of screen
	if (this.x > ctx.canvas.width) {
		this.x = Math.floor(Math.random() * -300);
		this.s = Math.floor(Math.random() * 200 + 80);
	}
	this.checkCollision(player);
};

//check if player has picked up the key
Key.prototype.checkCollision = function(player) {
	if (!this.obtained) {
		if (player.x < this.x + this.width &&
			player.x + player.width > this.x &&
			player.y < this.y + this.height &&
			player.y + player.height > this.y) {
			this.obtained = true;
		}
	}
};

/**********************   Door   ***********************/

//initial creation of the door
var Door = function() {
	this.sprite = 'images/doorclosed.png';
	this.x = 606;
	this.y = -50;
	this.open = false;
	this.obtained = false;
};

//reset the door
Door.prototype.reset = function() {
	this.open = false;
	this.optained = false;
	this.x *= Math.random();
};

//if player has key, change image to gem
//if the door is open (ie: gem is on screen), player can pick it up
Door.prototype.render = function() {
	if (!this.open) {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 100, 144);
	}
	else if (this.open && !this.obtained) {
		ctx.drawImage(Resources.get(this.sprite), this.x, -30, 100, 100);

	}
};

//if player has the key, check each frame if player is at the door
Door.prototype.update = function() {
	if (key.obtained) {
		this.checkCollision(player);
	}
};

//if player has the key, can then pick up the gem
Door.prototype.checkCollision = function(player) {
	if (player.x === this.x && player.y < this.y + 144 && player.y + 83 > this.y) {
		if (this.open) {
			this.obtained = true;
			points(300);
		}
		else {
			this.openDoor();
			player.reset();
		}
	}
};

//change image of door to gem
Door.prototype.openDoor = function() {
	this.sprite = 'images/orange.png';
	this.open = true;
};

/********************   Selector   *********************/

//used in main menu screen in engine.js to create selector
var Selector = function() {
	this.x = 101;
	this.y = 165;
	this.column = 0;
	this.sprite = 'images/selector.png';
};

//translate input from user to move selector
Selector.prototype.handleInput = function(key) {
	switch (key) {
		case 'left':
			if (this.column > 0) {
				this.x -= 101;
				this.column--;
				console.log(this.column);
			}
			break;

		case 'right':
			if (this.column < 4) {
				this.x += 101;
				this.column++;
			}
			break;

		case 'enter':
			selectedChar = this.column;
			playAgain();
			break;

		default:
			break;
	}
};

//render selector on menu screen
Selector.prototype.render = function() {
	ctx.save();
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 101, 130);
	ctx.restore();
};

//after player selects a character, reset the game
function playAgain() {
	door.open = false;
	door.obtained = false;
	key.obtained = false;
	door.sprite = 'images/doorclosed.png';
	player.sprite = chars[selectedChar];

	score = 100;
	success = false;
	lose = false;
	play = true;
	
	for (var i = 0; i < 8; i++) {
		allCoins.push(new Coin());
	}

	var l = allEnemies.length;

	for (i = 0; i < l; i++) {
		allEnemies[i].x = Math.floor(Math.random() * -200);
		allEnemies[i].s = Math.floor(Math.random() * 250 + 50);	
	}
}

//used in engine.js
function initLoad() {
	selector = new Selector();
}

/*********************   Player   **********************/

//initial setup of player
var Player = function() {
	this.sprite = '';
	this.x = 303;
	this.y = -25;
	this.width = 72;
	this.height = 70;
};

//draw character on the board
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 101, 101);
};

Player.prototype.update = function(dt) {
	//turns off the game and turns on the menu if player wins or loses
	if (success === true || lose === true) {
		play = false;
	}

	//game over if 0 points
	if (score < 1) {
		lose = true;
	}

	//game over if gem obtained
	if (door.obtained) {
		success = true;
	}
};

//when player gets hit by a bug, go back to start position
Player.prototype.reset = function() {
	this.x = 303;
	this.y = -25;
};

//translate keyboard press to character movement and manage boundaries
Player.prototype.handleInput = function(key) {
	if (key === 'up') {
		this.y -= 83;
	}
	else if (key === 'down') {
		this.y += 83;
	}
	else if (key === 'right') {
		this.x += 101;
	}
	else if (key === 'left') {
		this.x -= 101;
	}

	//send player to opposite side of screen if crossing x bound, no crossing y bound
	if (this.x < 0) {
		this.x = 606;
	}
	else if (this.x > 606) {
		this.x = 0;
	}
	else if (this.y < -25) {
		this.y = -25;
	}
	else if (this.y > 375) {
		this.y = 375;
	}
};

/*********************   Global   **********************/

//menu screen
var play = false;

//win message
var success = false;

//lose message
var lose = false;

//default score
var score = 100;

//character chosen by player
var selector;
var selectedChar;
var chars = [
	'images/char-boy.png',
	'images/char-cat-girl.png',
	'images/char-horn-girl.png',
	'images/char-pink-girl.png',
	'images/char-princess-girl.png'
];

//new entities
var allCoins = [];
var allEnemies = [];
var player = new Player();
var key = new Key();
var door = new Door();

for (var i = 0; i < 8; i++) {
	allCoins.push(new Coin());
}

for (i = 0; i < 6; i++) {
	var j = 0;
	if (i < 2) {
		j = 50;
	}
	else if (i < 3) {
		j = 140;
	}
	else if (i < 5) {
		j = 225;
	}
	else {
		j = 300;
	}
	allEnemies.push(new Enemy(j));
}

//paint current score on screen
function renderScore() {
	ctx.textAlign = "left";
	ctx.fillStyle = "#000";
	ctx.font = "bold 18pt Verdana";
	ctx.fillText("Score: " + score, 0, 30);
}

//add points to total
function points(points) {
	score += points;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		13: 'enter',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};
	if (play === false) {
		selector.handleInput(allowedKeys[e.keyCode]);
	}
	else {
		player.handleInput(allowedKeys[e.keyCode]);
	}
});
