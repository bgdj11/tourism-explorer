import {Component, ElementRef, ViewChild} from '@angular/core';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour.execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-start-tour',
  templateUrl: './start-tour.component.html',
  styleUrls: ['./start-tour.component.css']
})
export class StartTourComponent {
  errorMessage: string | null = null;
  @ViewChild('tourIdInput') tourIdInput!: ElementRef;
  constructor(
    private tourExecutionService: TourExecutionService,
    private authService: AuthService
  ) {}

  startTour(): void {
    const userId = this.authService.user$.getValue().id;

    const tourIdValue = this.tourIdInput.nativeElement.value; // Dohvata vrednost iz input polja
    const tourId = parseInt(tourIdValue, 10); // Konvertuje vrednost u broj

    if (isNaN(tourId) || tourId <= 0) {
      this.errorMessage = 'Please enter a valid positive Tour ID.';
      return;
    }


    const parsedTourId = Number(tourId);
    if (isNaN(parsedTourId) || parsedTourId <= 0) {
      this.errorMessage = 'Invalid Tour ID. Please enter a positive number.';
      return;
    }
    this.tourExecutionService.startTourExecution(parsedTourId, userId).subscribe(
      () => {
        alert('Tour execution started successfully.');
      },
      (error) => {
        console.error('Error starting tour:', error);
        this.errorMessage = 'Failed to start the tour. Please try again.';
      }
    );
  }
}
