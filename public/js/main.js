

// Model

var cellSize = 25;
var boardWidth = 10;
var boardHeight = 20;

// Game board
class Board {
  constructor(width, height, cS) {
      this.width = width;
      this.height = height;
      this.cellSize = cS;
      this.canvas = document.getElementById('board');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = this.cellSize * this.width;
      this.canvas.height = this.cellSize * this.height;
      this.activePiece; // the piece that's currently being controlled by the player
      this.cells = []; // the current state of the board (not including the activePiece)
      this.initBoard();
  }

  initBoard() {
    for(let y = 0; y < 20; y++) {
        let row = [];

        for(let x = 0; x < 10; x++) {
            row.push(new Cell(true, 'gray', x, y))
        }

        this.cells.push(row);
    }
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

  drawBoard() {
    this.drawBackground();

    this.cells.forEach((cell) => {
        cell.draw();
    })

    this.activePiece.draw();
  }

  spawnPiece() {
    let piece = next.getNextPiece();
    this.activePiece = piece;
  }

  // converts active piece to cells
  lockInPiece() { 
    for(let row = 0; row < activePiece.shape[0].length; row++) {
        for(let col = 0; col < activePiece.shape[row].length; col++) {
            if(activePiece.shape[row][col] == 1) {
                let x = activePiece.x + row;
                let y = activePiece.y + col;
                this.cells[x][y] = new Cell(false, activePiece.color, x, y);
            }
        }
    }
    this.activePiece = null;
  }

  
}

class Cell {
    constructor(isEmpty, color, x, y) {
        this.isEmpty = isEmpty;
        this.color = color;
        this.ctx = document.getElementById('board').getContext('2d');
        this.cellSize = cellSize;
        this.x = x;
        this.y = y;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
    }
}

class Piece {
  constructor(shape, color, orientations) {
    this.ctx = document.getElementById('board').getContext('2d');
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
  constructor() {
      super([[0, 0, 0, 0,], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0,]], 'cyan', 
      {0: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], 90: [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]], 
       180: [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]], 270: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]});
  }
}

class PieceJ extends Piece {
  constructor() {
      super([[1, 0, 0], [1, 1, 1], [0, 0, 0]], 'blue', 
      {0: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], 90: [[0, 1, 1], [0, 1, 0], [0, 1, 0]], 
        180: [[0, 0, 0], [1, 1, 1], [0, 0, 1]], 270: [[0, 1, 0], [0, 1, 0], [1, 1, 0]]});
  }
}

class PieceL extends Piece {
  constructor() {
      super([[0, 0, 1], [1, 1, 1], [0, 0, 0]], 'orange',
    {0: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], 90: [[0, 1, 0], [0, 1, 0], [0, 1, 1]], 
      180: [[0, 0, 0], [1, 1, 1], [1, 0, 0]], 270: [[1, 1, 0], [0, 1, 0], [0, 1, 0]]});
  }
}

class PieceO extends Piece {
  constructor() {
      super([[1, 1], [1, 1]], 'yellow',
      {0: [[1, 1], [1, 1]], 90: [[1, 1], [1, 1]], 
        180: [[1, 1], [1, 1]], 270: [[1, 1], [1, 1]]});
  }
}

class PieceS extends Piece {
  constructor() {
      super([[0, 1, 1], [1, 1, 0], [0, 0, 0]], 'green', 
      {0: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], 90: [[0, 1, 0], [0, 1, 1], [0, 0, 1]], 
        180: [[0, 0, 0], [0, 1, 1], [1, 1, 0]], 270: [[1, 0, 0], [1, 1, 0], [0, 1, 0]]});
  }
}

class PieceT extends Piece {
  constructor() {
      super([[0, 1, 0], [1, 1, 1]], 'purple',
      {0: [[0, 1, 0], [1, 1, 1]], 90: [[0, 1, 0], [0, 1, 1], [0, 1, 0]], 
        180: [[0, 0, 0], [1, 1, 1], [0, 1, 0]], 270: [[1, 1, 0], [0, 1, 0], [0, 1, 0]]});
  }
}

class PieceZ extends Piece {
  constructor() {
      super([[1, 1, 0], [0, 1, 1], [0, 0, 0]], 'red',
      {0: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], 90: [[0, 0, 1], [0, 1, 1], [0, 1, 0]], 
        180: [[0, 0, 0], [1, 1, 0], [0, 1, 1]], 270: [[0, 1, 0], [1, 1, 0], [1, 0, 0]]});
  }
}

// Instantiate the pieces
let pieceI = new PieceI();
let pieceJ = new PieceJ();
let pieceL = new PieceL();
let pieceO = new PieceO();
let pieceS = new PieceS();
let pieceT = new PieceT();
let pieceZ = new PieceZ();


let board = new Board(boardWidth, boardHeight, cellSize);
board.drawBackground();


// TEST DRAW TEST DRAW TEST DRAW TESRT DAR
// pieceJ.x = 3;
// pieceJ.y = 1;
// pieceJ.rotate(0);
// pieceJ.draw();

pieceZ.x = 3;
pieceZ.y = 1;
pieceZ.rotate(270);
pieceZ.draw();

pieceO.x = 1;
pieceO.y = 17;
pieceO.rotate(0);
pieceO.draw();

// pieceL.x = 3;
// pieceL.y = 1;
// pieceL.rotate(0);
// pieceL.draw();

// pieceI.x = 3;
// pieceI.y = 1;
// pieceI.rotate(90);
// pieceI.draw();

// pieceT.x = 3;
// pieceT.y = 1;
// pieceT.rotate(90);
// pieceT.draw();

// View

class Next {
  constructor(bW, bH, cS) {
      this.canvas = document.getElementById('next');
      this.ctx = this.canvas.getContext('2d');
      this.width = bW/2;
      this.height = bH/2;
      this.canvas.width = this.width * cS;
      this.canvas.height = this.height * cS;
      this.pieceQueue = [];
      this.initQueue();
      this.drawBackground();
  }

  drawBackground() {
      this.ctx.fillStyle = 'black';
      this.ctx.strokeStyle = 'grey';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPiece(piece) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      piece.shape.forEach((row, i) => {
          row.forEach((value, j) => {
              if (value > 0) {
                  this.ctx.fillStyle = piece.color;
                  this.ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
              }
          });
      });
  }

  drawQueue() {
    this.pieceQueue.forEach((piece) => {
        this.drawPiece(piece)
    })
  }

  getRandomPiece() {
    let pieceNumber = Math.floor(Math.random() * 7);
    let pieces = [pieceI, pieceJ, pieceL, pieceO, pieceS, pieceZ];
    return pieces[pieceNumber];
  }

  initQueue() {
    for(let i = 0; i < 5; i++) {
        this.pieceQueue.push(this.getRandomPiece())
    }
  }
  
  getNextPiece() {
    let nextPiece = this.pieceQueue.shift();
    this.pieceQueue.push(this.getRandomPiece());
    return nextPiece;
  }
  
}

let next = new Next(boardWidth, boardHeight, cellSize);


// Controller