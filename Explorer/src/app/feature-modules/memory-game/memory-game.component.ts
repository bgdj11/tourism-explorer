import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { MemoryGameService } from './memory-game.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { User } from '../../infrastructure/auth/model/user.model';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.css']
})
export class MemoryGameComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('board', { static: true }) boardRef!: ElementRef<HTMLElement>;

  cards: { image: string; flipped: boolean; matched: boolean }[] = [];
  flippedCards: number[] = [];
  lockBoard: boolean = false;

  gameTime = 0;
  gameTimer: any;
  user: User;
  gameOverFlag = false;
  finalScore = 0;

  // ---- mreža / skaliranje (4x4) ----
  private cols = 4;
  private rows = 4;
  private gap = 12;        // px razmak između kartica
  private minCard = 64;    // min veličina kvadrata

  // >>> novo: uvek skupi kvadrat za X% + par px rezerve
  private scale = 0.84;   // još mrvu manje da ne “kači” dno
  private safetyPx = 12;  // malo rezerve po visini


  private ro?: ResizeObserver;

  constructor(
    private memoryGameService: MemoryGameService,
    private authService: AuthService,
    private el: ElementRef<HTMLElement>
  ) {
    this.authService.user$.subscribe(user => (this.user = user));
  }

  ngOnInit() {
    this.initializeGame();
  }

  ngAfterViewInit(): void {
    const playArea = this.el.nativeElement.closest('.play-area') as HTMLElement | null;

    const recalc = () => {
      if (!playArea || !this.boardRef) return;

      // unutrašnje dimenzije (bez paddinga)
      const cs = getComputedStyle(playArea);
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      const availW = playArea.clientWidth  - padX;
      const availH = playArea.clientHeight - padY - this.safetyPx;

      // ADAPTIVNI GAP (isti koristimo u računu i u CSS-u)
      const isShort  = availH < 720;
      const isNarrow = availW < 900;
      const gap = (isShort || isNarrow) ? 10 : 12;

      // kartica koja maksimalno staje uz taj 'gap'
      const cardByW = (availW - (this.cols - 1) * gap) / this.cols;
      const cardByH = (availH - (this.rows - 1) * gap) / this.rows;
      const raw = Math.min(cardByW, cardByH);

      // namerno smanji za skalu
      const card = Math.max(this.minCard, Math.floor(raw * this.scale));

      // upiši u CSS varijable
      const board = this.boardRef.nativeElement;
      board.style.setProperty('--cols', String(this.cols));
      board.style.setProperty('--rows', String(this.rows));
      board.style.setProperty('--gap', `${gap}px`);
      board.style.setProperty('--card', `${card}px`);
    };


    recalc();
    this.ro = new ResizeObserver(recalc);
    if (playArea) this.ro.observe(playArea);
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
    this.stopTimer();
  }

  // ---------------- GAME LOGIC ----------------

  initializeGame() {
    const images = [
      'assets/img1.jpg',
      'assets/img2.jpg',
      'assets/img3.jpg',
      'assets/img4.jpg',
      'assets/img5.jpg',
      'assets/img6.jpg',
      'assets/img7.jpg',
      'assets/img8.jpg'
    ];

    this.cards = [...images, ...images]
      .map(image => ({ image, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);

    this.startTimer();
  }

  startTimer() {
    this.gameTime = 0;
    this.gameOverFlag = false;
    this.gameTimer = setInterval(() => this.gameTime++, 1000);
  }

  stopTimer() {
    clearInterval(this.gameTimer);
  }

  flipCard(index: number) {
    if (this.lockBoard || this.cards[index].flipped || this.gameOverFlag) return;
    this.cards[index].flipped = true;
    this.flippedCards.push(index);
    if (this.flippedCards.length === 2) this.checkForMatch();
  }

  checkForMatch() {
    this.lockBoard = true;
    const [i, j] = this.flippedCards;

    if (this.cards[i].image === this.cards[j].image) {
      this.cards[i].matched = true;
      this.cards[j].matched = true;
      this.checkGameOver();
    } else {
      setTimeout(() => { this.cards[i].flipped = false; this.cards[j].flipped = false; }, 1000);
    }

    this.flippedCards = [];
    setTimeout(() => (this.lockBoard = false), 1000);
  }

  checkGameOver() {
    if (this.cards.every(c => c.matched)) {
      this.stopTimer();
      this.finalScore = this.gameTime;
      this.gameOverFlag = true;
      alert(`Čestitamo! Završili ste igru za ${this.finalScore} sekundi.`);
      this.endGame();
    }
  }

  endGame() {
    const gameId = 3;
    if (this.user?.id) {
      this.memoryGameService.saveScore(gameId, this.user.id, this.finalScore).subscribe(
        () => {
          this.memoryGameService.awardTopScorerCoupon().subscribe(
            r => alert(r.message || 'Kupon je uspešno dodeljen!'),
            e => console.error('Error awarding coupon:', e)
          );
        },
        e => console.error('Failed to save score:', e)
      );
    } else {
      console.error('User ID is not available. Cannot save the score.');
    }
  }

  restartGame() {
    this.stopTimer();
    this.initializeGame();
  }
}
