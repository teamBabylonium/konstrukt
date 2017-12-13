const canvas = document.querySelector("canvas"); // select by id
const ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth; // better write css
ctx.canvas.height = window.innerHeight;

const backgroundImg = new Image();
backgroundImg.src = "cityNight.png"; //
// Sega streets of rage
// sound https://en.wikipedia.org/wiki/Streets_of_Rage
// we should build a skysaper instead of blocks

const update = function() {

};

const draw = function() {

};

const loop = function() {
	update();
	draw();
	requestAnimationFrame(loop);
}

/*ctx.drawImage(backgroundImg, 0, 0, 1707, 960);*/ // need to make background responsive