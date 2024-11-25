import { Component,OnInit} from '@angular/core';
import { TourPreferences } from '../model/tour-preferences.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourDTO } from '../../tour-authoring/model/tour.model';
import { TourManagementService } from '../../tour-authoring/tour-management.service';

@Component({
  selector: 'xp-tour-preferences',
  templateUrl: './tour-preferences.component.html',
  styleUrls: ['./tour-preferences.component.css']
})

export class TourPreferencesComponent implements OnInit {
  
  tourPreferences: TourPreferences[] = [];
  selectedTourPreferences: TourPreferences;
  shouldRenderTourPreferencesForm: boolean = false;
  shouldEdit: boolean = false;
  tours: TourDTO[] = [];

  constructor(private service: MarketplaceService, private tourService: TourManagementService) { }

  ngOnInit(): void {
    this.getTourPreferences();
    this.loadTours();
  }

  loadTours(): void {
    this.tourService.getTours(1, 1000).subscribe(
      (data) => {
        this.tours = data.results.filter((t) => t.status === 1);
      },
      (error) => {
        console.error('Error fetching tours:', error);
      }
    );
  }

  getTourImage(tour: TourDTO): string {
    const firstCheckpoint = tour.tourCheckpoints?.[0];
    return firstCheckpoint?.image || '../../../../assets/bck.jpg';
  }

  deleteTourPreferences(id: number): void {
    this.service.deleteTourPreferences(id).subscribe({
      next: () => {
        this.getTourPreferences();
      }
    })
  }

  getTourPreferences(): void {
    this.service.getTourPreferences().subscribe({
      next: (result: PagedResults<TourPreferences>) => {
        this.tourPreferences = result.results;
      },
      error: () => {
      }
    })
  }

  onEditClicked(tourPreferences: TourPreferences): void {
    this.selectedTourPreferences = tourPreferences;
    this.shouldRenderTourPreferencesForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderTourPreferencesForm = true;
  }


  getDifficultyString(difficulty: number): string {
    switch (difficulty) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      default:
        return 'Unknown';
    }
  }
}
