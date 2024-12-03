import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { TourDTO } from '../../tour-authoring/model/tour.model';
import { TourManagementService } from '../../tour-authoring/tour-management.service';
import { latLng, tileLayer, marker, Map, icon } from 'leaflet';


@Component({
  selector: 'xp-tours-view',
  templateUrl: './tours-view.component.html',
  styleUrls: ['./tours-view.component.css']
})
export class ToursViewComponent implements OnInit, AfterViewChecked {
  tours: TourDTO[] = [];
  totalCount: number = 0;

  constructor(private tourService: TourManagementService) {}

  ngOnInit(): void {
    console.log('Initializing Tours list...');
    this.loadTours();
  }

  ngAfterViewChecked(): void {
    this.tours.forEach((tour) => {
      const firstCheckpoint = tour.tourCheckpoints?.[0];
      if (firstCheckpoint && firstCheckpoint.latitude && firstCheckpoint.longitude) {
        this.initMap(tour.id, firstCheckpoint.latitude, firstCheckpoint.longitude);
      }
    });
  }

  loadTours(): void {
    this.tourService.getTours(1, 1000).subscribe(
      (data) => {
        this.tours = data.results.filter((t) => t.status === 1);
        this.totalCount = this.tours.length;
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

  getTourLocation(tour: TourDTO): string {
    const firstCheckpoint = tour.tourCheckpoints?.[0];
    return firstCheckpoint
      ? `${firstCheckpoint.latitude}, ${firstCheckpoint.longitude}`
      : 'Unknown location';
  }

  initMap(tourId: number, latitude: number, longitude: number): void {
    const mapId = `map-${tourId}`;
    const map = new Map(mapId, {
      center: latLng(latitude, longitude),
      zoom: 7
    });
  
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
    const standardIcon = icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', 
      iconSize: [20, 35], // Veličina ikone
      iconAnchor: [12, 41], 
      popupAnchor: [1, -34], 
    });
  
    marker([latitude, longitude], { icon: standardIcon }).addTo(map).bindPopup('Tour Location');
  }

  scrollLeft() {
    const container = document.querySelector('.tour-container') as HTMLElement;
    container.scrollBy({
      left: -300, // Pomeraj za širinu jedne kartice
      behavior: 'smooth',
    });
  }
  
  scrollRight() {
    const container = document.querySelector('.tour-container') as HTMLElement;
    container.scrollBy({
      left: 300, // Pomeraj za širinu jedne kartice
      behavior: 'smooth',
    });
  }
  
}

/*<img [src]="getTourImage(tour)" alt="Tour Image" />*/
