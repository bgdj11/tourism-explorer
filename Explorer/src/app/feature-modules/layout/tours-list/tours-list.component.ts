import { Component, OnInit } from '@angular/core';
import { TourDTO } from "../../tour-authoring/model/tour.model";
import { TourManagementService } from "../../tour-authoring/tour-management.service";
import { forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'xp-tours-list',  // Your selector remains the same
  templateUrl: './tours-list.component.html',
  styleUrls: ['./tours-list.component.css']
})
export class ToursListComponent implements OnInit {
  tours: TourDTO[] = [];  // Array to store the current page of tours
  totalCount: number = 0;  // Total number of tours
  pageSize: number = 3;  // Number of tours per page
  currentPage: number = 1;  // Current page (1-based index)
  hasActiveTours: boolean = false;
  constructor(private tourService: TourManagementService) {}

  ngOnInit(): void {
    this.loadTours();  // Load the first page of tours on initialization
  }

  // Load the tours for the current page
  loadTours(): void {
    this.tourService.getTours(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.tours = data.results;  // The array of tours for the current page
        this.totalCount = data.totalCount;  // Total number of tours available
        
        // Now, fetch checkpoints for all the tours and update the tours with those checkpoints
        this.loadCheckpointsForAllTours();
        console.log(this.tours);
        this.checkForActiveTours();
      },
      (error) => {
        console.error('Error fetching tours', error);
      }
    );
  }
  checkForActiveTours(): void {
    this.hasActiveTours = this.tours.some(tour => tour.status === 1);
  }
  // Fetch checkpoints for all tours
  loadCheckpointsForAllTours(): void {
    // Create an array of observables where each observable fetches the checkpoints for a tour
    const toursWithCheckpoints$ = this.tours.map(tour => 
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
        this.tours = updatedTours;  // This will trigger change detection in Angular
      },
      (error) => {
        console.error('Error loading checkpoints for tours', error);
      }
    );
  }

  // Get Checkpoints by Tour ID
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

  // Show the previous page (if possible)
  showPrevious(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTours();  // Load tours for the previous page
    }
  }

  // Show the next page (if possible)
  showNext(): void {
    // Check if there are more tours available (if the current page has less than pageSize)
    if (this.currentPage * this.pageSize < this.totalCount) {
      this.currentPage++;
      this.loadTours();  // Load tours for the next page
    }
  }
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
