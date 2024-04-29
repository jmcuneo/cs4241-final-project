class Piece {
    constructor(shape, color, orientations, canvasName) {
      this.ctx = document.getElementById(canvasName).getContext('2d');
      this.shape = shape;
      this.color = color;
      this.x = 0;
      this.y = 0;
      this.angle = 0;
      this.orientations = orientations;
    }
  
    draw() {
      this.shape.forEach((row, i) => {
          row.forEach((value, j) => {
              if (value > 0) {
                  this.ctx.fillStyle = this.color;
                  this.ctx.fillRect((this.x + j) * cellSize, (this.y + i) * cellSize, cellSize, cellSize);
              }
          });
      });   
    }
  
    setCanvas(canvas) {
      this.ctx = document.getElementById(canvas).getContext('2d');
    }
  
    rotate(dir) {
      this.angle = (this.angle + dir) % 360
      if(this.angle < 0){this.angle += 360}
      this.shape = this.orientations[this.angle]
    }
  
    move(piece, x, y){
      piece.x = x
      piece.y = y
    } 
  
  }
  
  class PieceI extends Piece {
    constructor(canvasName = 'board') {
      super([[0, 0, 0, 0,], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0,]], 'cyan',
      {0: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], 90: [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
       180: [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]], 270: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]}, canvasName);
    }
  }
  
  class PieceJ extends Piece {
    constructor(canvasName = 'board') {
      super([[1, 0, 0], [1, 1, 1], [0, 0, 0]], 'blue',
      {0: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], 90: [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
        180: [[0, 0, 0], [1, 1, 1], [0, 0, 1]], 270: [[0, 1, 0], [0, 1, 0], [1, 1, 0]]}, canvasName);
    }
  }
  
  class PieceL extends Piece {
    constructor(canvasName = 'board') {
      super([[0, 0, 1], [1, 1, 1], [0, 0, 0]], 'orange',
      {0: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], 90: [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
        180: [[0, 0, 0], [1, 1, 1], [1, 0, 0]], 270: [[1, 1, 0], [0, 1, 0], [0, 1, 0]]},canvasName);
    }
  }
  
  class PieceO extends Piece {
    constructor(canvasName = 'board') {
        super([[1, 1], [1, 1]], 'yellow',
        {0: [[1, 1], [1, 1]], 90: [[1, 1], [1, 1]], 
          180: [[1, 1], [1, 1]], 270: [[1, 1], [1, 1]]}, canvasName);
    }
  }
  
  class PieceS extends Piece {
    constructor(canvasName = 'board') {
        super([[0, 1, 1], [1, 1, 0], [0, 0, 0]], 'green', 
        {0: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], 90: [[0, 1, 0], [0, 1, 1], [0, 0, 1]], 
          180: [[0, 0, 0], [0, 1, 1], [1, 1, 0]], 270: [[1, 0, 0], [1, 1, 0], [0, 1, 0]]}, canvasName);
    }
  }
  
  class PieceT extends Piece {
    constructor(canvasName = 'board') {
        super([[0, 1, 0], [1, 1, 1]], 'purple',
        {0: [[0, 1, 0], [1, 1, 1]], 90: [[0, 1, 0], [0, 1, 1], [0, 1, 0]], 
          180: [[0, 0, 0], [1, 1, 1], [0, 1, 0]], 270: [[1, 1, 0], [0, 1, 0], [0, 1, 0]]}, canvasName);
    }
  }
  
  class PieceZ extends Piece {
    constructor(canvasName = 'board') {
        super([[1, 1, 0], [0, 1, 1], [0, 0, 0]], 'red',
        {0: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], 90: [[0, 0, 1], [0, 1, 1], [0, 1, 0]], 
          180: [[0, 0, 0], [1, 1, 0], [0, 1, 1]], 270: [[0, 1, 0], [1, 1, 0], [1, 0, 0]]}, canvasName);
    }
  }
  