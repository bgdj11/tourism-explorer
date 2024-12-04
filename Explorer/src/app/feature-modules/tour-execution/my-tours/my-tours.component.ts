import { Component, OnInit } from '@angular/core';
import {TourDTO} from "../../tour-authoring/model/tour.model";
import { TourExecutionService } from '../tour.execution.service';
import { MarketplaceService } from "../../marketplace/marketplace.service";
import { TourManagementService } from "../../tour-authoring/tour-management.service";
import { forkJoin, map, switchMap } from 'rxjs';
import { TourReviewDTO } from '../../tour-authoring/model/tourReview.model';

@Component({
  selector: 'xp-my-tours',
  templateUrl: './my-tours.component.html',
  styleUrls: ['./my-tours.component.css']
})
export class MyToursComponent implements OnInit {
  purchasedTours: TourDTO[] = [];
  checkpoints: { [tourId: number]: string[] } = {};
  tourReviews:{ [tourId: number]: TourReviewDTO[]} = {} ;
  avgGrade: {[tourId:number]: number} = {};

  constructor(private tourExecutionService: TourExecutionService, private tourService: TourManagementService) { }

  ngOnInit(): void {
    // Učitavanje kupljenih tura kada komponenta bude inicijalizovana
    this.loadPurchasedTours();
  }

  // Metoda za učitavanje kupljenih tura
  loadPurchasedTours(): void {
    const touristId = 1; // Ovaj ID bi trebalo da preuzimate iz autentifikacije/tokensa
    this.tourExecutionService.getPurchasedTours(touristId).subscribe(
      (tours) => {
        this.purchasedTours = tours;
        this.loadCheckpointsForAllTours();
        this.purchasedTours.forEach(tour => {
        this.tourService.getTourReviews(tour.id).subscribe(
          (data) => {             
            this.avgGrade[tour.id] = 0;
            this.tourReviews[tour.id] = data.results;
            this.tourReviews[tour.id].forEach(element => {
              console.log("Tour review: " + element.comment)
              this.avgGrade[tour.id] += element.rating;
            });
          })
        });
      },
      (error) => {
        console.error('Error fetching purchased tours', error);
      }
    );
  }

  loadCheckpointsForAllTours(): void {
    // Create an array of observables where each observable fetches the checkpoints for a tour
    const toursWithCheckpoints$ = this.purchasedTours.map(tour => 
      this.getCheckpointsByTourId(tour.id).pipe(
        map(checkpoints => {
          // Ensure the checkpoints are set to the tour
          tour.tourCheckpoints = checkpoints;
          return tour;  // Return the updated tour
        })
      )
    );

    // Use forkJoin to wait for all checkpoints for all tours to be fetched
    forkJoin(toursWithCheckpoints$).subscribe(
      (updatedTours) => {
        // Once all tours have their checkpoints, update the tours array
        this.purchasedTours = updatedTours;  // This will trigger change detection in Angular
      },
      (error) => {
        console.error('Error loading checkpoints for tours', error);
      }
    );
  }

  getCheckpointsByTourId(tourId: number) {
    // First, get the list of checkpoint IDs for this tour
    return this.tourService.getCheckpointIdsByTourId(tourId).pipe(
      switchMap(checkpointIds => {
        // Sort checkpoint IDs (optional)
        checkpointIds.sort((a, b) => a - b);

        // Now, for each checkpoint ID, retrieve the details of the checkpoint
        const allCheckpoints$ = checkpointIds.map(id =>
          this.tourService.getCheckpointById(id)
        );

        // Use forkJoin to wait for all checkpoint details
        return forkJoin(allCheckpoints$);
      })
    );
  }

}
