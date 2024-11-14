import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from "../../env/environment";

// DTO objekat za turističku poziciju
export interface TouristPositionDto {
  id: number;
  touristId: number;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TouristPositionService {
  private apiUrl = environment.apiHost + 'tourist/position';

  constructor(private http: HttpClient) {}

  setPosition(touristId: number, latitude: number, longitude: number): Observable<any> {
    const url = `${this.apiUrl}/${touristId}`;
    const positionDto: TouristPositionDto = {
      id: 0,
      touristId,
      currentLocation: {
        latitude,
        longitude
      }
    };
    return this.http.post(url, positionDto);
  }

  getPosition(touristId: number): Observable<{ lat: number; lng: number }> {
    const url = `${this.apiUrl}/${touristId}`;
    return this.http.get<TouristPositionDto>(url).pipe(
      map((response: TouristPositionDto) => ({
        lat: response.currentLocation.latitude,
        lng: response.currentLocation.longitude
      }))
    );
  }
}
