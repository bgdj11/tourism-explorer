import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourDTO } from '../../tour-authoring/model/tour.model';
import { TourManagementService } from '../../tour-authoring/tour-management.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'xp-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent implements OnInit {
  tour: TourDTO | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private tourService: TourManagementService
  ) {}

  ngOnInit(): void {
    const tourId = Number(this.route.snapshot.paramMap.get('id'));
    this.tourService.getTourById(tourId).subscribe({
      next: (data) => {
        this.tour = data;
        this.loading = false;

        if (this.tour) {
          this.loadCheckpoints(this.tour.id);
        }
      },
      error: (err) => {
        console.error('Error loading tour:', err);
        this.loading = false;
      }
    });
  }

  loadCheckpoints(tourId: number) {
    this.tourService.getCheckpointIdsByTourId(tourId).pipe(
      switchMap(ids => {
        if (!ids || ids.length === 0) return [ [] ]; // fallback
        const obs = ids.map(id => this.tourService.getCheckpointById(id));
        return forkJoin(obs);
      })
    ).subscribe({
      next: checkpoints => {
        if (this.tour) this.tour.tourCheckpoints = checkpoints;
        console.log('Loaded checkpoints:', checkpoints);
      },
      error: err => console.error('Error loading checkpoints', err)
    });
  }

  getTransportName(type: number | undefined): string {
    switch(type) {
      case 0: return 'Walking';
      case 1: return 'Bike';
      case 2: return 'Car';
      default: return 'Unknown';
    }
  }

}
