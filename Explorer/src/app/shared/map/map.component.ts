import { Component, AfterViewInit, Input, Output, EventEmitter  } from '@angular/core';
import * as L from 'leaflet';
import {MapService} from "./map.service";

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private markers: L.Marker[] = [];

  @Input() initialCenter: [number, number] = [45.2396, 19.8227];
  @Input() initialZoom: number = 13;
  @Input() waypoints: { lat: number, lng: number }[] = [];

  @Output() mapClick = new EventEmitter<{ lat: number, lng: number }>();
  @Output() searchResult = new EventEmitter<{ lat: number, lng: number }>();

  constructor(private mapService: MapService) {
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
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
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();

  }

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

  setRoute(waypoints: { lat: number, lng: number }[]): void {
    const latLngPoints = waypoints.map(point => L.latLng(point.lat, point.lng));

    const routeControl = L.Routing.control({
      waypoints: latLngPoints,
      router: L.Routing.mapbox('pk.eyJ1IjoiYmdkajExIiwiYSI6ImNtMmtrZHpyZzAyZWoycXM5enphbXZia2UifQ.54XDMPHRsMN86I6gUbbOcQ', { profile: 'mapbox/walking' })
    }).addTo(this.map);

    routeControl.on('routesfound', function (e) {
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
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      const marker = new L.Marker([lat, lng]).addTo(this.map);

      this.markers.push(marker);

      marker.on('click', () => {
        this.map.removeLayer(marker);
        this.markers = this.markers.filter(m => m !== marker);
      });

      this.mapClick.emit({ lat, lng });
    });
  }
}
