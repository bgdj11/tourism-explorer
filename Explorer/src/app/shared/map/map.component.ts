import { Component, AfterViewInit, Input, Output, EventEmitter  } from '@angular/core';
import * as L from 'leaflet';
import {MapService} from "./map.service";
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import {EncounterDTO} from "../model/encounter";
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  map: any;
  private markers: L.Marker[] = [];
  private userMarker: L.Marker | null = null;
  private currentLengthInKm: number;
  private currentLocation: { lat: number, lng: number } | null = null;
  singleMarker: L.Marker | null = null;
  private routeControl: any;

  @Input() user: User | undefined;
  @Input() initialCenter: [number, number] = [45.2396, 19.8227];
  @Input() initialZoom: number = 13;
  @Input() waypoints: { lat: number, lng: number }[] = [];
  @Input() uniqueId: string = '';
  @Input() isModalMap: boolean = false;
  @Input() initialCheckpoint: {lat?: number, lng?: number} = {};
  @Input() encounters: EncounterDTO[] = [];

  @Output() mapClick = new EventEmitter<{ lat: number, lng: number }>();
  @Output() searchResult = new EventEmitter<{ lat: number, lng: number }>();

  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();

  constructor(private mapService: MapService, private renderer: Renderer2) {
  }

  private initMap(): void {
    if (this.map) {
      return;
    }
    const mapElementId = 'map' + this.uniqueId;
    this.map = L.map(mapElementId, {
      center: this.initialCenter,
      zoom: this.initialZoom,

    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);

    this.registerOnClick()

  }
  ngAfterViewInit(): void {
    console.log("Modal map component after view init...");

    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();

    if (this.isModalMap) {
      console.log("Initializing map inside modal...");
      this.invalidateSize();
      this.setUniqueMarker(this.initialCheckpoint.lat, this.initialCheckpoint.lng);
    }

  }

  public showEncountersOnMap(encounters: EncounterDTO[]): void {
    if (this.map) {
      this.setEncounterMarkers(encounters);
    } else {
      console.error("Map is not initialized yet.");
    }
  }

//string adresa, grad
  search(address: string): void {
    this.mapService.search(address).subscribe({
      next: (result) => {
        if (result && result.length > 0) {
          const lat = result[0].lat;
          const lng = result[0].lon;
          L.marker([lat, lng])
            .addTo(this.map)
            .bindPopup(`Found: ${address}`)
            .openPopup();

          this.searchResult.emit({ lat, lng });
        }
      },
      error: () => {
        console.error("Search failed.");
      },
    });
  }
  // prima niz lat,long [lat,long] ,
  setRoute(waypoints: { lat: number, lng: number }[]): Promise<number> {
    const latLngPoints = waypoints.map(point => L.latLng(point.lat, point.lng));

    // Clear markers and route control if it exists
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
      this.routeControl = null;
    }

    // Set up the route control
    this.routeControl = L.Routing.control({
      waypoints: latLngPoints,
      routeWhileDragging: false,
      lineOptions: { addWaypoints: false, extendToWaypoints: false, missingRouteTolerance: 0 },
      router: L.Routing.mapbox('pk.eyJ1IjoiYmdkajExIiwiYSI6ImNtMmtrZHpyZzAyZWoycXM5enphbXZia2UifQ.54XDMPHRsMN86I6gUbbOcQ', { profile: 'mapbox/walking' })
    }).addTo(this.map);

    // Return a promise that resolves with the route length in km
    return new Promise((resolve) => {
      this.routeControl.on('routesfound', (e: { routes: any; }) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        const lengthInKm = summary.totalDistance / 1000;

        alert(
          'Total distance is ' +
          lengthInKm.toFixed(2) +
          ' km and total time is ' +
          Math.round((summary.totalTime % 3600) / 60) +
          ' minutes'
        );

        console.log('Length in km:', lengthInKm);

        // Resolve the promise with the calculated distance
        resolve(lengthInKm);
      });
    });
}

  private touristIcon = L.icon({
    iconUrl: 'assets/tourist.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  public setEncounterMarkers(encounters: EncounterDTO[]): void {
    const encounterIcon = L.icon({
      iconUrl: 'assets/encounter.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    encounters.forEach(encounter => {
      const { location, name, description } = encounter;
      if (location) {
        const marker = L.marker([location.latitude, location.longitude], { icon: encounterIcon })
          .addTo(this.map);
          marker.bindPopup('<div id="popup-content"></div>');
          //marker.bindPopup(`<strong>${name}</strong><br>${description}<br>`);

          marker.on('popupopen', () => {
            const popupContent = document.getElementById('popup-content');
            if (popupContent) {
              // Add name and description
              popupContent.innerHTML = `
                <strong>${name}</strong><br>
                ${description}
              `;
    
              // Add the button conditionally
              if (encounter.type === 'MISC') {
                const button = this.renderer.createElement('button');
                button.className = 'add-me-btn';
                button.textContent = 'Set Completed';
                if(this.currentLocation){
                  
                  if (this.calculateDistance({lat: encounter.location.latitude, lng: encounter.location.longitude},this.currentLocation)*1000 > 100) {
                    this.renderer.setAttribute(button, 'disabled', 'true');
                    console.log("Distance: " + this.calculateDistance({lat: encounter.location.latitude, lng: encounter.location.longitude},this.currentLocation)*1000)
                
                  }
                }
                this.renderer.listen(button, 'click', () => this.setCompleted(encounter)); // Add click listener
                this.renderer.appendChild(popupContent, button);
              }
            }
          });

        this.markers.push(marker);
      }
    });
  }
  setCompleted(encounter: any) {
    console.log(`Set Completed clicked for:`, encounter);
    // Your logic here
  }
  private calculateDistance(location1: { lat: number; lng: number }, location2: { lat: number; lng: number }): number {
    const R = 6371; // Earth's radius in kilometers
    const lat1 = location1.lat;
    const lng1 = location1.lng;
    const lat2 = location2.lat;
    const lng2 = location2.lng;
  
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLng = this.degreesToRadians(lng2 - lng1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }
  
  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }


  public setUserLocation(lat: number, lng: number): void {
    if (this.userMarker) {
      this.userMarker.setLatLng([lat, lng]);
    } else {
      this.userMarker = L.marker([lat, lng], { icon: this.touristIcon }).addTo(this.map);
    }
    this.currentLocation = { lat, lng };
  }

  getCurrentLocation(): { lat: number, lng: number } | null {
    return this.currentLocation;
  }

// dobijem nazad lat long kad kliknem na mapu
  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      if (this.user && this.user.role === 'tourist') {
        // Ako je korisnik turista, koristi `setUserLocation` za jedinstveni marker
        this.setUserLocation(lat, lng);
        this.locationSelected.emit({ lat, lng });
      } else {

        // Ako je mapa u modalnom dijalogu, koristi jedinstveni marker
        if (this.isModalMap) {
          this.setUniqueMarker(lat, lng);
        } else {
          // Inače, dodaj novi marker kao i ranije
          const marker = new L.Marker([lat, lng]).addTo(this.map);
          this.markers.push(marker);

          marker.on('click', () => {
            this.map.removeLayer(marker);
            this.markers = this.markers.filter(m => m !== marker);
          });
        }
      }
      this.mapClick.emit({ lat, lng });
    });
  }

  public setUniqueMarker(lat?: number, lng?: number): void {
    if (lat !== undefined && lng !== undefined) {
      if (this.singleMarker) {
        this.map.removeLayer(this.singleMarker);
      }
      console.log(`Setting unique marker at: ${lat}, ${lng}`);
      this.singleMarker = L.marker([lat, lng]).addTo(this.map);
      this.map.setView([lat, lng], this.initialZoom);

      // Prisilno osveži mapu sa odlaganjem
      setTimeout(() => {
        this.map.invalidateSize();
        console.log("Map size invalidated after setting marker");
      }, 300);
    }
  }

  public addMarkerAfterInit(lat: number, lng: number): void {
    if (this.map) {
      this.setUniqueMarker(lat, lng);
      // Osveži veličinu mape nakon postavljanja markera
      setTimeout(() => {
        this.map.invalidateSize();
        console.log("Map size invalidated after setting marker");
      }, 300);
    } else {
      console.log("Map is not ready, delaying marker addition...");
      setTimeout(() => {
        this.addMarkerAfterInit(lat, lng);
      }, 200);
    }
  }

  public clearSingleMarker(): void {
    if (this.singleMarker) {
      this.map.removeLayer(this.singleMarker);
      this.singleMarker = null;
    }
  }

  public invalidateSize(): void {
    if (this.map) {
      console.log("Invalidating map size");
      setTimeout(() => {
        this.map.invalidateSize();
      }, 200);
    } else {
      console.log("Mapa nije inicijalizovana, ne mogu da izvršim invalidaciju.");
    }

  }
  ngOnDestroy(): void {
    // Očistite mapu kada se komponenta uništi
    if (this.map) {
      this.map.remove();
    }
  }

}
