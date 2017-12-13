// TODO add some sick visual effects
// canvas is deleted? we may need scrolldown() before startOver()
// so we can see how far went (works only if there is min 1 move down)
// add money so you can buy extra stuff?
// replace column with moving_column?

// when back pic goes up it should smoothly transist to space
// with a rose in the center (Al-Karmir)
// and Tigrovvy background with some cool electric Blue with Bordoi
// and Tatul music, and Doge be like:
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
backgroundImg.src = "cityNight.png";
// Sega streets of rage
// sound https://en.wikipedia.org/wiki/Streets_of_Rage

const column_height = 50; // better set as the part of the object column.height
const column_width = 300;
const initial_height = 3;
const tower_height_max = 12; // determines starting height to go up from
const move_down = 1.5; // the speed of canvas scope going up
let moving = true; 
let moving_down = false; // if true moves down after the game starts?

const colors = ["#4CB088", "#319589", "#344D6C", "#3E1B3C", "#224732"];
const tower = [];
let moving_column;
let score = 0;
let highScore = 0;
let initial_speed = 3;
let perfect_count = 5; // not clear
let gameInProgress = true; // can't find it anywhere else

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
	score += 4;  // adds more than 4 (sometimes)
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
		x: (moving_column.x <= tower[tower.length -1].x)? tower[tower.length -1].x : moving_column.x,
		y: tower[tower.length -1].y - column_height,
		color: moving_column.color,
		height: column_height,
		width: (moving_column.x <= tower[tower.length -1].x)?
				moving_column.x + moving_column.width - tower[tower.length -1].x :
				tower[tower.length -1].x + tower[tower.length -1].width - moving_column.x,
		dy: move_down
	});
	isPerfect();
};

const updateMovingColumn = function() {
	moving_column.x = 230;
	moving_column.y = tower[tower.length - 1].y - column_height;
	moving_column.color = colors[random(colors.length)];
	moving_column.width = tower[tower.length - 1].width;		
	moving_column.dx = initial_speed + 1 * (score / 10);
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
	if(moving_column.x + moving_column.width <= tower[tower.length -1].x || 
		moving_column.x >= tower[tower.length -1].x + tower[tower.length -1].width ) {
		return true;
	}
	return false;
};
				
const draw = function() {
	ctx.drawImage(backgroundImg, 0, 0, 1707, 960); // low-performance on this pic?
	
	ctx.fillStyle = "#4CB088";
	ctx.font = "30px Monospace";
	ctx.fillText("SCORE: " + score, 20, 50);
	ctx.font = "24px Monospace";
	ctx.fillText("max. " + highScore, 20, 80);

	for(let i = 0; i < tower.length; i++) {
		ctx.fillStyle = tower[i].color;
		ctx.fillRect(tower[i].x, tower[i].y, tower[i].width, tower[i].height);
	}
	ctx.fillStyle = moving_column.color;
	ctx.fillRect(moving_column.x, moving_column.y, moving_column.width, moving_column.height);
};

const setHighScore = function() {
	if(highScore < score) {
		highScore = score;
	}
}

const startOver = function() { // resetGame previously
	setHighScore();
	score = 0;
	perfect_count = 0;
	tower.length = 0;
	initialize_tower();
	initialize_moving_column();
};
	
const makeMove = function() { // removed "+ moving_column.dx"
	if(moving) {
		if(moving_column.x + moving_column.width > canvas.width - 230) {
			moving_column.dx = -moving_column.dx;            // - 230 added
		}
		if(moving_column.x < 230) {
			moving_column.dx = -moving_column.dx;	
  		}			
		moving_column.x += moving_column.dx;
	}
};

const makeMoveDown = function() {
	if(tower[0].y + tower[0].dy >= canvas.height ) {
		tower.shift();         // ??? better not to lose prevous columns GOTO line 2
		moving_down = false;

		// ctx.canvas.height - 100;
		/*I'm thinking of something like this to add
		like not to go down/destroy current columns
		but instead build on it to reach to space GOTO line 7 */
		
	}
	for(let i = 0; i < tower.length; i++) {						
		tower[i].y += tower[i].dy;
	}
	moving_column.y += moving_column.dy;			
};	

const build_tower = function() {
	if(moving_down)  // not sure what it does but scared to remove
	makeMoveDown();  // cuz dat boi crashes stuff :)
	draw();			 // who will win? hundreds of lines of code vs one little error boi
	makeMove();		 // ok I should stop trollin' in here
	requestAnimationFrame(build_tower);
};

const initialize_tower = function() {
	for(let i = 0; i < initial_height; i++) {
		tower.push({
			x: (canvas.width - column_width)/2,
			y: (i === 0)?canvas.height - column_height : tower[i-1].y - column_height,
			// wouldn't it be easier to make column.height an object
			color: colors[random(colors.length)],
			height: column_height,
			width: column_width,
			dy: move_down
		});
	}
};

const initialize_moving_column = function() {
	moving_column = {
				x: 230,
				y: tower[tower.length - 1].y - column_height,
				color: colors[random(colors.length)],
				height: column_height,
				width: column_width,
				dx: initial_speed,
				dy: move_down
			};
};

const start_game = function() {
	initialize_tower();
	initialize_moving_column();
	build_tower();
};

start_game(); 
// Yeyyyyyy.
// Hayko Toweri blockner@ sarqi.
// please
