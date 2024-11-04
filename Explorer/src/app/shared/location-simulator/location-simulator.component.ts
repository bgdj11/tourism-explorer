import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TouristPositionService } from 'src/app/shared/tourist-position.service';
import { MapComponent } from 'src/app/shared/map/map.component';

@Component({
  selector: 'location-simulator',
  templateUrl: './location-simulator.component.html',
  styleUrls: ['./location-simulator.component.css']
})
export class LocationSimulatorComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  currentLocation: { lat: number, lng: number } | null = null;
  user: User | undefined;

  constructor(private authService: AuthService, private touristPositionService: TouristPositionService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user && user.id) {
        // Dobavljanje trenutne lokacije korisnika prilikom učitavanja
        this.touristPositionService.getPosition(user.id).subscribe(
          (location) => {
            this.currentLocation = location;

            // Ako je trenutna lokacija dostupna, postavi je na mapi
            if (this.currentLocation) {
              this.mapComponent.setUserLocation(this.currentLocation.lat, this.currentLocation.lng);
            }
          },
          (error) => {
            console.error('Error fetching location:', error);
          }
        );
      }
    });
  }

  onLocationSelected(location: { lat: number, lng: number }): void {
    this.currentLocation = location;

    // Proverimo da li je korisnik prijavljen kao turista pre nego što sačuvamo lokaciju
    if (this.user && this.user.role === 'tourist') {
      this.touristPositionService.setPosition(this.user.id, location.lat, location.lng).subscribe(
        () => {
          console.log('Location saved successfully');
        },
        (error) => {
          console.error('Error saving location:', error);
        }
      );
    }
  }
}
