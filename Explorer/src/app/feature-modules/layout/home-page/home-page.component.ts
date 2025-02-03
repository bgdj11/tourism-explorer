import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { RatingDialogComponent } from '../rating-dialog/rating-dialog.component';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements AfterViewInit {

  @ViewChild(RatingDialogComponent) reviewModal: RatingDialogComponent | undefined;
  user: User | undefined;
  isLoggedIn = true; 

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
  
  ngAfterViewInit() {
    const stats = [
      { id: 'stat-grade', endValue: 4.8 },
      { id: 'stat-tours', endValue: 300 },
      { id: 'stat-countries', endValue: 100 },
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateNumbers(stats);
          observer.disconnect(); 
        }
      });
    });

    const statsWrapper = document.querySelector('.stats-wrapper');
    if (statsWrapper) observer.observe(statsWrapper);
  }

  animateNumbers(stats: { id: string; endValue: number }[]) {
    stats.forEach((stat, index) => {
      const element = document.getElementById(stat.id);
      if (!element) return;
  
      let startValue = 0;
      const duration = 2000; 
      const stepTime = Math.abs(Math.floor(duration / stat.endValue));
  
      const timer = setInterval(() => {
        startValue += 1;
        element.textContent = this.formatNumber(startValue);
  
        if (startValue >= stat.endValue) {
          clearInterval(timer);
  
          if (index === 0) {
            element.textContent = `${this.formatNumber(stat.endValue)}`; 
          } else {
            element.textContent = `${this.formatNumber(stat.endValue)}+`; 
          }
        }
      }, stepTime);
    });
  }

  formatNumber(value: number): string {
    return value.toLocaleString(); 
  }

  openReviewModal() {
    if (this.user?.username) {
      if (this.reviewModal) {
        this.reviewModal.openModal();
      }
    } else {
      this.isLoggedIn = false; 
    }
  }

  closeModal() {
    this.isLoggedIn = true; 
  }

  navigateToLogin() {
    this.isLoggedIn = true; 
    this.router.navigate(['/login']); 
  }
  
  handleReview(review: { rating: number; comment: string }) {
    console.log('Recenzija je poslata:', review);
  }

  joinClub() {
    if (!this.user?.username) {
      this.isLoggedIn = false; 
    } else {
      this.router.navigate(['/allclubs']); 
    }
  }
  
}
