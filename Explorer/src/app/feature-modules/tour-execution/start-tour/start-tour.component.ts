import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour.execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourDTO } from '../../tour-authoring/model/tour.model';
import { TourExecution } from "../model/tour-execution.model";
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MapLocation } from 'src/app/feature-modules/tour-execution/model/map-location.model';

@Component({
  selector: 'xp-start-tour',
  templateUrl: './start-tour.component.html',
  styleUrls: ['./start-tour.component.css']
})
export class StartTourComponent implements OnInit, OnDestroy {
  errorMessage: string | null = null;
  tours: TourDTO[] = [];
  activeTourExecution: TourExecution | null = null;
  private executionId: number | null = null;
  private checkIntervalSubscription!: Subscription;
  currentLocation: MapLocation | null = null;

  @ViewChild('tourIdInput') tourIdInput!: ElementRef;

  constructor(
      private tourExecutionService: TourExecutionService,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkActiveTour();
  }

  ngOnDestroy(): void {
    if (this.checkIntervalSubscription) {
      this.checkIntervalSubscription.unsubscribe();
    }
  }

  // Provera stanja pokrenute ture pri učitavanju komponente
  checkActiveTour(): void {
    const savedExecution = localStorage.getItem('activeTourExecution');

    if (savedExecution) {
      const execution = JSON.parse(savedExecution) as TourExecution;

      this.tourExecutionService.getTourExecutionStatus(execution.tourId, execution.userId).subscribe(
          (existingExecution) => {
            this.activeTourExecution = existingExecution;
            this.tours = this.tours.filter(tour => tour.id === this.activeTourExecution?.tourId);
          },
          (error) => {
            console.warn('Tour execution not found on server, clearing local storage.');
            localStorage.removeItem('activeTourExecution');
            this.activeTourExecution = null;
            this.loadTours();
          }
      );
    } else {
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
            if (response && response.id) {
              this.executionId = response.id;
              alert('Tour execution started successfully.');

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

  completeTour(): void {
    if (this.activeTourExecution) {
      this.tourExecutionService.completeTourExecution(this.activeTourExecution.id).subscribe(
          () => {
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

  startCheckingVisitedCheckpoints(userId: number): void {
    if (!this.executionId) {
      console.error('Execution ID is undefined');
      this.errorMessage = 'Execution ID is not set. Cannot check checkpoints.';
      return;
    }

    this.checkIntervalSubscription = interval(10000).pipe(
      switchMap(() =>
        this.tourExecutionService.getPosition(userId).pipe(
          switchMap((position) => {
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
}
