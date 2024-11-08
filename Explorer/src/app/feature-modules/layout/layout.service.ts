import { HttpClient,  HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppRating } from './model/appRating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { TourDTO } from 'src/app/feature-modules/tour-authoring/model/tour.model'

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

    getAllTours(page: number, pageSize: number): Observable<PagedResults<TourDTO>> {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString());
  
      return this.http.get<PagedResults<TourDTO>>(environment.apiHost + 'author/tours', { params });
    }
}
