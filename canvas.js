// TODO add some sick visual effects
// canvas is deleted? we may need scrolldown() before startOver()
// so we can see how far went (works only if there is min 1 move down)
// add money so you can buy extra stuff?
// replace column with moving_column?

// stars stuff

// when back pic goes up it should smoothly transist to space
// with a rose in the center (Al-Karmir)
// and Tigrovvy background with some cool electric Blue with Bordoi
// and Tatul music, and Doge be like:

// Switzerland alp
// Japan Sakura
// night city
// server

// github website

// many romantic, very luv, such xore ~
// #վարագույր

// make the UI/UX feel like retro
// for example blinking column
// gif-like animations

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth; // screen.width
ctx.canvas.height = window.innerHeight; // screen.height

const backgroundImg = new Image();
backgroundImg.src = "cityNight1.png";
// Sega streets of rage
// sound https://en.wikipedia.org/wiki/Streets_of_Rage
// we should build a skysaper instead of blocks

const column_height = 50;
const column_width = 300;
const initial_height = 3;
const tower_height_max = 12 ; // determines starting height to go up from
const move_down_speed = 1.5; // the speed of canvas scope going up
let moving = true; 
let moving_down = false;

const colors = ["#9F5F20", "#004969", "#008080", "#3E1B3C", "#224732"];
const tower = [];
let column;
let score = 0;
let highScore = 0;
let initial_speed = 3;
let perfect_count = 5;

const spacebar = 32;

document.addEventListener("keydown", function(event) {
	if(event.keyCode === spacebar) {
		moving = false;
		if(isGameOver()) {
			alert("The Game is Over");
			startOver();
		} else {
			setColumn();
		}
		moving = true;
	}
}, false);

const random = function(num) {
	return Math.floor(Math.random() * num);
};

const addBonus = function() {
	score += 4;  // adds 5 bonus should let the user know
	perfect_count = 0;
};

const isPerfect = function() {
	if (tower.length < 2) {
		return;
	}
	if (Math.abs(tower[tower.length - 1].x - tower[tower.length - 2].x) <= 10 &&
	Math.abs(tower[tower.length - 1].width - tower[tower.length - 2].width) <= 10) {
		perfect_count++;
	}    
	if (perfect_count >= 5) {
		addBonus();
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

const updateMovingColumn = function() {
	column.x = 350;
	column.y = tower[tower.length - 1].y - column_height;
	column.color = colors[random(colors.length)];
	column.width = tower[tower.length - 1].width;		
	column.dx = initSpeed + 1.5 * (score / 10); // change
};

const setColumn = function() {
	score++;
	addColumnToTower();
	updateMovingColumn();	
	
	if(tower.length >= tower_height_max) {
		moving_down = true;							
	}							
};

const isGameOver = function() {
	if(column.x + column.width <= tower[tower.length -1].x || 
		column.x >= tower[tower.length -1].x + tower[tower.length -1].width ) {
		return true;
	}
	return false;
};
				
const draw = function() {
	ctx.drawImage(backgroundImg, 0, 0, 1707, 960);
	
	ctx.fillStyle = "#4CB088";
	ctx.font = "30px Monospace";
	ctx.fillText("SCORE: " + score, 20, 50);
	ctx.font = "24px Monospace";
	ctx.fillText("max. " + highScore, 20, 80);

	for(let i = 0; i < tower.length; i++) {
		ctx.fillStyle = tower[i].color;
		ctx.fillRect(tower[i].x, tower[i].y, tower[i].width, tower[i].height);
	}
	ctx.fillStyle = column.color;
	ctx.fillRect(column.x, column.y, column.width, column.height);
};

const setHighScore = function() { // location.reload() to stay
	if(highScore < score) {
		highScore = score;
	}
}

const startOver = function() { // resetGame previously
	setHighScore();
	score = 0;
	perfect_count = 0;
	tower.length = 0;
	initializeTower();
	initializeColumn();
};
	
const makeMove = function() { // removed "+ moving_column.dx"
	if(moving) {
		if(column.x + column.width > canvas.width - 350) {
			column.dx = -column.dx;
		}
		if(column.x < 350) {
			column.dx = -column.dx;	
  		}			
		column.x += column.dx;
	}
};

const makeMoveDown = function() {
	if(tower[0].y + tower[0].dy >= canvas.height ) {
		tower.shift();         // ??? better not to lose previous columns GOTO line 2
		moving_down = false;

		// ctx.canvas.height - 100;
		/*I'm thinking of something like this to add
		like not to go down/destroy current columns
		but instead build on it to reach to space GOTO line 7 */
		
	}
	for(let i = 0; i < tower.length; i++) {						
		tower[i].y += tower[i].dy;
	}
	column.y += column.dy;			
};	

const buildTower = function() {
	if(moving_down)  // not sure what it does but scared to remove
	makeMoveDown();  // cuz dat boi crashes stuff :)
	draw();			 // who will win? hundreds of lines of code vs one little error boi
	makeMove();		 // ok I should stop trollin' in here
	requestAnimationFrame(buildTower);
};

const initializeTower = function() {
	for(let i = 0; i < initial_height; i++) {
		tower.push({
			x: (canvas.width - column_width)/2,
			y: (i === 0)?canvas.height - column_height : tower[i-1].y - column_height,
			// wouldn't it be easier to make column.height an object
			color: colors[random(colors.length)],
			height: column_height,
			width: column_width,
			dy: move_down_speed
		});
	}
};

const initializeMovingColumn = function() {
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

const startGame = function() {
	initializeTower();
	initializeMovingColumn();
	buildTower();
};

startGame(); 
