import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { COLORS, KEY, COLS, ROWS } from './Constants/constants';
import { Piece, IPiece } from './piece.component';
import { TetrisService } from './tetris.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { User } from '../../infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.css']
})
export class TetrisComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('board', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('next',  { static: true }) canvasNext!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  ctxNext!: CanvasRenderingContext2D;

  board: number[][] = [];
  piece!: Piece;
  next!: Piece;
  requestId = 0;
  points = 0;
  lines = 0;
  level = 0;
  dropInterval = 500;
  lastTime = 0;
  gameOverFlag = false;
  finalScore = 0;
  finalLines = 0;
  user!: User;
  scoreSaved = false;

  private ro?: ResizeObserver;     // posmatramo .play-area za promenu veličine

  constructor(private service: TetrisService, private authService: AuthService, private el: ElementRef<HTMLElement>) {
    this.authService.user$.subscribe(u => this.user = u);
  }

  // ---------- INIT ----------
  ngOnInit() {
    this.initBoard();
    this.initNext();
  }
  ngAfterViewInit(): void {
    this.resizeCanvases();                 // odmah prilagodi
    const pa = this.el.nativeElement.closest('.play-area') as HTMLElement | null;
    this.ro = new ResizeObserver(() => this.resizeCanvases());
    if (pa) this.ro.observe(pa);
  }
  ngOnDestroy(): void {
    this.ro?.disconnect();
    cancelAnimationFrame(this.requestId);
  }

  initBoard() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) throw new Error('board ctx');
    this.ctx = ctx;
    // početna transformacija podešava se u resizeCanvases()
  }
  initNext() {
    const ctx = this.canvasNext.nativeElement.getContext('2d');
    if (!ctx) throw new Error('next ctx');
    this.ctxNext = ctx;
  }

  // ---------- LAYOUT / SCALING ----------
  private applyScale(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, cols: number, rows: number, pxPerUnit: number) {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    // CSS dimenzije (vizuelna veličina)
    canvas.style.width  = `${cols * pxPerUnit}px`;
    canvas.style.height = `${rows * pxPerUnit}px`;
    // “prava” rezolucija za oštre ivice
    canvas.width  = Math.floor(cols * pxPerUnit * dpr);
    canvas.height = Math.floor(rows * pxPerUnit * dpr);
    // crtamo u “grid jedinicama” (1 = jedna ćelija)
    ctx.setTransform(pxPerUnit * dpr, 0, 0, pxPerUnit * dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  private resizeCanvases() {
    const playArea  = this.el.nativeElement.closest('.play-area') as HTMLElement | null;
    const container = this.el.nativeElement.querySelector('.container') as HTMLElement | null;
    const sidebar   = this.el.nativeElement.querySelector('.right-column') as HTMLElement | null;
    if (!playArea || !container || !sidebar) return;

    // unutrašnje dimenzije play-area (bez paddinga)
    const pa = getComputedStyle(playArea);
    const padX = parseFloat(pa.paddingLeft) + parseFloat(pa.paddingRight);
    const padY = parseFloat(pa.paddingTop)  + parseFloat(pa.paddingBottom);
    const availW = playArea.clientWidth  - padX;
    const availH = playArea.clientHeight - padY;

    const cs = getComputedStyle(container);
    const colGap = parseFloat(cs.columnGap || '16');
    const rowGap = parseFloat(cs.rowGap    || '16');

    // stacked = sidebar ispod table (na uskim ekranima)
    const stacked = window.matchMedia('(max-width: 900px)').matches;

    // realno raspoloživo za TABLU
    let boardMaxW = availW;
    let boardMaxH = availH;

    if (stacked) {
      // sidebar je ispod → oduzmi njegovu visinu i razmak
      boardMaxH = Math.max(0, availH - sidebar.offsetHeight - rowGap);
    } else {
      // sidebar je desno → oduzmi njegovu širinu i kolonu razmak
      boardMaxW = Math.max(0, availW - sidebar.offsetWidth - colGap);
    }

    // mali luft da nikad ne “kači” ivicu zbog zaokruživanja
    const safety = 10; // px
    const safeW = Math.max(0, boardMaxW - safety);
    const safeH = Math.max(0, boardMaxH - safety);

    // piksela po grid jedinici, ograničeno po širini i po visini
    const cellByW = Math.floor(safeW / COLS);
    const cellByH = Math.floor(safeH / ROWS);
    const cell    = Math.max(10, Math.min(cellByW, cellByH));

    // primeni skalu (tabla = COLS×ROWS, next = 4×4 ~ 80% ćelije)
    this.applyScale(this.canvas.nativeElement,     this.ctx,     COLS, ROWS, cell);
    this.applyScale(this.canvasNext.nativeElement, this.ctxNext, 4,    4,    Math.max(8, Math.floor(cell * 0.8)));
  }
  // ---------- GAME ----------
  resetGame() {
    this.gameOverFlag = false;
    this.scoreSaved = false;
    this.points = this.lines = this.level = 0;
    this.dropInterval = 500;

    this.board = this.getEmptyBoard();
    this.next  = new Piece(this.ctx);
    this.piece = new Piece(this.ctx);
    this.next.drawNext(this.ctxNext);

    this.lastTime = 0;
    cancelAnimationFrame(this.requestId);
    this.animate();
  }

  animate(now = 0) {
    if (this.gameOverFlag) return;
    const delta = now - this.lastTime;
    if (delta > this.dropInterval) {
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

      if (this.piece.y === 0) { this.gameOver(); return; }

      this.piece = this.next;
      this.next  = new Piece(this.ctx);
      this.next.drawNext(this.ctxNext);
    }
  }

  draw() {
    // čistimo u logičkim jedinicama (COLS, ROWS), transform već radi skaliranje
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

  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) this.board[y + this.piece.y][x + this.piece.x] = value;
      });
    });
  }

  clearLines() {
    let linesCleared = 0;
    this.board = this.board.filter(row => {
      if (row.every(v => v > 0)) { linesCleared++; return false; }
      return true;
    });
    while (this.board.length < ROWS) this.board.unshift(Array(COLS).fill(0));
    this.lines += linesCleared;
    this.points += linesCleared * 15;
    if (linesCleared > 0 && this.lines % 3 === 0) this.increaseSpeed();
  }

  increaseSpeed() { if (this.dropInterval > 100) this.dropInterval -= 50; }

  getEmptyBoard(): number[][] { return Array.from({ length: ROWS }, () => Array(COLS).fill(0)); }

  @HostListener('window:keydown', ['$event'])
  keyEvent(e: KeyboardEvent) {
    if (this.gameOverFlag) return;
    if (e.keyCode === KEY.LEFT || e.keyCode === KEY.RIGHT || e.keyCode === KEY.DOWN) {
      const p = { ...this.piece };
      p.x += e.keyCode === KEY.LEFT ? -1 : e.keyCode === KEY.RIGHT ? 1 : 0;
      p.y += e.keyCode === KEY.DOWN ? 1 : 0;
      if (this.service.valid(p, this.board)) this.piece.move(p);
    }
  }

  gameOver() {
    this.gameOverFlag = true;
    this.finalScore = this.points;
    this.finalLines = this.lines;

    if (!this.scoreSaved) {
      this.scoreSaved = true;
      const gameId = 2;
      const userId = this.user?.id;
      if (userId) {
        this.service.saveScore(gameId, userId, this.finalScore).subscribe(
          () => this.service.awardTopScorerCoupon().subscribe(
            r => alert(r.message || 'Coupon awarded successfully!'),
            e => console.error('Error awarding coupon:', e)),
          e => console.error('Failed to save score:', e)
        );
      }
    }
    cancelAnimationFrame(this.requestId);
  }

  exitGame() {
    this.gameOverFlag = false;
    cancelAnimationFrame(this.requestId);
  }
}
