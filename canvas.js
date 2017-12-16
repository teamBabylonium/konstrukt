const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width  = 1707; // plans to make responsive
canvas.height = 3360;
document.body.style.zoom = "90%";

const background = new Image();
background.src = "pictures/background.jpg";

const column1 = new Image();
column1.src = "pictures/columns/column1.png"
const column2 = new Image();
column2.src = "pictures/columns/column2.png"
const column3 = new Image();
column3.src = "pictures/columns/column3.png";
const column4 = new Image();
column4.src = "pictures/columns/column4.jpg";
const column5 = new Image();
column5.src = "pictures/columns/column5.jpg";
const column6 = new Image();
column6.src = "pictures/columns/column6.png";
const column7 = new Image();
column7.src = "pictures/columns/column7.png";
const images = [column1, column2, column3, column4, column5, column6, column7];

const plane = new Image();
plane.src = "pictures/plane.png";
let x = 1600;
let xd = 2;

const spaceCraft = new Image();
spaceCraft.src = "pictures/spaceCraft.png";
let x1 = canvas.width - 100;
let xd1 = 0.5;

const ufo = new Image();
ufo.src = "pictures/ufo.png";
let y = 1100;
let yd = 1;

const introImg0 = new Image();
introImg0.src = "pictures/intro0.jpg";
const draw0 = function() {
	ctx.drawImage(introImg0, 0, canvas.height - 961);
};

const introImg1 = new Image();
introImg1.src = "pictures/intro1.jpg";
const draw1 = function() {	
	ctx.drawImage(introImg1, 0, canvas.height - 961);
};

const introImg2 = new Image();
introImg2.src = "pictures/intro2.jpg";
const draw2 = function() {
	ctx.drawImage(introImg2, 0, canvas.height - 961);
};

const introImg3 = new Image();
introImg3.src = "pictures/intro3.jpg";
const draw3 = function() {
	ctx.drawImage(introImg3, 0, canvas.height - 961);
};

const column_height = 75;
const column_width = 300;
const initial_height = 5;
let moving = true; 

const tower = [];
let column;
let score = 0;
let scoreWithoutBonus = score;
let highScore = 0;
let initial_speed = 5;
let perfect_count = 0;
let scrollCount = 0;
let perfect = false;

const scoreNull = function() {
	if (highScore === null) {
		highScore = 0;
	}
};

const playAudio = function() {
	song = new Audio("sounds/song.mp3");
	song.loop = true;
	song.volume = .7;
	song.play();
}; 

const random = function(num) {
	return Math.floor(Math.random() * num);
};

const addBonus = function() {
	score += 4;  // adds 4 bonus + 1 point
};

const isPerfect = function() {
	if (tower.length === initial_height) {
		return;
	} else if (Math.abs(tower[tower.length - 1].x - tower[tower.length - 2].x) <= 5 &&
	Math.abs(tower[tower.length - 1].width - tower[tower.length - 2].width) <= 5) {
		tower[tower.length - 1].x = tower[tower.length - 2].x;
		tower[tower.length - 1].width = tower[tower.length - 2].width;
		perfect_count++;
		score++; // add 2 points
		perfect = true;
	} else if (perfect_count >= 5) {
		addBonus();
		scoreWithoutBonus = score - 5; // needed for proper acceleration
	} else {
		perfect = false;
	}
};

const addColumnToTower = function() {
	tower.push({
		x: (column.x <= tower[tower.length -1].x)? tower[tower.length -1].x : column.x,
		y: tower[tower.length - 1].y - column_height,
		image: images[random(images.length)],
		height: column_height,
		width: (column.x <= tower[tower.length -1].x)?
				column.x + column.width - tower[tower.length -1].x :
				tower[tower.length -1].x + tower[tower.length -1].width - column.x,
	});
	isPerfect();
};

const newColumn = function() {
	column.x = 350; // ratios of canvas
	column.y = tower[tower.length - 1].y - column_height;
	column.image = images[random(images.length)];
	column.width = tower[tower.length - 1].width;		
	column.dx = initial_speed + 0.6 + (scoreWithoutBonus / 50);
};

const scrollBack = function() {
	window.scrollBy(0, + column_height * scrollCount);
	scoreY += column_height * scrollCount;
};

const setColumn = function() {
	score++;
	scoreWithoutBonus++;
	addColumnToTower();
	newColumn();
	
	if (scoreWithoutBonus > 5) {
		window.scrollBy(0, - column_height);
		scoreY -= column_height;
		scrollCount++;
	}
};

const isGameOver = function() {
	if (column.x + column.width <= tower[tower.length -1].x || 
		column.x >= tower[tower.length -1].x + tower[tower.length -1].width ) {
		return true;
	}
	return false;
};


