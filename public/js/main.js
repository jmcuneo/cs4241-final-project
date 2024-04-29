// Control Constants
const MOVE_LEFT = 'ArrowLeft';
const MOVE_RIGHT = 'ArrowRight';
const SOFT_DROP = 'ArrowDown';
const ROTATE_CLOCKWISE = 'x';
const ROTATE_COUNTER_CLOCKWISE = 'z';
const HARD_DROP = ' ';
const RESTART = 'r';
const START = 's';


// Game board
class Board {
  constructor(width, height, cS) {
      this.score = 0;
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
      this.isGameActive = false;
      this.gameOver = false;
      
  }

  initBoard() {
    for(let y = 0; y < boardHeight; y++) {
        let row = [];

        for(let x = 0; x < boardWidth; x++) {
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

  // hard drop the active piece to the bottom of the board
  hardDrop() {
    while(this.movePieceDown() == 0){
      this.updateScore(2);
    }
  }
  
  // return 1 if move makes it to the bottom, 0 otherwise
  movePieceDown() {
    // try moving a copy of the active piece down first, if it hits something then don't let the active piece move
    let dummyPiece = Object.assign(Object.create(Object.getPrototypeOf(this.activePiece)), this.activePiece);
    dummyPiece.move(dummyPiece, dummyPiece.x, dummyPiece.y + 1);
    if(!this.hasPieceNotReachedBottom(dummyPiece)) {
      this.lockInPiece();
      return 1
    }
    else {
      this.activePiece.move(this.activePiece, this.activePiece.x, this.activePiece.y + 1);
      return 0
    }
  }

  drawBoard() {
    this.drawBackground();

    this.cells.forEach((row) => {
      row.forEach((cell) => {
        if(!cell.isEmpty) {
          cell.draw();
        }
      });
    });

    this.activePiece.draw();
  }

  // grabs the next piece from the queue
  spawnPiece() {
    let piece = next.getNextPiece();
    piece.setCanvas('board');
    this.activePiece = Object.assign(Object.create(Object.getPrototypeOf(piece)), piece);
    this.activePiece.x = 3;
    this.activePiece.y = 0;
    this.activePiece.draw();

    // check for loss condition
    if(!this.hasPieceNotReachedBottom(this.activePiece)) {
      this.isGameActive = false;
      this.gameOver = true;
      showGameOver();
      console.log("game over")
      sendScore(this.score);
    }
  }



  // converts active piece to cells (eg. for when a piece reaches the bottom of the board)
  lockInPiece() { 
    for(let row = 0; row < this.activePiece.shape.length; row++) {
        for(let col = 0; col < this.activePiece.shape[row].length; col++) {
            if(this.activePiece.shape[row][col] == 1) {
                let x = this.activePiece.x + col;
                let y = this.activePiece.y + row;
                this.cells[y][x] = new Cell(false, this.activePiece.color, x, y);
            }
        }
    }

    this.spawnPiece();
  }

  // returns true if piece's location is valid given the current state of the board cells
  hasPieceNotReachedBottom(piece) {
    for(let row = 0; row < piece.shape.length; row++){
      for(let col = 0; col < piece.shape[row].length; col++) {
        if(piece.shape[row][col] == 1) {
          let x = piece.x + col;
          let y = piece.y + row;

          if(y > 19) {
            return false;
          }
          else if(!this.cells[y][x].isEmpty) {
            return false;
          }
        }
      }
    }

    return true;
  }

  isPieceInBounds(piece) {
    for(let row = 0; row < piece.shape.length; row++){
      for(let col = 0; col < piece.shape[row].length; col++) {
        if(piece.shape[row][col] == 1) {
          let x = piece.x + col;
          let y = piece.y + row;

          if(x < 0 || x >= boardWidth || y < 0 || y >= boardHeight || !this.cells[y][x].isEmpty) {
            return false;
          }
        }
      }
    }

    // Return true only after checking all cells of the piece
    return true;
  }
  

  updateScore(scoreToAdd){
    var csElement = document.getElementById("currentScore");
    this.score = this.score + scoreToAdd
    csElement.innerHTML = this.score

    var hsElement = document.getElementById("highScore");
    if(hsElement.innerHTML < this.score){
      hsElement.innerHTML = this.score;
      getLeaderboard(this.score);
    }
  }

  // helper function to check if an individual row at cells[index] has been filled
  isRowFilled(index) {
    for(let col = 0; col < boardWidth; col++){
      if(this.cells[index][col].isEmpty) {
        return false;
      }
    }

    return true;
  }

  // helper function to remove an individual row from the board and add a blank one to the top
  clearRow(index) {
    // Remove the row at the given index
    this.cells.splice(index, 1);
  
    // Create a new row
    let row = [];
    for(let x = 0; x < boardWidth; x++) {
      row.push(new Cell(true, 'gray', x, 0));  // The y-coordinate is 0 for the new top row
    }
  
    // Add the new row at the top of the cells array
    this.cells.unshift(row);
  
    // Update the y-coordinates of all cells
    for(let y = 0; y < boardHeight; y++) {
      for(let x = 0; x < boardWidth; x++) {
        this.cells[y][x].y = y;
      }
    }

    levelRows--;
    if(levelRows == 0){
      levelRows += 10
      fps += 0.5
      prevSpeed += 0.5
    }
  }
  
  // clears all filled rows on the board, and returns the appropriate score for the rows cleared (or 0 if none cleared)
  clearFilledRows() {
    let rowsCleared = 0;

    for(let row = 0; row < boardHeight; row++){
      if(this.isRowFilled(row)){
        this.clearRow(row);
        rowsCleared++;
      }
    }
    switch (rowsCleared) {
      case 1:
        this.updateScore(100)
        break;
      case 2:
        this.updateScore(300)
        break;
      case 3:
        this.updateScore(500)
        break;
      case 4:
        this.updateScore(800)
        break;
    }
  }
}

// Represents a single cell on the game board
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


/*
Represents a piece that hasn't been placed on the board
Palette is adapted from Bang Wong's "Points of view: Color blindness" (https://doi-org.ezpv7-web-p-u01.wpi.edu/10.1038/nmeth.1618)
*/
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
    super([[0, 0, 0, 0,], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0,]], "rgb(86 180 233)",
    {0: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], 90: [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
     180: [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]], 270: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]}, canvasName);
  }
}

