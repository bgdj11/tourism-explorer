import { Component,OnInit} from '@angular/core';
import { TourPreferences } from '../model/tour-preferences.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourDTO } from '../../tour-authoring/model/tour.model';
import { TourManagementService } from '../../tour-authoring/tour-management.service';
import { LayoutService } from '../../layout/layout.service';

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
  shouldRenderTourSearch: boolean = false;
  selectedPoint: { lat: number, lng: number } | null = null;
  distance: number = 0;

  constructor(private service: MarketplaceService, private tourService: TourManagementService, private layoutService: LayoutService) { }

  ngOnInit(): void {
    this.getTourPreferences();
    //this.loadTours();
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

  openTourSearch(): void {
    this.shouldRenderTourSearch = true;

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


  onMapClick(event: { lat: number, lng: number }): void {
    this.selectedPoint = event;
    console.log("Selected point:", this.selectedPoint);
  }

  search(): void {
    if (this.selectedPoint && this.distance > 0) {
      console.log(
        `Searching from point: ${this.selectedPoint.lat}, ${this.selectedPoint.lng} with distance: ${this.distance} km`
      );
  
      this.layoutService.getAllTours().subscribe({
        next: (pagedResults) => {
          const filteredTours = this.filterToursByDistance(pagedResults);
          this.tours = filteredTours;
          console.log('Filtered tours:', this.tours);
        },
        error: (err) => {
          console.error('Error retrieving tours:', err);
          alert('Došlo je do greške prilikom preuzimanja tura.');
        },
      });   
    } else {
      alert('Molimo izaberite tačku na mapi i unesite validnu distancu.');
    }
  }

  haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  }

  // Filtrira ture na osnovu udaljenosti od tačke na mapi
  filterToursByDistance(tours: TourDTO[]): TourDTO[] {
    return tours.filter(tour => {
      for (let checkpoint of tour.tourCheckpoints || []) {
        if (checkpoint.latitude !== undefined && checkpoint.longitude !== undefined) {
          const distanceToCheckpoint = this.haversine(
            this.selectedPoint!.lat,       
            this.selectedPoint!.lng, 
            checkpoint.latitude, 
            checkpoint.longitude
          );
  
          if (distanceToCheckpoint <= this.distance) {
            return true;
          }
        }
      }
      return false; 
    });
  }
}
