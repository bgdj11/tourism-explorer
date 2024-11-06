import { Component } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component';

@Component({
  selector: 'xp-tour-search',
  templateUrl: './tour-search.component.html',
  styleUrls: ['./tour-search.component.css']
})
export class TourSearchComponent {
  selectedPoint: { lat: number, lng: number } | null = null;
  distance: number = 0;

  onMapClick(event: { lat: number, lng: number }): void {
    this.selectedPoint = event;
    console.log("Selected point:", this.selectedPoint);
  }

  search(): void {
    if (this.selectedPoint && this.distance > 0) {
      console.log(`Searching from point: ${this.selectedPoint.lat}, ${this.selectedPoint.lng} with distance: ${this.distance} km`);
      
    } else {
      alert("Molimo izaberite tačku na mapi i unesite validnu distancu.");
    }
  }
}
