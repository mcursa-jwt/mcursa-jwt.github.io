
function controls() {
    // wrapper for play/pause simulation
    function playSimulation() {
      interval_id = window.setInterval(() => {
        if (isPlaying) {
          game.runGame();
        }
      }, simulation_timeout)
    }
    // start simulation
    start_btn.addEventListener("click", () => {
      isPlaying = true;
      if (interval_id)
        clearInterval(interval_id);
      playSimulation()
    })
  
    // default, start random
    // to-do: add percentage of cells to randomise, 
    // e.g. 80% will be either 1 or 0, 20% will be 0
    start_rand_btn.addEventListener("click", () => {
      isPlaying = true;
      game.arrayRandomize();
      game.fillArray();
  
      playSimulation()
    })
  
    // pause board
    pause_btn.addEventListener("click", () => {
      if (isPlaying) {
        isPlaying = false;
      }
      clearInterval(interval_id);
    })
  
    // reset board
    reset_btn.addEventListener("click", () => {
      if (isPlaying) {
        isPlaying = false;
      }
      game.gameSetUp();
      game.fillArray();
    })
  
    speed_slider.addEventListener("change", (event) => {
      simulation_timeout = MAX_SIMULATION_TIMEOUT - event.target.value;
      gen_per_sec = 1/(simulation_timeout/1000)
      updateElementValue("speed-label","Speed: "+ gen_per_sec.toFixed(2) +" gen/sec")
      clearInterval(interval_id);
      playSimulation();
    })
  }