import { Component, AfterViewInit  } from '@angular/core';
import * as L from 'leaflet';
import {MapService} from "./map.service";

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;

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

    // samo za testiranje
    //this.search();
    //this.setRoute();
  }

  // samo primer poziva , IZMENITI!
  search(): void {
    this.mapService.search('Strazilovska 19, Novi Sad').subscribe({
      next: (result) => {
        console.log(result);
        L.marker([result[0].lat, result[0].lon])
          .addTo(this.map)
          .bindPopup('Pozdrav iz Strazilovske 19.')
          .openPopup();
      },
      error: () => {},
    });
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      new L.Marker([lat, lng]).addTo(this.map);
    });
  }

  // prilagoditi za dalju upotrebu !
  setRoute(): void {
    const routeControl = L.Routing.control({
      waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)], // Ovde ubacujete vasu listu cekpointa, odnosto lat i long !
      router: L.routing.mapbox('pk.eyJ1IjoiYmdkajExIiwiYSI6ImNtMmtrZHpyZzAyZWoycXM5enphbXZia2UifQ.54XDMPHRsMN86I6gUbbOcQ', {profile: 'mapbox/walking'})
    }).addTo(this.map);

    routeControl.on('routesfound', function(e) {
      var routes = e.routes;
      var summary = routes[0].summary;
      //alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
    });
  }
}
