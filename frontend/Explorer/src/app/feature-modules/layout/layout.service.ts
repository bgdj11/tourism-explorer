import { HttpClient,  HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppRating } from './model/appRating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { TourReviewDTO } from '../tour-authoring/model/tourReview.model';
import { TourDTO } from 'src/app/feature-modules/tour-authoring/model/tour.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient) { }
    getAppRating(): Observable<PagedResults<AppRating>> { 
      return this.http.get<PagedResults<AppRating>>(environment.apiHost + 'ratings/appRating')
    }
    addRating(rating: AppRating): Observable<AppRating> {
      return this.http.post<AppRating>(environment.apiHost + 'ratings/appRating', rating);
    }
    
    getAllTours(): Observable<TourDTO[]> {
      return this.http.get<TourDTO[]>(environment.apiHost + 'tourist/tours');
    }
    
}
