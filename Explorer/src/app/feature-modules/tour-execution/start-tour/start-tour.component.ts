import {Component, ElementRef, ViewChild} from '@angular/core';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour.execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MapLocation } from 'src/app/feature-modules/tour-execution/model/map-location.model';


@Component({
  selector: 'xp-start-tour',
  templateUrl: './start-tour.component.html',
  styleUrls: ['./start-tour.component.css']
})
export class StartTourComponent {
  errorMessage: string | null = null;
  private executionId: number | null = null;
  private checkIntervalSubscription!: Subscription;
  currentLocation: MapLocation | null = null;

  @ViewChild('tourIdInput') tourIdInput!: ElementRef;
  constructor(
    private tourExecutionService: TourExecutionService,
    private authService: AuthService
  ) {}


  startTour(): void {
    const userId = this.authService.user$.getValue().id;
    const tourIdValue = this.tourIdInput.nativeElement.value;
    const tourId = parseInt(tourIdValue, 10);

    if (isNaN(tourId) || tourId <= 0) {
      this.errorMessage = 'Please enter a valid positive Tour ID.';
      return;
    }

    this.tourExecutionService.getPosition(userId).subscribe(
      (position) => {
        this.currentLocation = position.currentLocation;
        this.tourExecutionService.startTourExecution(tourId, userId).subscribe(
          (response) => {
            // Uveravamo se da je executionId postavljen
            if (response && response.id) {
              this.executionId = response.id;
              alert('Tour execution started successfully.');

              // Pokreće interval za proveru checkpoint-a svakih 10 sekundi
              this.startCheckingVisitedCheckpoints(userId);
            } else {
              console.error('No execution ID returned from startTourExecution');
              this.errorMessage = 'Failed to start the tour. Please try again.';
            }
          },
          (error) => {
            console.error('Error starting tour:', error);
            this.errorMessage = 'Failed to start the tour. Please try again.';
          }
        );
      },
      (error) => {
        console.error('Error fetching current location:', error);
        this.errorMessage = 'Failed to fetch current location. Please try again.';
      }
    );
  }

  startCheckingVisitedCheckpoints(userId: number): void {
    if (!this.executionId) {
      console.error('Execution ID is undefined');
      this.errorMessage = 'Execution ID is not set. Cannot check checkpoints.';
      return;
    }

    this.checkIntervalSubscription = interval(10000).pipe(
      switchMap(() =>
        // Prvo dobavljamo trenutnu lokaciju
        this.tourExecutionService.getPosition(userId).pipe(
          switchMap((position) => {
            // Koristimo currentLocation unutar position
            return this.tourExecutionService.checkVisitedCheckpoint(this.executionId!, position.currentLocation);
          })
        )
      )
    ).subscribe(
      (result) => {
        if (result.success) {
          console.log('Checkpoint visited:', result);
        } else {
          console.warn('No nearby checkpoints or already visited.');
        }
      },
      (error) => {
        console.error('Error checking visited checkpoint:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.checkIntervalSubscription) {
      this.checkIntervalSubscription.unsubscribe();
    }
  }
}
