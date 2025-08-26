// start-tour.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour.execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourDTO } from '../../tour-authoring/model/tour.model';
import { TourExecution } from '../model/tour-execution.model';
import { TourReview } from '../model/review.model';
import { interval, Subscription, switchMap } from 'rxjs';
import { MapLocation } from '../model/map-location.model';
import { VisitedCheckpointsDTO } from '../model/visitedCheckpoints.model';
import { EncounterDTO } from 'src/app/shared/model/encounter';
import { TourExecutionStatus } from '../model/tour-execution.model';
@Component({
  selector: 'xp-start-tour',
  templateUrl: './start-tour.component.html',
  styleUrls: ['./start-tour.component.css']
})
export class StartTourComponent implements OnInit, OnDestroy {
  visitedCheckpoints: VisitedCheckpointsDTO[] = [];
  private executionId: number | null = null;
  private checkIntervalSubscription!: Subscription;
  currentLocation: MapLocation | null = null;
  TourExecutionStatus = TourExecutionStatus; // <-- OVO dodaj
  encounter: EncounterDTO | null = null;

  errorMessage: string | null = null;
  tours: TourDTO[] = [];
  activeTourExecution: TourExecution | null = null;

  reviews: TourReview[] = [];
  userId = 0;
  showReviewForTour = false;

  selectedReviewsTourId: number | null = null;

  // tabela kolone
  displayedColumns: string[] = ['id', 'name', 'description', 'action'];

  // review modeli (ostavljam tvoj format)
  review: TourReview = {
    id: 1, rating: 0, comment: '',
    tourDate: new Date(), reviewDate: new Date(), images: [],
    tour: { id: 1, name: '', description: '', weight: '', tags: [], status: 0, price: 0, lengthInKm: 0, equipments: [], tourCheckpoints: [] },
    personn: { userId: this.userId, name: 'string', email: 'test@test.com', surname: 'string' }
  };

  editingReview = false;
  reviewToEdit: TourReview = { ...this.review };

  constructor(
    private tourExecutionService: TourExecutionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.user$.getValue()?.id ?? 0;
    this.checkActiveTour();

    // auto-interval za checkpointove ako je potrebno
    const savedExecution = localStorage.getItem('activeTourExecution');
    if (savedExecution && this.userId) {
      const execution = JSON.parse(savedExecution) as TourExecution;
      this.executionId = execution.id;
      if (this.encounter?.isRequired) this.startCheckingVisitedCheckpoints(this.userId);
    }
  }

  ngOnDestroy(): void {
    if (this.checkIntervalSubscription) this.checkIntervalSubscription.unsubscribe();
  }

  /* ===== Tours ===== */
  checkActiveTour(): void {
    const saved = localStorage.getItem('activeTourExecution');
    if (saved) {
      const execution = JSON.parse(saved) as TourExecution;
      this.tourExecutionService.getTourExecutionStatus(execution.tourId, execution.userId).subscribe({
        next: (existing) => {
          this.activeTourExecution = existing;
          this.executionId = existing.id;
          this.tours = this.tours.filter(t => t.id === this.activeTourExecution?.tourId);
        },
        error: () => {
          localStorage.removeItem('activeTourExecution');
          this.activeTourExecution = null;
          this.loadTours();
        }
      });
    } else {
      this.loadTours();
    }
  }

  loadTours(): void {
    this.tourExecutionService.getAllTours().subscribe({
      next: (tours) => (this.tours = tours),
      error: (e) => {
        console.error('Error loading tours:', e);
        this.errorMessage = 'Failed to load tours. Please try again.';
      }
    });
  }

  showReviews(tourId: number): void {
    // ako klikneš na drugi tour, uvek prikaži i učitaj nove recenzije
    if (this.selectedReviewsTourId !== tourId) {
      this.selectedReviewsTourId = tourId;
      this.showReviewForTour = true;
      this.loadReviews(tourId);
      return;
    }

    // ako klikćeš isti tour, samo toggluj prikaz;
    // ako ga ponovo otvoriš, osveži listu
    this.showReviewForTour = !this.showReviewForTour;
    if (this.showReviewForTour) {
      this.loadReviews(tourId);
    }
  }

  startTour(tourId: number): void {
    const userId = this.userId;
    if (!tourId || tourId <= 0) {
      this.errorMessage = 'Invalid Tour ID. Please enter a positive number.';
      return;
    }

    // start + spremi aktivnu
    this.tourExecutionService.startTourExecution(tourId, userId).subscribe({
      next: (execution) => {
        this.activeTourExecution = execution;
        this.executionId = execution.id;
        localStorage.setItem('activeTourExecution', JSON.stringify(execution));
        this.tours = this.tours.filter(t => t.id === tourId);

        // pokupi lokaciju i eventualno pokreni checker
        this.tourExecutionService.getPosition(userId).subscribe({
          next: (pos) => {
            this.currentLocation = pos.currentLocation;
            if (this.encounter?.isRequired) this.startCheckingVisitedCheckpoints(userId);
          },
          error: (err) => {
            console.error('Error fetching current location:', err);
            this.errorMessage = 'Failed to fetch current location. Please try again.';
          }
        });
      },
      error: (err) => {
        console.error('Error starting tour:', err);
        this.errorMessage = 'Failed to start the tour. Please try again.';
      }
    });
  }

