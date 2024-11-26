import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TouristPositionService } from 'src/app/shared/tourist-position.service';
import { MapComponent } from 'src/app/shared/map/map.component';
import { EncounterService } from 'src/app/shared/encounter.service'; // Import EncounterService
import { EncounterDTO } from 'src/app/shared/model/encounter'; // Import EncounterDTO

@Component({
  selector: 'location-simulator',
  templateUrl: './location-simulator.component.html',
  styleUrls: ['./location-simulator.component.css']
})
export class LocationSimulatorComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  currentLocation: { lat: number, lng: number } | null = null;
  user: User | undefined;
  encounters: EncounterDTO[] = []; // Store fetched encounters

  constructor(
    private authService: AuthService,
    private touristPositionService: TouristPositionService,
    private encounterService: EncounterService // Inject EncounterService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user && user.id) {
        // Fetch the current user location
        this.touristPositionService.getPosition(user.id).subscribe(
          location => {
            this.currentLocation = location;

            // Set user location on map
            if (this.currentLocation) {
              this.mapComponent.setUserLocation(this.currentLocation.lat, this.currentLocation.lng);
            }
          },
          error => {
            console.error('Error fetching location:', error);
          }
        );
      }
    });
  }

  // Handle location selection from the map
  onLocationSelected(location: { lat: number, lng: number }): void {
    this.currentLocation = location;

    // Save the selected location for the tourist
    if (this.user && this.user.role === 'tourist') {
      this.touristPositionService.setPosition(this.user.id, location.lat, location.lng).subscribe(
        () => {
          console.log('Location saved successfully');
        },
        error => {
          console.error('Error saving location:', error);
        }
      );
    }
  }

  showEncounters(): void {
    this.encounterService.getEncounters(1, 10).subscribe(
      (response: any) => {
        if (response && response.results) {
          this.encounters = response.results.map((encounter: any) => ({
            id: encounter.id,
            name: encounter.name,
            description: encounter.description,
            location: {
              latitude: encounter.location.latitude,
              longitude: encounter.location.longitude
            },
            xp: encounter.xp,
            status: encounter.status === 0 ? 'DRAFT' : encounter.status === 1 ? 'ACTIVE' : 'ARCHIVED',
            //type: encounter.type === 0 ? 'SOCIAL' : encounter.type === 1 ? 'LOCATION' : 'MISC',
            type: encounter.type,
            publishedDate: encounter.publishedDate,
            archivedDate: encounter.archivedDate,
            authorId: encounter.authorId
          }));
          
        
          // Prosleđivanje encountera mapi
          this.mapComponent.showEncountersOnMap(this.encounters);
        } else {
          console.error('Invalid response structure:', response);
        }
      },
      error => {
        console.error('Error fetching encounters:', error);
      }
    );
  }

}
