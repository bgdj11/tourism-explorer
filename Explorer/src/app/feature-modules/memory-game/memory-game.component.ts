import { Component, OnInit } from '@angular/core';
import { MemoryGameService } from './memory-game.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { User } from '../../infrastructure/auth/model/user.model';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.css']
})
export class MemoryGameComponent implements OnInit {
  cards: { image: string; flipped: boolean; matched: boolean }[] = [];
  flippedCards: number[] = [];
  lockBoard: boolean = false;
  gameTime = 0; // Vreme trajanja igre u sekundama
  gameTimer: any; // Interval za brojanje vremena igre
  user: User; // Trenutni korisnik
  gameOverFlag = false; // Da li je igra završena
  finalScore = 0; // Krajnji rezultat (vreme igre)

  constructor(private memoryGameService: MemoryGameService, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.initializeGame();
  }

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
    this.gameTimer = setInterval(() => {
      this.gameTime++;
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.gameTimer);
  }

  flipCard(index: number) {
    if (this.lockBoard || this.cards[index].flipped || this.gameOverFlag) return;

    this.cards[index].flipped = true;
    this.flippedCards.push(index);

    if (this.flippedCards.length === 2) {
      this.checkForMatch();
    }
  }

  checkForMatch() {
    this.lockBoard = true;
    const [firstIndex, secondIndex] = this.flippedCards;

    if (this.cards[firstIndex].image === this.cards[secondIndex].image) {
      this.cards[firstIndex].matched = true;
      this.cards[secondIndex].matched = true;
      this.checkGameOver();
    } else {
      setTimeout(() => {
        this.cards[firstIndex].flipped = false;
        this.cards[secondIndex].flipped = false;
      }, 1000);
    }

    this.flippedCards = [];
    setTimeout(() => (this.lockBoard = false), 1000);
  }

  checkGameOver() {
    const unmatchedCards = this.cards.filter(card => !card.matched);
    if (unmatchedCards.length === 0) {
      this.stopTimer();
      this.finalScore = this.gameTime;
      this.gameOverFlag = true;
      alert(`Čestitamo! Završili ste igru za ${this.finalScore} sekundi.`);
      this.endGame();
    }
  }

  endGame() {
    const gameId = 3; // ID igre za Memory Game

    if (this.user?.id) {
      this.memoryGameService.saveScore(gameId, this.user.id, this.finalScore).subscribe(
        response => {
          console.log('Score saved successfully:', response);

          // Dodela kupona nakon čuvanja rezultata
          this.memoryGameService.awardTopScorerCoupon().subscribe(
            couponResponse => {
              console.log('Coupon awarded:', couponResponse);
              alert(couponResponse.message || 'Kupon je uspešno dodeljen!');
            },
            error => {
              console.error('Error awarding coupon:', error);
            }
          );
        },
        error => {
          console.error('Failed to save score:', error);
        }
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
