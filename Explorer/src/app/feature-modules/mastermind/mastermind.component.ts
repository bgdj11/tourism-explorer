import { Component } from '@angular/core';

@Component({
  selector: 'xp-mastermind',
  templateUrl: './mastermind.component.html',
  styleUrls: ['./mastermind.component.css']
})
export class MastermindComponent {
  colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
  codeLength = 4;
  maxAttempts = 6;

  secretCode: string[] = [];
  guesses: { guess: (string | null)[], feedback: string[] }[] = [];
  currentAttempt = 0;
  gameOver = false;
  message = '';

  constructor() {
    this.resetGame();
  }

  resetGame() {
    this.secretCode = [];
    for (let i = 0; i < this.codeLength; i++) {
      this.secretCode.push(this.colors[Math.floor(Math.random() * this.colors.length)]);
    }

    this.guesses = [];
    for (let i = 0; i < this.maxAttempts; i++) {
      this.guesses.push({ guess: [null, null, null, null], feedback: ['gray', 'gray', 'gray', 'gray'] });
    }

    this.currentAttempt = 0;
    this.gameOver = false;
    this.message = '';

    console.log('Secret Code:', this.secretCode);
  }

  selectColor(color: string) {
    if (this.gameOver) return;
    const currentGuess = this.guesses[this.currentAttempt].guess;
    const emptyIndex = currentGuess.indexOf(null);
    if (emptyIndex !== -1) {
      currentGuess[emptyIndex] = color;
    }
  }

  removeColor(index: number) {
    if (this.gameOver) return;
    const currentGuess = this.guesses[this.currentAttempt].guess;
    if (currentGuess[index]) {
      currentGuess[index] = null;
    }
  }

  submitGuess() {
    if (this.gameOver) return;
    const currentGuess = this.guesses[this.currentAttempt].guess;

    if (currentGuess.includes(null)) {
      this.message = 'Please fill all 4 colors before submitting';
      return;
    }

    const feedback = this.getFeedback(currentGuess as string[], this.secretCode);
    this.guesses[this.currentAttempt].feedback = feedback;

    if (feedback.every(f => f === 'black')) {
      this.gameOver = true;
      this.message = 'You cracked the code! 🎉';
      return;
    }

    this.currentAttempt++;

    if (this.currentAttempt >= this.maxAttempts) {
      this.gameOver = true;
      this.message = `Game over!`;
      return;
    }

    this.message = '';
  }

  getFeedback(guess: string[], code: string[]): string[] {
    const feedback: string[] = [];
    const codeCopy = [...code];
    const guessCopy = [...guess];


    for (let i = 0; i < guessCopy.length; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        feedback.push('black');
        codeCopy[i] = null!;
        guessCopy[i] = null!;
      }
    }

    for (let i = 0; i < guessCopy.length; i++) {
      if (guessCopy[i] && codeCopy.includes(guessCopy[i])) {
        feedback.push('white');
        const index = codeCopy.indexOf(guessCopy[i]);
        codeCopy[index] = null!;
      }
    }

    while (feedback.length < this.codeLength) {
      feedback.push('gray');
    }

    return feedback;
  }
  get showSecretCode() {
    return this.gameOver;
  }
}