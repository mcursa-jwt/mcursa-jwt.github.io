const canvas = document.querySelector("#gamefield")
const reset_btn = document.querySelector("#reset");
const pause_btn = document.querySelector("#pause");
const start_btn = document.querySelector("#start");
const start_rand_btn = document.querySelector("#start-random");
const speed_slider = document.querySelector("#speed-slider")
const ctx = canvas.getContext("2d")


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