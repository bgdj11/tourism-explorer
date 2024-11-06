import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour.execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourDTO } from '../../tour-authoring/model/tour.model';
import { TourExecution } from "../model/tour-execution.model";

@Component({
  selector: 'xp-start-tour',
  templateUrl: './start-tour.component.html',
  styleUrls: ['./start-tour.component.css']
})
export class StartTourComponent implements OnInit {
  errorMessage: string | null = null;
  tours: TourDTO[] = [];
  activeTourExecution: TourExecution | null = null;

  constructor(
      private tourExecutionService: TourExecutionService,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkActiveTour();
  }

  // Provera stanja pokrenute ture pri učitavanju komponente
  checkActiveTour(): void {
    const savedExecution = localStorage.getItem('activeTourExecution');

    if (savedExecution) {
      // Ako postoji pokrenuta tura u localStorage, parsiraj je i postavi kao aktivnu turu
      this.activeTourExecution = JSON.parse(savedExecution) as TourExecution;
      this.tours = this.tours.filter(tour => tour.id === this.activeTourExecution?.tourId);
    } else {
      // Ako nema pokrenute ture, učitaj sve ture
      this.loadTours();
    }
  }

  loadTours(): void {
    this.tourExecutionService.getAllTours().subscribe(
        (tours: TourDTO[]) => {
          this.tours = tours;
        },
        (error) => {
          console.error('Error loading tours:', error);
          this.errorMessage = 'Failed to load tours. Please try again.';
        }
    );
  }

  startTour(tourId: number): void {
    const userId = this.authService.user$.getValue().id;

    if (!tourId || tourId <= 0) {
      this.errorMessage = 'Invalid Tour ID. Please enter a positive number.';
      return;
    }

    // Pokreni turu i učitaj status nove ture
    this.tourExecutionService.startTourExecution(tourId, userId).subscribe(
        (execution: TourExecution) => {
          // Sačuvaj `activeTourExecution` sa svim detaljima uključujući `executionId`
          this.activeTourExecution = execution;
          localStorage.setItem('activeTourExecution', JSON.stringify(execution));

          // Nakon što se tura uspešno pokrene, prikaži samo aktivnu turu
          this.tours = this.tours.filter(tour => tour.id === tourId);
        },
        (error) => {
          console.error('Error starting tour:', error);
          this.errorMessage = 'Failed to start the tour. Please try again.';
        }
    );
  }

  completeTour(): void {
    if (this.activeTourExecution) {
      this.tourExecutionService.completeTourExecution(this.activeTourExecution.id).subscribe(
          () => {
            // Očisti stanje pokrenute ture nakon završetka
            localStorage.removeItem('activeTourExecution');
            this.activeTourExecution = null;
            this.loadTours();
          },
          (error) => {
            console.error('Error completing tour:', error);
            this.errorMessage = 'Failed to complete the tour. Please try again.';
          }
      );
    }
  }

  abandonTour(): void {
    if (this.activeTourExecution) {
      this.tourExecutionService.abandonTourExecution(this.activeTourExecution.id).subscribe(
          () => {
            // Očisti stanje pokrenute ture nakon napuštanja
            localStorage.removeItem('activeTourExecution');
            this.activeTourExecution = null;
            this.loadTours();
          },
          (error) => {
            console.error('Error abandoning tour:', error);
            this.errorMessage = 'Failed to abandon the tour. Please try again.';
          }
      );
    }
  }
}