let introInProgress = false;
let stopIntro;

const showIntro = function() {
	if (stopIntro) {
		return;
	} else if (introInProgress) {
		setTimeout(draw0, 0);
		setTimeout(draw1, 500);
		setTimeout(draw3, 1500);
		setTimeout(draw2, 800);
	}
};

const hideIntro = function() {
	introInProgress = false;
	stopIntro = true; // to avoid bugs
	ctx.clearRect(0, 0, canvas.width, canvas.height);
};

let scoreY = 2500;

const draw = function() {
	if (!introInProgress) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // not working properly

		ctx.fillStyle = "#00C5FD";
		ctx.font = "28px Lucida console";
		ctx.fillText("SCORE: " + score, 1500, scoreY); // needs to be visible
		ctx.font = "25px Lucida console";
		ctx.fillText("max. " + highScore, 1500, scoreY + 30);

		ctx.drawImage(spaceCraft, x1, 1700, 200, 100);
		ctx.drawImage(plane, x + 300, 2500, 110, 50);
		ctx.drawImage(plane, x + 200, 2700, 110, 50);
		ctx.drawImage(plane, x - 100, 3000, 110, 50);
		ctx.drawImage(ufo, canvas.width - 600, y, 130, 130);
		x -= xd;
		x1 -= xd1;
		y += yd;
		if (y > 1150) {
			yd = -yd;
		} if (y < 1100) {
			yd = -yd;
		}

		if (perfect) {
			ctx.font = "20px Lucida console";
			ctx.fillText("perfect", 1500, scoreY + 60);
		}

		for (let i = 0; i < tower.length; i++) {
			ctx.drawImage(tower[i].image, tower[i].x, tower[i].y, tower[i].width, tower[i].height); // the image doesn't change		
			ctx.drawImage(column.image, column.x, column.y, column.width, column.height);
		}
	}
};

const loadHighScore = function() {
	highScore = localStorage.getItem("highScore");
};

const saveHighScore = function() {
	localStorage.setItem("highScore", JSON.stringify(score));
};

const setHighScore = function() {
	if (highScore < score) {
		highScore = score;
		saveHighScore();
	}
};

const clearHighScore = function() {
	localStorage.clear(); // intended for console use
};

const youWin = function() {
	if (tower.length >= 42) {
		alert("You win!");
	}
};

const startOver = function() {
		scrollBack();
		setHighScore();
		score = 0;
		scoreWithoutBonus = 0;
		perfect_count = 0;
		tower.length = 0;
		initializeTower();
		initializeColumn();
	};
	
const collision = function() { // removed "+ moving_column.dx"
	if (moving) {
		if (column.x + column.width > canvas.width - 350) {
			column.dx = -column.dx;
		}
		if (column.x < 350) {
			column.dx = -column.dx;	
  		}			
		column.x += column.dx;
	}
};

const buildTower = function() {
	youWin();
	draw();
	collision();
	requestAnimationFrame(buildTower);
};

const initializeTower = function() {
	for (let i = 0; i < initial_height; i++) {
		tower.push({
			x: (canvas.width - column_width)/2,
			y: (i === 0)?canvas.height - column_height : tower[i-1].y - column_height,
			image: images[random(images.length)],
			height: column_height,
			width: column_width,
		});
	}
};

const initializeColumn = function() {
	column = {
			x: 350,
			y: tower[tower.length - 1].y - column_height,
			image: images[random(images.length)],
			height: column_height,
			width: column_width,
			dx: initial_speed,
		};
};

const spacebar = 32;
const i = 73;
const o = 79;
const p = 80;

document.addEventListener("keydown", function(event) {
	if (event.keyCode === spacebar) {
		moving = false;
		if (isGameOver()) {
			alert("Game over!");
			startOver();
		} else {
			setColumn();
		}
		moving = true;
	} if (event.keyCode === i) {
		introInProgress = true;
		stopIntro = false;
		showIntro();
		setInterval(showIntro, 1600); // #bug after some i, o's the speed accelerates
		let interval = setInterval(showIntro, 1600);
	} if (event.keyCode === o) {
		hideIntro();
		let interval = setInterval(showIntro, 1600);
		clearInterval(interval);
	} if (event.keyCode === p) {
		window.scrollTo(0, canvas.height);
	}
}, false);

document.addEventListener("touchstart", function(event) { // for touch events
	if (event.target === canvas) {
		moving = false;
		if (isGameOver()) {
			alert("Game over!");
			startOver();
		} else {
			setColumn();
		}
	}
}, false);

const startGame = function() {
	window.scrollTo(0, canvas.height);
	loadHighScore();
	playAudio();
	initializeTower();
	initializeColumn();
	buildTower();
	scoreNull(); // to get rid of null in max
};

startGame();