  completeTour(): void {
    if (!this.activeTourExecution) return;
    this.tourExecutionService.completeTourExecution(this.activeTourExecution.id).subscribe({
      next: () => {
        localStorage.removeItem('activeTourExecution');
        this.activeTourExecution = null;
        this.loadTours();
      },
      error: (e) => {
        console.error('Error completing tour:', e);
        this.errorMessage = 'Failed to complete the tour. Please try again.';
      }
    });
  }

  abandonTour(): void {
    if (!this.activeTourExecution) return;
    this.tourExecutionService.abandonTourExecution(this.activeTourExecution.id).subscribe({
      next: () => {
        localStorage.removeItem('activeTourExecution');
        this.activeTourExecution = null;
        this.loadTours();
      },
      error: (e) => {
        console.error('Error abandoning tour:', e);
        this.errorMessage = 'Failed to abandon the tour. Please try again.';
      }
    });
  }

  /* ===== Checkpoints polling ===== */
  startCheckingVisitedCheckpoints(userId: number): void {
    if (!this.executionId) {
      this.errorMessage = 'Execution ID is not set. Cannot check checkpoints.';
      return;
    }
    this.checkIntervalSubscription = interval(10000)
      .pipe(
        switchMap(() =>
          this.tourExecutionService.getPosition(userId).pipe(
            switchMap((position) =>
              this.tourExecutionService.checkVisitedCheckpoint(this.executionId!, position.currentLocation)
            )
          )
        )
      )
      .subscribe({
        next: (result) => {
          if (result?.success) {
            // Opcionalno: osveži status aktivne ture
            this.tourExecutionService.getTourExecutionStatus(this.activeTourExecution!.tourId, userId)
              .subscribe((ex) => (this.activeTourExecution = ex));
          }
        },
        error: (e) => console.error('Error checking visited checkpoint:', e)
      });
  }

  /* ===== Reviews ===== */
  loadReviews(tourId: number): void {
    this.tourExecutionService.getAllReviews(tourId, 1, 10).subscribe({
      next: (res) => (this.reviews = res.results),
      error: () => (this.errorMessage = 'Failed to load reviews.')
    });
  }

  submitReview(): void {
    const tourId = this.activeTourExecution?.tourId ?? this.tours[0]?.id; // fallback: prva iz liste
    if (!tourId) { this.errorMessage = 'No tour selected for review.'; return; }

    this.review = {
      ...this.review,
      personn: { userId: this.userId, name: 'string', email: 'test.test.com', surname: 'string' },
      reviewDate: new Date()
    };

    this.tourExecutionService.addReview(tourId, this.review).subscribe({
      next: () => {
        alert('Review submitted successfully.');
        this.loadReviews(tourId);
        this.resetReviewForm();
      },
      error: () => (this.errorMessage = 'Error submitting review.')
    });
  }

  editReview(r: TourReview): void {
    this.editingReview = true;
    this.reviewToEdit = { ...r };
  }

  submitEditedReview(): void {
    if (!this.reviewToEdit) return;
    this.tourExecutionService.updateReview(this.reviewToEdit.id, this.reviewToEdit).subscribe({
      next: () => {
        alert('Review updated successfully.');
        const tourId = this.activeTourExecution?.tourId ?? this.tours[0]?.id;
        if (tourId) this.loadReviews(tourId);
        this.resetEditForm();
        this.editingReview = false;
        this.cancelEdit();
      },
      error: () => (this.errorMessage = 'Error updating review.')
    });
  }

  cancelEdit(): void { this.resetEditForm(); }
  resetEditForm(): void { this.editingReview = false; this.resetReviewForm(); this.reviewToEdit = { ...this.review }; }

  canEditReview(r: TourReview): boolean { return r.personn?.userId === this.userId; }

  resetReviewForm(): void {
    this.review = {
      id: 1, rating: 0, comment: '',
      tourDate: new Date(), reviewDate: new Date(), images: [],
      tour: { id: 1, name: '', description: '', weight: '', tags: [], status: 0, price: 0, lengthInKm: 0, equipments: [], tourCheckpoints: [] },
      personn: { userId: this.userId, name: 'string', email: 'test@test.com', surname: 'string' }
    };
  }

  /* ===== trackBys ===== */
  trackByVisited = (_: number, v: VisitedCheckpointsDTO) => `${v.checkpointId}-${v.secret}`;
  trackByReview = (_: number, r: TourReview) => r.id;
}
