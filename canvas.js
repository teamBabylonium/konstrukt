// canvas height constantly added?
// replace context with ctx
// redefined some variables for clarity

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const backgroundImg = new Image();
backgroundImg.src = ""; //https://s3.envato.com/files/170596024/City_Background_Ny_4267x2133.jpg or 
//https://s3.envato.com/files/162652205/City_Background_4267x2133.jpg

const column_height = 50;
const column_width = 200;
const initial_height = 3;
const tower_height_max = 12;
const move_down = 1;
let moving = true; 
let moving_down = false;

const colors = ["Red", "Green", "Blue", "Yellow"];
const tower = [];
let moving_column;
let level = 0;
let initial_speed = 3;
let perfect_count = 0;

const spacebar = 32;

document.addEventListener("keydown", function(event) {
	if(event.keyCode === spacebar) {
		moving = false;
		if(isGameOver()) {
			alert("The Game is Over");
			resetGame();
		} else {
			setColumn();
		}
		moving = true;
	}
}, false); 

const isPerfect = function() {
	if (tower.length < 2) {
		return;
                    }
	if (Math.abs(tower[tower.length - 1].x - tower[tower.length - 2].x) <= 10 &&
	Math.abs(tower[tower.length - 1].width - tower[tower.length - 2].width) <=10) {
		perfect_count ++;
                    }    
	if (perfect_count >= 5) {
		level += 4;
		perfect_count = 0;
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
	moving_column.x = 0;
	moving_column.y = tower[tower.length -1].y - column_height;
	moving_column.color = colors[random(colors.length)];
	moving_column.width = tower[tower.length -1].width;		
	moving_column.dx = initial_speed + 1*(level/10);
};

const setColumn = function() {
	level++;
	addColumnToTower();
	updateMovingColumn();	
	
	if(tower.length >= tower_height_max ) {
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
	
let gameInProgress = true;

const random = function(num) {
	return Math.floor(Math.random() * num);
};
					
const draw = function() {
	//ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "White";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "Black";
	ctx.font = "30px Monospace";
	ctx.fillText("SCORE", 20, 50);
	ctx.fillText("" + level, 50, 85);
	for(let i = 0; i < tower.length; i++) {
		ctx.fillStyle = tower[i].color;
		ctx.fillRect(tower[i].x, tower[i].y, tower[i].width, tower[i].height);
	}
	ctx.fillStyle = moving_column.color;
	ctx.fillRect(moving_column.x, moving_column.y, moving_column.width, moving_column.height);
};

const resetGame = function() {
	level = 0;
	perfect_count = 0;
	tower.length = 0;
	initialize_tower();
	initialize_moving_column();
};
	
const makeMove = function() {
	if(moving) {
		if(moving_column.x + moving_column.dx + moving_column.width > canvas.width) {
			moving_column.dx = -moving_column.dx;
			}      	
				if(moving_column.x + moving_column.dx < 0) {
			moving_column.dx = -moving_column.dx;	
  		}			
		moving_column.x += moving_column.dx;
	}
};

const makeMoveDown = function() {
	if(tower[0].y + tower[0].dy >= canvas.height ) {
		tower.shift();
		moving_down = false;
	}
	for(let i = 0; i < tower.length; i++) {						
		tower[i].y += tower[i].dy;
	}
	moving_column.y += moving_column.dy;			
};	

const build_tower = function() {
	if(moving_down)
	makeMoveDown();
	draw();	
	makeMove();
	requestAnimationFrame(build_tower);
};

const initialize_tower = function() {
	for(let i = 0; i < initial_height; i++) {
		tower.push({
			x: (canvas.width - column_width)/2,
			y: (i === 0)?canvas.height - column_height : tower[i-1].y - column_height,
			color: colors[random(colors.length)],
			height: column_height,
			width: column_width,
			dy: move_down
		});
	}
};

const initialize_moving_column = function() {
	moving_column = {
				x: 0,
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
