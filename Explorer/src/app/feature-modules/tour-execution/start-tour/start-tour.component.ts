import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { TourExecutionService } from 'src/app/feature-modules/tour-execution/tour.execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourDTO } from '../../tour-authoring/model/tour.model';
import { TourExecution } from "../model/tour-execution.model";
import { TourReview } from "../model/review.model";
import { Observable } from 'rxjs';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MapLocation } from 'src/app/feature-modules/tour-execution/model/map-location.model';
import {VisitedCheckpointsDTO} from "../model/visitedCheckpoints.model";


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

    // Pokreće proveru checkpointova i lokacije na svakih 10 sekundi ako postoji aktivna tura
    const savedExecution = localStorage.getItem('activeTourExecution');
    const userId = this.authService.user$.getValue().id;
    if (savedExecution && userId) {
      const execution = JSON.parse(savedExecution) as TourExecution;
      this.executionId = execution.id;
      this.startCheckingVisitedCheckpoints(userId);
    }
  }
  
  ngOnDestroy(): void {
      if (this.checkIntervalSubscription) {
          this.checkIntervalSubscription.unsubscribe();
      }
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


  loadReviews(tourId: number): void {
    this.tourExecutionService.getAllReviews(tourId, 1, 10).subscribe(
      (response) => {
        this.reviews = response.results;
        console.log('Reviews:', this.reviews);
        },
      (error) => { this.errorMessage = 'Failed to load reviews.'; }
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

   
    // Provera stanja pokrenute ture pri učitavanju komponente
    checkActiveTour(): void {
        const savedExecution = localStorage.getItem('activeTourExecution');

        if (savedExecution) {
            const execution = JSON.parse(savedExecution) as TourExecution;
            console.log(execution);
            this.tourExecutionService.getTourExecutionStatus(execution.tourId, execution.userId).subscribe(
                (existingExecution) => {
                    this.activeTourExecution = existingExecution;
                    this.executionId = existingExecution.id;
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

    startTour(tourId: number): void {
        const userId = this.authService.user$.getValue().id;

        if (!tourId || tourId <= 0) {
            this.errorMessage = 'Invalid Tour ID. Please enter a positive number.';
            return;
        }
        // Pokreni turu i učitaj status nove ture
        this.tourExecutionService.startTourExecution(tourId, userId).subscribe(
            (execution: TourExecution) => {
                // Sačuvaj activeTourExecution sa svim detaljima uključujući executionId
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
        this.tourExecutionService.getPosition(userId).subscribe(
            (position) => {
                this.currentLocation = position.currentLocation;
                this.tourExecutionService.startTourExecution(tourId, userId).subscribe(
                    (response) => {
                        if (response && response.id) {
                            this.executionId = response.id;
                            alert('Tour execution started successfully.');
                            /*                  this.activeTourExecution = response;
                                              localStorage.setItem('activeTourExecution', JSON.stringify(response));

                                              // Nakon što se tura uspešno pokrene, prikaži samo aktivnu turu
                                              this.tours = this.tours.filter(tour => tour.id === tourId);*/

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
