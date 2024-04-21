

class Board {
  constructor(width, height, cellSize) {
      this.width = width;
      this.height = height;
      this.cellSize = cellSize;
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

// Usage
let board = new Board(10, 20, 25);
board.drawBackground();