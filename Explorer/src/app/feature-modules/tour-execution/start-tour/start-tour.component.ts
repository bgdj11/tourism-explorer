import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour.execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourDTO } from '../../tour-authoring/model/tour.model';
import { TourExecution } from "../model/tour-execution.model";
import { TourReview } from "../model/review.model";
import { Observable } from 'rxjs';

@Component({
  selector: 'xp-start-tour',
  templateUrl: './start-tour.component.html',
  styleUrls: ['./start-tour.component.css']
})
export class StartTourComponent implements OnInit {
  errorMessage: string | null = null;
  tours: TourDTO[] = [];
  activeTourExecution: TourExecution | null = null;
  reviews: TourReview[] = [];
  userId: number = 0;
  showReviewForTour = false;
  review: TourReview = {
    id: 1,
    rating: 0,
    comment: '',
    tourDate: new Date(),
    reviewDate: new Date(),
    images: [],
    tour: {
      id: 1,
      name: '',
      description: '',
      weight: '',
      tags: [],
      status: 0,
      price: 0,
      lengthInKm: 0,
      equipments: [],
      tourCheckpoints: []
    },
    personn: { userId: this.userId, name: 'string', email: 'test@test.com', surname: 'string' }
  };

  editingReview: boolean = false; // Dodato za praćenje izmene recenzije
  reviewToEdit: TourReview = {... this.review}; // Dodato za čuvanje recenzije koja se menja

  constructor(
    private tourExecutionService: TourExecutionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkActiveTour();
    this.userId = this.authService.user$.getValue().id;
  }

  checkActiveTour(): void {
    const savedExecution = localStorage.getItem('activeTourExecution');
    if (savedExecution) {
      this.activeTourExecution = JSON.parse(savedExecution) as TourExecution;
      this.tours = this.tours.filter(tour => tour.id === this.activeTourExecution?.tourId);
    } else {
      this.loadTours();
    }
  }

  loadTours(): void {
    this.tourExecutionService.getAllTours().subscribe(
      (tours: TourDTO[]) => { this.tours = tours; },
      error => { this.errorMessage = 'Failed to load tours.'; }
    );
  }

  loadReviews(tourId: number): void {
    this.tourExecutionService.getAllReviews(tourId, 1, 10).subscribe(
      (response) => {
        this.reviews = response.results;
        console.log('Reviews:', this.reviews);
        },
      (error) => { this.errorMessage = 'Failed to load reviews.'; }
    );
  }

  startTour(tourId: number): void {
    this.tourExecutionService.startTourExecution(tourId, this.userId).subscribe(
      (execution: TourExecution) => {
        this.activeTourExecution = execution;
        localStorage.setItem('activeTourExecution', JSON.stringify(execution));
        this.loadReviews(tourId);
      },
      error => { this.errorMessage = 'Failed to start the tour.'; }
    );
  }

  submitReview(): void {
    this.review = {...this.review, personn: { userId: this.userId, name: 'string', email: 'test.test.com', surname: 'string' }};
    this.tourExecutionService.addReview(this.activeTourExecution!.tourId, this.review).subscribe(
      () => {
        this.showAlert('Review submitted successfully.');
        this.loadReviews(this.activeTourExecution!.tourId); // Reload reviews to include the new one
        this.resetReviewForm();
      },
      error => { this.errorMessage = 'Error submitting review.'; }
    );
  }

  editReview(review: TourReview): void {
    this.editingReview = true; // Omogućava prikazivanje forme za izmenu
    this.reviewToEdit = { ...review }; // Postavlja recenziju koju želimo da menjamo
  }

  submitEditedReview(): void {
    if (this.reviewToEdit) {
      this.tourExecutionService.updateReview(this.reviewToEdit.id, this.reviewToEdit).subscribe(
        () => {
          this.showAlert('Review updated successfully.');
          this.loadReviews(this.activeTourExecution!.tourId); // Reload reviews to show the update
          this.resetEditForm(); // Resetovanje forme
          this.editingReview = false; // Završava editovanje
          this.cancelEdit();
        },
        error => { this.errorMessage = 'Error updating review.'; }
      );
    }
  }

  cancelEdit(): void {
    this.resetEditForm(); // Resetuje formu kad korisnik otkaže izmenu
  }

  resetEditForm(): void {
    this.editingReview = false;
    this.resetReviewForm();
    this.reviewToEdit = {...this.review}; // Očisti podatke recenzije koju editujemo
  }

  canEditReview(review: TourReview): boolean {
    return review.personn.userId === this.userId;
  }

  showAlert(message: string): void {
    alert(message); // Basic alert, you can replace with a custom notification if needed
  }

  resetReviewForm(): void {
    this.review = {
      id: 1,
      rating: 0,
      comment: '',
      tourDate: new Date(),
      reviewDate: new Date(),
      images: [],
      tour: {
        id: 1,
        name: '',
        description: '',
        weight: '',
        tags: [],
        status: 0,
        price: 0,
        lengthInKm: 0,
        equipments: [],
        tourCheckpoints: []
      },
      personn: { userId: this.userId, name: 'string', email: 'test@test.com', surname: 'string' }
    };
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

  // Dodato: Provera mogućnosti slanja recenzije
  checkReviewEligibility(): void {
    if (!this.activeTourExecution) {
      return;
    }
  }

  showReviews(tourId: number): void {
    this.loadReviews(tourId);
    this.showReviewForTour = !this.showReviewForTour;
  }
}
