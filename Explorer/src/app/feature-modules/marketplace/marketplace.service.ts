import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourPreferences } from './model/tour-preferences.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getTourPreferences(): Observable<PagedResults<TourPreferences>> {
    return this.http.get<PagedResults<TourPreferences>>('https://localhost:44333/api/tourist/tourPreferences');
  }
}
