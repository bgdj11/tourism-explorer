import { Component } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TourDTO } from '../../tour-authoring/model/tour.model';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'xp-tour-search',
  templateUrl: './tour-search.component.html',
  styleUrls: ['./tour-search.component.css']
})
export class TourSearchComponent {
  selectedPoint: { lat: number, lng: number } | null = null;
  distance: number = 0;
  tours: TourDTO[] = [];

  constructor(private layoutService: LayoutService) {}

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
