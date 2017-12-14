// TODO
// FINALIZZZEEEE!

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width  = 1707; // plans to make responsive
canvas.height = 960;
document.body.style.zoom = "90%" // make 90% zoom by default

const column_height = 50;
const column_width = 300;
const initial_height = 3;
const tower_height_max = 8; // determines starting height to go up from
const move_down_speed = 1.5; // the speed of canvas scope going up
let moving = true; 
let moving_down = false;

const colors = ["#9F5F20", "#004969", "#008080", "#3E1B3C", "#224732"]; // add columns
const tower = [];
let column;
let score = 0;
let scoreWithoutBonus = score;
let highScore = 0;
let initial_speed = 3;
let perfect_count = 0;

const playAudio = function() {
	song = new Audio("sounds/song.mp3");
	song.loop = true;
	song.volume = .02;
	song.play();
}; 

const random = function(num) {
	return Math.floor(Math.random() * num);
};

const addBonus = function() {
	score += 4;  // adds 4 bonus + 1 point
	perfect_count = 0;
};

const isPerfect = function() {   /// should have antother perfect without _count
	if (tower.length === initial_height) {
		return;
	}
	if (Math.abs(tower[tower.length - 1].x - tower[tower.length - 2].x) <= 6 &&
	Math.abs(tower[tower.length - 1].width - tower[tower.length - 2].width) <= 6) {
		perfect_count++;
	}
	if (perfect_count >= 5) {
		addBonus();
		scoreWithoutBonus = score - 5; // needed for proper acceleration
	}
};

const addColumnToTower = function() {
	tower.push({
		x: (column.x <= tower[tower.length -1].x)? tower[tower.length -1].x : column.x,
		y: tower[tower.length -1].y - column_height,
		color: column.color,
		height: column_height,
		width: (column.x <= tower[tower.length -1].x)?
				column.x + column.width - tower[tower.length -1].x :
				tower[tower.length -1].x + tower[tower.length -1].width - column.x,
		dy: move_down_speed
	});
	isPerfect();
};

const newColumn = function() {
	column.x = 350;
	column.y = tower[tower.length - 1].y - column_height;
	column.color = colors[random(colors.length)];
	column.width = tower[tower.length - 1].width;		
	column.dx = initial_speed + 1.5 * (scoreWithoutBonus / 10); // removed (score / 10);
};

const setColumn = function() {
	score++;
	scoreWithoutBonus++;
	addColumnToTower();
	newColumn();	
	
	if (tower.length >= tower_height_max) {
		moving_down = true;							
	}							
};

const isGameOver = function() {
	if (column.x + column.width <= tower[tower.length -1].x || 
		column.x >= tower[tower.length -1].x + tower[tower.length -1].width ) {
		return true;
	}
	return false;

	// outro scene
};

const background = new Image();
background.src = "pictures/city.png";	

const introImg = new Image();
introImg.src = "pictures/sticker.jpg"

let introInProgress = false;

const showIntro = function() { // call this function to show intro
	introInProgress = true;
	ctx.drawImage(introImg, 0, 0, canvas.width, canvas.height);
};

const hideIntro = function() {
	introInProgress = false;
};
				
const draw = function() {
	if (!introInProgress) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
			/*ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // resize*/

		ctx.fillStyle = "#4CB088";
		ctx.font = "28px Lucida console";
		ctx.fillText("SCORE: " + score, 20, 50); // needs to be visible
		ctx.font = "25px Lucida console";
		ctx.fillText("max. " + highScore, 20, 80);

		for (let i = 0; i < tower.length; i++) {
		ctx.fillStyle = tower[i].color;
		ctx.fillRect(tower[i].x, tower[i].y, tower[i].width, tower[i].height);
		}
		ctx.fillStyle = column.color;
		ctx.fillRect(column.x, column.y, column.width, column.height);
	}
};

const loadHighScore = function() {
	highScore = localStorage.getItem("highScore");
	// localStorage.clear();
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

const startOver = function() {
		setHighScore();
		score = 0;
		perfectfect_count = 0;
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

const makeMoveDown = function() {
	if (tower[0].y + tower[0].dy >= canvas.height ) {
		tower.shift();
		moving_down = false;
	}
	for (let i = 0; i < tower.length; i++) {						
		tower[i].y += tower[i].dy;
	}
	column.y += column.dy;			
};		

const buildTower = function() {
	if (moving_down)
	makeMoveDown();
	draw();
	collision();
	requestAnimationFrame(buildTower);
};

const initializeTower = function() {
	for (let i = 0; i < initial_height; i++) {
		tower.push({
			x: (canvas.width - column_width)/2,
			y: (i === 0)?canvas.height - column_height : tower[i-1].y - column_height,
			color: colors[random(colors.length)],
			height: column_height,
			width: column_width,
			dy: move_down_speed
		});
	}
};

const initializeColumn = function() {
	column = {
			x: 350,
			y: tower[tower.length - 1].y - column_height,
			color: colors[random(colors.length)],
			height: column_height,
			width: column_width,
			dx: initial_speed,
			dy: move_down_speed
		};
};

const spacebar = 32;
const i = 73;
const o = 79;

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
		showIntro();
	} if (event.keyCode === o) {
		hideIntro();
	}
}, false);

/*document.addEventListener("touchstart", function(event) { // for touch events
	if (event.target === canvas) {
		moving = false;
		if (isGameOver()) {
			alert("Game over!");
			startOver();
		} else {
			setColumn();
		}
		moving = true;
	}
}, false);*/

const startGame = function() {
	loadHighScore();
	playAudio();
	initializeTower();
	initializeColumn();
	buildTower();
};

startGame(); 