class PieceJ extends Piece {
  constructor(canvasName = 'board') {
    super([[1, 0, 0], [1, 1, 1], [0, 0, 0]], "rgb(0 114 178)",
    {0: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], 90: [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
      180: [[0, 0, 0], [1, 1, 1], [0, 0, 1]], 270: [[0, 1, 0], [0, 1, 0], [1, 1, 0]]}, canvasName);
  }
}

class PieceL extends Piece {
  constructor(canvasName = 'board') {
    super([[0, 0, 1], [1, 1, 1], [0, 0, 0]], "rgb(230 159 0)",
    {0: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], 90: [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
      180: [[0, 0, 0], [1, 1, 1], [1, 0, 0]], 270: [[1, 1, 0], [0, 1, 0], [0, 1, 0]]},canvasName);
  }
}

class PieceO extends Piece {
  constructor(canvasName = 'board') {
      super([[1, 1], [1, 1]], "rgb(240 228 66)",
      {0: [[1, 1], [1, 1]], 90: [[1, 1], [1, 1]], 
        180: [[1, 1], [1, 1]], 270: [[1, 1], [1, 1]]}, canvasName);
  }
}

class PieceS extends Piece {
  constructor(canvasName = 'board') {
      super([[0, 1, 1], [1, 1, 0], [0, 0, 0]], "rgb(0 158 115)", 
      {0: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], 90: [[0, 1, 0], [0, 1, 1], [0, 0, 1]], 
        180: [[0, 0, 0], [0, 1, 1], [1, 1, 0]], 270: [[1, 0, 0], [1, 1, 0], [0, 1, 0]]}, canvasName);
  }
}

class PieceT extends Piece {
  constructor(canvasName = 'board') {
      super([[0, 1, 0], [1, 1, 1]], "rgb(204 121 167)",
      {0: [[0, 1, 0], [1, 1, 1]], 90: [[0, 1, 0], [0, 1, 1], [0, 1, 0]], 
        180: [[0, 0, 0], [1, 1, 1], [0, 1, 0]], 270: [[1, 1, 0], [0, 1, 0], [0, 1, 0]]}, canvasName);
  }
}

class PieceZ extends Piece {
  constructor(canvasName = 'board') {
      super([[1, 1, 0], [0, 1, 1], [0, 0, 0]], "rgb(213 94 0)",
      {0: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], 90: [[0, 0, 1], [0, 1, 1], [0, 1, 0]], 
        180: [[0, 0, 0], [1, 1, 0], [0, 1, 1]], 270: [[0, 1, 0], [1, 1, 0], [1, 0, 0]]}, canvasName);
  }
}


// View
class Next {
  constructor(bW, bH, cS) {
    this.cellSize = cS;
    this.canvas = document.getElementById('next');
    this.ctx = this.canvas.getContext('2d');
    this.width = bW/2;
    this.height = bH;
    this.canvas.width = this.width * cS;
    this.canvas.height = this.height * cS;
    this.pieceQueue = [];
    this.drawBackground();
  }

  drawBackground() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderPieces(){
    this.pieceQueue.forEach((piece, i) => {
      piece.x = 1;
      piece.y = (i + 0.25) * 4;
      piece.draw();
    })
  }


  drawQueue() {
    this.pieceQueue.forEach((piece) => {
        this.drawPiece(piece)
    })
  }

