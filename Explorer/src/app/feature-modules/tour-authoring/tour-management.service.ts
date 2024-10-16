import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PagedResults} from "../../shared/model/paged-results.model";
import {TourDTO} from "./model/tour.model";
import {environment} from "../../../env/environment";

@Injectable({
  providedIn: 'root'
})
export class TourManagementService {
  private apiUrl = environment.apiHost + 'author/tours';
  constructor(private http: HttpClient) { }

// Metoda za dobavljanje tura sa paginacijom
  getTours(page: number, pageSize: number): Observable<PagedResults<TourDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResults<TourDTO>>(this.apiUrl, { params });
  }

  createTour(tour: TourDTO): Observable<TourDTO> {
    return this.http.post<TourDTO>(this.apiUrl, tour);
  }

  updateTour(tour: TourDTO): Observable<TourDTO> {
    return this.http.put<TourDTO>(`${this.apiUrl}/${tour.id}`, tour);
  }

  deleteTour(tourId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tourId}`);
  }
}
