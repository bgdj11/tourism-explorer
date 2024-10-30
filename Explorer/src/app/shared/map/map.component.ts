import { Component, AfterViewInit, Input, Output, EventEmitter  } from '@angular/core';
import * as L from 'leaflet';
import {MapService} from "./map.service";

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  map: any;
  private markers: L.Marker[] = [];
  singleMarker: L.Marker | null = null;
  private routeControl: any;

  @Input() initialCenter: [number, number] = [45.2396, 19.8227];
  @Input() initialZoom: number = 13;
  @Input() waypoints: { lat: number, lng: number }[] = [];
  @Input() uniqueId: string = '';
  @Input() isModalMap: boolean = false;
  @Input() initialCheckpoint: {lat?: number, lng?: number} = {};

  @Output() mapClick = new EventEmitter<{ lat: number, lng: number }>();
  @Output() searchResult = new EventEmitter<{ lat: number, lng: number }>();

  constructor(private mapService: MapService) {
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
  setRoute(waypoints: { lat: number, lng: number }[]): void {
    const latLngPoints = waypoints.map(point => L.latLng(point.lat, point.lng));

    //Brisanje markera po ponovnom pritisku na turu
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
    //Brisanje leafleta po ponovnom pritisku na turu
    if (this.routeControl) {
      this.map.removeControl(this.routeControl); 
      this.routeControl = null;
    }

    this.routeControl = L.Routing.control({
      waypoints: latLngPoints,
      routeWhileDragging: false,
      lineOptions: { addWaypoints: false, extendToWaypoints: false, missingRouteTolerance: 0},
      router: L.Routing.mapbox('pk.eyJ1IjoiYmdkajExIiwiYSI6ImNtMmtrZHpyZzAyZWoycXM5enphbXZia2UifQ.54XDMPHRsMN86I6gUbbOcQ', { profile: 'mapbox/walking' })
    }).addTo(this.map);

    
    this.routeControl.on('routesfound', function (e: { routes: any; }) {
      const routes = e.routes;
      const summary = routes[0].summary;
      alert(
        'Total distance is ' +
        (summary.totalDistance / 1000).toFixed(2) +
        ' km and total time is ' +
        Math.round((summary.totalTime % 3600) / 60) +
        ' minutes'
      );
    });
    waypoints.forEach(waypoint => {
      const marker = L.marker([waypoint.lat, waypoint.lng], { draggable: false }).addTo(this.map);
      this.markers.push(marker);
    });
  }
// dobijem nazad lat long kad kliknem na mapu
  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      
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