  getRandomPiece() {
    let pieceNumber = Math.floor(Math.random() * 6);
    switch (pieceNumber) {
      case 0:
        return new PieceI('next');
      case 1:
        return new PieceJ('next');
      case 2:
        return new PieceL('next');
      case 3:
        return new PieceO('next');
      case 4:
        return new PieceS('next');
      case 5:
        return new PieceZ('next');
    }
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

// Controller
// Settings
var cellSize = 25;
var boardWidth = 10;
var boardHeight = 20;
let board = new Board(boardWidth, boardHeight, cellSize);
let next = new Next(boardWidth, boardHeight, cellSize);

// Game Control Settings
var fps = 2; // controls the speed of the game in frames per second
var prevSpeed = 2;
const SOFTDROP_MULTIPLIER = 4;
var levelRows = 10;

// Main game loop
// Initializes game
function init() {
  next.initQueue()
  board.spawnPiece();
  board.drawBoard();
  setTimeout(() => {
    requestAnimationFrame(nextFrame);
  }, 1000 / fps);
}

// Advances game one frame
function nextFrame() {
  board.movePieceDown();
  board.drawBoard();
  next.drawBackground();
  next.renderPieces();
  board.clearFilledRows();

  if(board.isGameActive) {
    setTimeout(() => {
      requestAnimationFrame(nextFrame);
    }, 1000 / fps);
  }
}

// Side Functions
window.onload = function() {
  displayHighScore();
  board.updateScore(0)
};

async function getLeaderboard(score){
  var response = await fetch("/getScores", {
    method:"GET"
  })
  var text = await response.text();
  let leaderboardScores = JSON.parse(text);
  let leaderScore = leaderboardScores[0].score;

  if(score > leaderScore){
    alertNewHighScore("global")
  }else{
    alertNewHighScore("personal");
  }

}

async function displayHighScore(){
  var hsElement = document.getElementById("highScore");
  var response = await fetch ( "/getHighScore", {
    method:"GET"
  })
  var text = await response.text();
  let highScore = JSON.parse(text);
  if(highScore.length!=0){
    hsElement.innerHTML = highScore[0].score;
  } else {
    hsElement.innerHTML = "0"
  }
}

async function sendScore(score){
  let json = { score: score }
  let body = JSON.stringify( json );

  // Makes the post request with the body data
  const response = await fetch( "/submitScore", {
    method:"POST",
    body 
  })

  // Resets the forms to clear the values and then refreshes the table data to reflect changes
  const text = await response.text();
}

board.drawBackground()

// Handling game inputs
document.addEventListener(
  "keydown",
  (event) => {

    if(board.isGameActive){
      const keyName = event.key;

      let dummyPiece = Object.assign(Object.create(Object.getPrototypeOf(board.activePiece)), board.activePiece);
      switch (keyName) {
        case ROTATE_COUNTER_CLOCKWISE:
          dummyPiece.rotate(-90);
          if(board.isPieceInBounds(dummyPiece)) {
            board.activePiece.rotate(-90);
            board.drawBoard();
          }
          break;
        case ROTATE_CLOCKWISE:
          dummyPiece.rotate(90);
          if(board.isPieceInBounds(dummyPiece)) {
            board.activePiece.rotate(90);
            board.drawBoard();
          }
          break;
        case MOVE_LEFT:
          dummyPiece.move(dummyPiece, dummyPiece.x-1, dummyPiece.y);
          if(board.isPieceInBounds(dummyPiece)) {
            board.activePiece.move(board.activePiece, board.activePiece.x-1, board.activePiece.y);
            board.drawBoard();
          }
          break;
        case MOVE_RIGHT:
          dummyPiece.move(dummyPiece, dummyPiece.x+1, dummyPiece.y);
          if(board.isPieceInBounds(dummyPiece)) {
            board.activePiece.move(board.activePiece, board.activePiece.x+1, board.activePiece.y);
            board.drawBoard();
          }
          break;
        case HARD_DROP:
          board.hardDrop();
          break;
        case SOFT_DROP:
          fps *= SOFTDROP_MULTIPLIER;
          break;
        case RESTART:
          window.location.reload();
          break;
      }
    } else {
      const keyName = event.key;
      switch(keyName){
        case RESTART:
          window.location.reload();
          break;
        case START:
          if(!board.gameOver){
            board.isGameActive = true;
            hideStart();
            init();
          }
          break;
      }
    }
  },
  false,
);

document.addEventListener('keyup', (event) => {
  if(board.isGameActive){
    const keyName = event.key;
    if(keyName == SOFT_DROP){
      fps = prevSpeed;
    }
  }
}, false);


function flipCanvas() {
  let element = document.getElementById('board'); // Replace 'board' with the id of your element
  element.style.transform = 'scaleY(1)'; // Replace '1' with the scale factor you want
}

function flipCanvasDown() {
  let element = document.getElementById('board'); // Replace 'board' with the id of your element
  element.style.transform = 'scaleY(-1)'; // Replace '1' with the scale factor you want
}

function hideStart(){
  let element = document.getElementById('game-message');
  element.style.visibility = 'hidden';
}

function alertNewHighScore(type){
  let element = document.getElementById('game-message')
  element.innerHTML = "New " + type + " high score!"
  element.style.visibility = 'visible'
}

function showGameOver(){
  let element = document.getElementById('game-over');
  element.style.visibility = 'visible';
}