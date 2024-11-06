import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppRating } from './model/appRating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { TourSearch } from './model/tour-search.model';

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

    getAllTours(): Observable<PagedResults<TourSearch>> {
      return this.http.get<PagedResults<TourSearch>>(environment.apiHost + 'author/tours');
    }
}
