

// Model

var cellSize = 25;
var boardWidth = 10;
var boardHeight = 20;

// Background board
class Board {
  constructor(width, height, cS) {
      this.width = width;
      this.height = height;
      this.cellSize = cS;
      this.canvas = document.getElementById('board');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = this.cellSize * this.width;
      this.canvas.height = this.cellSize * this.height;
  }

  drawBackground() {
      this.ctx.fillStyle = 'black';
      this.ctx.strokeStyle = 'grey';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      for (let x = 0; x <= this.canvas.width; x += this.cellSize) {
          this.ctx.beginPath();
          this.ctx.moveTo(x, 0);
          this.ctx.lineTo(x, this.canvas.height);
          this.ctx.stroke();
      }
      for (let y = 0; y <= this.canvas.height; y += this.cellSize) {
          this.ctx.beginPath();
          this.ctx.moveTo(0, y);
          this.ctx.lineTo(this.canvas.width, y);
          this.ctx.stroke();
      }
  }
}

class Piece {
  constructor(shape, color) {
      this.shape = shape;
      this.color = color;
      this.x = 0;
      this.y = 0;
  }

  draw() {
      this.shape.forEach((row, i) => {
          row.forEach((value, j) => {
              if (value > 0) {
                  this.ctx.fillStyle = this.color;
                  this.ctx.fillRect(this.x + j, this.y + i, 1, 1);
              }
          });
      });

  }
}

class PieceI extends Piece {
  constructor() {
      super([[1, 1, 1, 1]], 'cyan');
  }
}

class PieceJ extends Piece {
  constructor() {
      super([[1, 0, 0], [1, 1, 1]], 'blue');
  }
}

class PieceL extends Piece {
  constructor() {
      super([[0, 0, 1], [1, 1, 1]], 'orange');
  }
}

class PieceO extends Piece {
  constructor() {
      super([[1, 1], [1, 1]], 'yellow');
  }
}

class PieceS extends Piece {
  constructor() {
      super([[0, 1, 1], [1, 1, 0]], 'green');
  }
}

class PieceT extends Piece {
  constructor() {
      super([[0, 1, 0], [1, 1, 1]], 'purple');
  }
}

class PieceZ extends Piece {
  constructor() {
      super([[1, 1, 0], [0, 1, 1]], 'red');
  }
}



let board = new Board(boardWidth, boardHeight, cellSize);
board.drawBackground();

// View

class Next {
  constructor(bW, bH, cS) {
      this.canvas = document.getElementById('next');
      this.ctx = this.canvas.getContext('2d');
      this.width = bW/2;
      this.height = bH/2;
      this.canvas.width = this.width * cS;
      this.canvas.height = this.height * cS;
      this.drawBackground();
  }

  drawBackground() {
      this.ctx.fillStyle = 'black';
      this.ctx.strokeStyle = 'grey';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      for (let x = 0; x <= this.canvas.width; x += this.cellSize) {
          this.ctx.beginPath();
          this.ctx.moveTo(x, 0);
          this.ctx.lineTo(x, this.canvas.height);
          this.ctx.stroke();
      }
      for (let y = 0; y <= this.canvas.height; y += this.cellSize) {
          this.ctx.beginPath();
          this.ctx.moveTo(0, y);
          this.ctx.lineTo(this.canvas.width, y);
          this.ctx.stroke();
      }
  }

  drawPiece(piece) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      piece.shape.forEach((row, i) => {
          row.forEach((value, j) => {
              if (value > 0) {
                  this.ctx.fillStyle = piece.color;
                  this.ctx.fillRect(j * 25, i * 25, 25, 25);
              }
          });
      });
  }
}

let next = new Next(boardWidth, boardHeight, cellSize);


// Controller