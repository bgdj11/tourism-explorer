import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { RatingDialogComponent } from '../rating-dialog/rating-dialog.component';

@Component({
  selector: 'xp-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements AfterViewInit {

  @ViewChild(RatingDialogComponent) reviewModal: RatingDialogComponent | undefined;
  
  ngAfterViewInit() {
    console.log(this.reviewModal);
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
    console.log(this.reviewModal);
    if (this.reviewModal) {
      this.reviewModal.openModal();
      console.log('OTVORI MODALNI PROZOR!!!');
    }
  }

  handleReview(review: { rating: number; comment: string }) {
    console.log('Recenzija je poslana:', review);
    // Možeš poslati podatke na server ili dalje obraditi
  }

}
