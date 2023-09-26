function draw(){
    // drawing cells
    canvas.addEventListener('mousedown', (e) => {
      x = e.offsetX;
      y = e.offsetY;
      game.makeAlive(x,y);
      isDrawing = true;
    });
  
    canvas.addEventListener('mousemove', (e) => {
      if (isDrawing) {
        x = e.offsetX;
        y = e.offsetY;
        game.makeAlive(x,y);
      }
    });
  
    document.addEventListener('mouseup', (e) => {
      if (isDrawing) {
        x = 0;
        y = 0;
        isDrawing = false;
      }
    });
  }