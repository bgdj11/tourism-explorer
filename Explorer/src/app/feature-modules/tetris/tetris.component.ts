import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { COLORS, KEY, LEVEL, POINTS, COLS, ROWS, BLOCK_SIZE } from './Constants/constants';
import { Piece, IPiece } from './piece.component';
import { TetrisService} from "./tetris.service";

@Component({
  selector: 'xp-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.css']
})
export class TetrisComponent implements OnInit {
  @ViewChild('board', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('next', { static: true }) canvasNext: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  ctxNext: CanvasRenderingContext2D;
  board: number[][];
  piece: Piece;
  next: Piece;
  requestId: number;
  points = 0;
  lines = 0;
  level = 0;
  dropInterval = 500; // milisekunde, 500ms = sporije padanje
  lastTime = 0;
  gameOverFlag = false; // Da li je igra završena
  finalScore = 0;
  finalLines = 0;

  constructor(private service: TetrisService) {}

  ngOnInit() {
    this.initBoard();
    this.initNext();
    this.resetGame();
  }

  initBoard() {
    const context = this.canvas.nativeElement.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context for board canvas');
    }
    this.ctx = context;
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  initNext() {
    const context = this.canvasNext.nativeElement.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context for next canvas');
    }
    this.ctxNext = context;
    this.ctxNext.canvas.width = 4 * BLOCK_SIZE;
    this.ctxNext.canvas.height = 4 * BLOCK_SIZE;
    this.ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
  }


  resetGame() {
    this.gameOverFlag = false; // Sakrij pop-up
    this.points = 0;
    this.lines = 0;
    this.level = 0;
    this.dropInterval = 500; // Resetuj brzinu
    this.board = this.getEmptyBoard();
    this.next = new Piece(this.ctx);
    this.piece = new Piece(this.ctx);
    this.next.drawNext(this.ctxNext);
    this.animate();
  }

  play() {
    this.resetGame();
    this.animate();
  }

  animate(now = 0) {
    const deltaTime = now - this.lastTime;
    if (deltaTime > this.dropInterval) {
      this.lastTime = now;
      this.drop();
    }
    this.draw();
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  drop() {
    const p = { ...this.piece, y: this.piece.y + 1 };
    if (this.service.valid(p, this.board)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();

      // Proveri da li je komad stigao do vrha
      if (this.piece.y === 0) {
        this.gameOver();
        return;
      }

      // Inicijalizuj novi komad
      this.piece = this.next;
      this.next = new Piece(this.ctx);
      this.next.drawNext(this.ctxNext);
    }
  }

  gameOver() {
    this.gameOverFlag = true; // Aktiviraj pop-up
    this.finalScore = this.points; // Sačuvaj statistiku
    this.finalLines = this.lines;

    // Zaustavi animaciju igre
    cancelAnimationFrame(this.requestId);
  }

  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.board[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  clearLines() {
    let linesCleared = 0;

    // Prolazimo kroz svaku liniju na tabli
    this.board = this.board.filter(row => {
      if (row.every(cell => cell > 0)) {
        linesCleared++;
        return false; // Obriši popunjeni red
      }
      return true; // Zadrži red koji nije popunjen
    });

    // Dodajemo prazne redove na vrh da bi tabla ostala iste veličine
    while (this.board.length < ROWS) {
      this.board.unshift(Array(COLS).fill(0));
    }

    // Ažuriramo score i lines na osnovu broja obrisanih linija
    this.lines += linesCleared;         // Lines se povećava za broj obrisanih linija
    this.points += linesCleared * 15;   // Score se povećava za 15 po liniji

    // Ubrzaj igru na svake 3 linije
    if (linesCleared > 0 && this.lines % 3 === 0) {
      this.increaseSpeed();
    }
  }

  increaseSpeed() {
    if (this.dropInterval > 100) { // Ograniči minimalni interval
      this.dropInterval -= 50; // Smanji interval za 50ms
    }
  }
  draw() {
    this.ctx.clearRect(0, 0, COLS, ROWS);
    this.piece.draw();
    this.drawBoard();
  }

  drawBoard() {
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY.LEFT || event.keyCode === KEY.RIGHT || event.keyCode === KEY.DOWN) {
      let p = { ...this.piece };
      p.x += event.keyCode === KEY.LEFT ? -1 : event.keyCode === KEY.RIGHT ? 1 : 0;
      p.y += event.keyCode === KEY.DOWN ? 1 : 0;

      if (this.service.valid(p, this.board)) {
        this.piece.move(p);
      }
    }
  }
}
