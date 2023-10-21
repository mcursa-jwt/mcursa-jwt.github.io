const canvas = document.querySelector("#gamefield")
const reset_btn = document.querySelector("#reset");
const start_btn = document.querySelector("#start");
const start_rand_btn = document.querySelector("#start-random");
const speed_slider = document.querySelector("#speed-slider")
const ctx = canvas.getContext("2d")

//set canvas resolution
var displayWidth = 1280;
var displayHeight = 739;
var scale = 1.5;
canvas.style.width = displayWidth + 'px';
canvas.style.height = displayHeight + 'px';
canvas.width = displayWidth * scale;
canvas.height = displayHeight * scale;



// start
const game = new GameOfLife()
game.gameSetUp()
game.fillArray();


let MAX_SIMULATION_TIMEOUT = 1100; // Higher value is slower, set <input> max at index.html.
let simulation_timeout = MAX_SIMULATION_TIMEOUT - speed_slider.value;
let gen_per_sec = 1/(simulation_timeout/1000)
updateElementValue("speed-label","Speed: "+ gen_per_sec.toFixed(2) +" gen/sec")

let isPlaying = false;
let interval_id = 0;

function program() {
  draw();
  controls();
}

window.onload = () => {
  draw();
  controls();
}