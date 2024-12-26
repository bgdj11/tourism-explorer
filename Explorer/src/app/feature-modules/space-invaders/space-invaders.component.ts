import { Component, HostListener } from '@angular/core';
import { SpaceInvadersService } from './space-invaders.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { User } from '../../infrastructure/auth/model/user.model';

interface Enemy {
  x: number;
  y: number;
}

@Component({
  selector: 'app-space-invaders',
  templateUrl: './space-invaders.component.html',
  styleUrls: ['./space-invaders.component.css']
})
export class SpaceInvadersComponent {
  player = { x: 275 }; // Player pozicija
  enemies: Enemy[] = []; // Lista neprijatelja sa eksplicitnim tipom
  projectile = { x: 0, y: 0, active: false }; // Projektil
  interval: any; // Interval za neprijatelje
  gameTime = 0; // Vreme trajanja nivoa
  gameTimer: any; // Tajmer za brojanje vremena igre
  finalScore = 0; // Krajnji rezultat
  user: User; // Trenutni korisnik
  gameOverFlag = false; // Da li je igra završena

  constructor(private service: SpaceInvadersService, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.startGame();
  }

  startGame() {
    this.gameOverFlag = false;
    this.gameTime = 0;
    this.enemies = [];
    this.generateEnemies();
    this.interval = setInterval(() => this.moveEnemies(), 500);
    this.gameTimer = setInterval(() => this.gameTime++, 1000);
  }

  generateEnemies() {
    const initialX = 250; // Početna pozicija X (u sredini)
    const initialY = 50;  // Početna pozicija Y
    const xSpacing = 100;  // Razmak između neprijatelja u horizontalnoj osi
    const ySpacing = 100;  // Razmak između neprijatelja u vertikalnoj osi

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        this.enemies.push({
          x: initialX + i * xSpacing,
          y: initialY + j * ySpacing
        });
      }
    }
  }

  moveEnemies() {
    if (this.gameOverFlag) return;
    for (const enemy of this.enemies) {
      enemy.x += 10;
      if (enemy.x > 550) enemy.x = 0;
    }
  }

  // Fajerovanje projektila
  fireProjectile() {
    if (!this.projectile.active && !this.gameOverFlag) {
      this.projectile.x = this.player.x + 22;
      this.projectile.y = 370;
      this.projectile.active = true;
      const interval = setInterval(() => {
        this.projectile.y -= 10;
        this.checkHit();
        if (this.projectile.y < 0) {
          this.projectile.active = false;
          clearInterval(interval);
        }
      }, 50);
    }
  }

  // Provera da li je projektil pogodio neprijatelja
  checkHit() {
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (
        this.projectile.y < enemy.y + 30 &&
        this.projectile.y > enemy.y &&
        this.projectile.x > enemy.x &&
        this.projectile.x < enemy.x + 40
      ) {
        // Ukloni neprijatelja iz liste
        this.enemies.splice(i, 1);
        this.projectile.active = false; // Uništi projektil
        this.checkGameOver(); // Proveri da li je igra gotova
        break; // Prekini petlju, jer jedan projektil ne može da pogodi više neprijatelja
      }
    }
  }

  checkGameOver() {
    if (this.enemies.length === 0) {
      clearInterval(this.gameTimer); // Zaustavi tajmer igre
      this.finalScore = this.gameTime; // Postavi krajnji rezultat
      this.gameOverFlag = true;
      alert(`Kraj igre! Vreme trajanja: ${this.gameTime} sekundi`);
      this.endGame();
    }
  }

  endGame() {
    clearInterval(this.gameTimer);
    clearInterval(this.interval);
    this.gameOverFlag = true;

    const gameId = 1; // ID igre

    if (this.user?.id) {
      // Sačuvaj rezultat igrača
      this.service.saveScore(gameId, this.user.id, this.finalScore).subscribe(
        response => {
          console.log('Score saved successfully:', response);

          // Automatski dodeli kupon nakon čuvanja rezultata
          this.service.awardTopScorerCoupon().subscribe(
            couponResponse => {
              console.log('Coupon awarded:', couponResponse);
              alert(couponResponse.message || 'Coupon awarded successfully!');
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

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameOverFlag) return;
    if (event.key === 'ArrowLeft' && this.player.x > 0) {
      this.player.x -= 15;
    } else if (event.key === 'ArrowRight' && this.player.x < 550) {
      this.player.x += 15;
    } else if (event.key === ' ') {
      this.fireProjectile();
    }
  }

  restartGame() {
    this.startGame();
  }
}
