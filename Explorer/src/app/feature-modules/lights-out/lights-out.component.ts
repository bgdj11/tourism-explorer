import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'xp-lights-out',
  templateUrl: './lights-out.component.html',
  styleUrls: ['./lights-out.component.css']
})

export class LightsOutComponent implements OnInit {
  gridSize = 5;
  grid: boolean[][] = [];

  ngOnInit() {
    this.initializeGrid();
  }

  initializeGrid() {
    this.grid = Array.from({ length: this.gridSize }, () =>
      Array.from({ length: this.gridSize }, () => Math.random() < 0.5)
    );
  }

  toggle(x: number, y: number) {
    const toggleCell = (i: number, j: number) => {
      if (i >= 0 && i < this.gridSize && j >= 0 && j < this.gridSize) {
        this.grid[i][j] = !this.grid[i][j];
      }
    };

    toggleCell(x, y);           // self
    toggleCell(x - 1, y);       // up
    toggleCell(x + 1, y);       // down
    toggleCell(x, y - 1);       // left
    toggleCell(x, y + 1);       // right

    if (this.checkWin()) {
      setTimeout(() => {
        alert('Congratulations! You turned off all the lights!');
        this.initializeGrid();
      }, 100);
    }
  }

  checkWin(): boolean {
    return this.grid.flat().every(cell => !cell);
  }

  restartGame() {
    this.initializeGrid();
  }
}
