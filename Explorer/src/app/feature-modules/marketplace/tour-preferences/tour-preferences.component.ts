import { Component,OnInit} from '@angular/core';
import { TourPreferences } from '../model/tour-preferences.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

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

  constructor(private service: MarketplaceService) { }

  ngOnInit(): void {
    this.getTourPreferences();
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
