import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'xp-lights-out',
  templateUrl: './lights-out.component.html',
  styleUrls: ['./lights-out.component.css']
})
export class LightsOutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) rootRef!: ElementRef<HTMLElement>;
  @ViewChild('boardWrap', { static: true }) boardWrapRef!: ElementRef<HTMLElement>;

  gridSize = 5;
  grid: boolean[][] = [];

  private ro?: ResizeObserver;

  ngOnInit() {
    this.initializeGrid();
  }

  ngAfterViewInit(): void {
    this.applyVars(); // odmah
    this.ro = new ResizeObserver(() => this.applyVars());
    this.ro.observe(this.rootRef.nativeElement);
    this.ro.observe(this.boardWrapRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
  }

  // --------- LAYOUT / SCALING ----------
  private applyVars(): void {
    const root = this.rootRef.nativeElement;
    const wrap = this.boardWrapRef.nativeElement;

    // dostupna širina/visina za TABLU (ne za ceo panel)
    const availW = wrap.clientWidth;
    const availH = wrap.clientHeight;

    // broj ćelija i razmaci
    const n = this.gridSize;

    // probni gap po veličini ekrana
    const gapByW = Math.max(4, Math.round(availW * 0.006));
    const gapByH = Math.max(4, Math.round(availH * 0.006));
    const gap = Math.min(gapByW, gapByH);

    // sirova veličina kvadrata
    const cellByW = (availW - (n - 1) * gap) / n;
    const cellByH = (availH - (n - 1) * gap) / n;
    const raw = Math.min(cellByW, cellByH);

    // malko smanji da NIKAD ne kači okvir
    const cell = Math.max(24, Math.floor(raw * 0.94));

    // font na osnovu ćelije
    const fs = Math.max(14, Math.min(20, Math.round(cell * 0.5)));

    root.style.setProperty('--n', String(n));
    root.style.setProperty('--gap', `${gap}px`);
    root.style.setProperty('--cell', `${cell}px`);
    root.style.setProperty('--fs', `${fs}px`);
  }

  // --------- GAME LOGIC ----------
  initializeGrid() {
    this.grid = Array.from({ length: this.gridSize }, () =>
      Array.from({ length: this.gridSize }, () => Math.random() < 0.5)
    );
    // osveži varijable posle reset-a (ako je view već tu)
    if (this.rootRef && this.boardWrapRef) this.applyVars();
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
