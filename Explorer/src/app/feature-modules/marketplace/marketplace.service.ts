import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourPreferences } from './model/tour-preferences.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getTourPreferences(): Observable<PagedResults<TourPreferences>> {
    return this.http.get<PagedResults<TourPreferences>>(environment.apiHost + 'tourist/tourPreferences');
  }

  addTourPreferences(tourPreferences: TourPreferences): Observable<TourPreferences> {
    return this.http.post<TourPreferences>(environment.apiHost + 'tourist/tourPreferences', tourPreferences)
  }

  deleteTourPreferences(id: number): Observable<TourPreferences> {
    return this.http.delete<TourPreferences>(environment.apiHost + 'tourist/tourPreferences/' + id);
  }
  
  updateTourPreferences(tourPreferences: TourPreferences): Observable<TourPreferences> {
    return this.http.put<TourPreferences>(environment.apiHost + 'tourist/tourPreferences/' + tourPreferences.id, tourPreferences);
  }
}
