import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'xp-mastermind',
  templateUrl: './mastermind.component.html',
  styleUrls: ['./mastermind.component.css']
})
export class MastermindComponent implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) rootRef!: ElementRef<HTMLElement>;

  colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
  codeLength = 4;
  maxAttempts = 6;

  secretCode: string[] = [];
  guesses: { guess: (string | null)[], feedback: string[] }[] = [];
  currentAttempt = 0;
  gameOver = false;
  message = '';

  private ro?: ResizeObserver;

  constructor() { this.resetGame(); }

  // ---------- scaling ----------
  ngAfterViewInit(): void {
    this.recalcLayout();
    this.ro = new ResizeObserver(() => this.recalcLayout());
    this.ro.observe(this.rootRef.nativeElement);
  }
  ngOnDestroy(): void { this.ro?.disconnect(); }

  private recalcLayout(): void {
    const root = this.rootRef.nativeElement;
    const w = root.clientWidth;
    const h = root.clientHeight;

    // procena vertikalnih "redova": header + paleta + pokušaji + kontrole + (sekret kod kad je kraj)
    const extraRows = this.gameOver ? 1 : 0;
    const rowsCount = this.maxAttempts + 4 + extraRows;

    // osnovna veličina kruga po H/W
    const dotByH = Math.floor((h - 140) / (rowsCount * 1.8));
    const dotByW = Math.floor((w - 120) / 8);

    // mala visinska skala da nikad ne zakači okvir
    const scale = 0.9;
    const raw = Math.min(dotByH, dotByW);
    const dot = Math.max(18, Math.min(64, Math.floor(raw * scale)));

    const fdot = Math.max(10, Math.round(dot * 0.5));   // malo manji feedback peg
    const gap  = Math.max(6,  Math.round(dot * 0.25));
    const fs   = Math.max(14, Math.min(22, Math.round(dot * 0.6)));
    const pad  = Math.max(8,  Math.round(dot * 0.55));

    root.style.setProperty('--dot',  `${dot}px`);
    root.style.setProperty('--fdot', `${fdot}px`);
    root.style.setProperty('--gap',  `${gap}px`);
    root.style.setProperty('--fs',   `${fs}px`);
    root.style.setProperty('--pad',  `${pad}px`);
  }

  // ---------- game logic ----------
  resetGame() {
    this.secretCode = Array.from({ length: this.codeLength }, () =>
      this.colors[Math.floor(Math.random() * this.colors.length)]
    );

    this.guesses = Array.from({ length: this.maxAttempts }, () =>
      ({ guess: [null, null, null, null], feedback: ['gray', 'gray', 'gray', 'gray'] })
    );

    this.currentAttempt = 0;
    this.gameOver = false;
    this.message = '';

    // osveži varijable posle reseta
    if (this.rootRef) this.recalcLayout();
  }

  selectColor(color: string) {
    if (this.gameOver) return;
    const current = this.guesses[this.currentAttempt].guess;
    const i = current.indexOf(null);
    if (i !== -1) current[i] = color;
  }

  removeColor(index: number) {
    if (this.gameOver) return;
    const current = this.guesses[this.currentAttempt].guess;
    if (current[index]) current[index] = null;
  }

  submitGuess() {
    if (this.gameOver) return;
    const current = this.guesses[this.currentAttempt].guess;

    if (current.includes(null)) {
      this.message = 'Please fill all 4 colors before submitting';
      return;
    }

    const feedback = this.getFeedback(current as string[], this.secretCode);
    this.guesses[this.currentAttempt].feedback = feedback;

    if (feedback.every(f => f === 'black')) {
      this.gameOver = true;
      this.message = 'You cracked the code! 🎉';
      this.recalcLayout();
      return;
    }

    this.currentAttempt++;
    if (this.currentAttempt >= this.maxAttempts) {
      this.gameOver = true;
      this.message = 'Game over!';
      this.recalcLayout();
      return;
    }

    this.message = '';
  }

  getFeedback(guess: string[], code: string[]): string[] {
    const fb: string[] = [];
    const codeCopy = [...code];
    const guessCopy = [...guess];

    // black
    for (let i = 0; i < guessCopy.length; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        fb.push('black'); codeCopy[i] = null!; guessCopy[i] = null!;
      }
    }
    // white
    for (let i = 0; i < guessCopy.length; i++) {
      if (guessCopy[i] && codeCopy.includes(guessCopy[i])) {
        fb.push('white'); codeCopy[codeCopy.indexOf(guessCopy[i])] = null!;
      }
    }
    while (fb.length < this.codeLength) fb.push('gray');
    return fb;
  }

  get showSecretCode() { return this.gameOver; }
}
