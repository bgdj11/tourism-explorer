import { Component, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppRatingComponent } from '../app-rating/app-rating.component';

@Component({
  selector: 'xp-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements AfterViewInit {
  
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
}
