import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourPreferences } from './model/tour-preferences.model';
import { environment } from 'src/env/environment';
import {TourDTO} from "../tour-authoring/model/tour.model";
import {CheckpointDTO} from "../tour-authoring/model/checkpoint.model";
import { TourProblem } from './model/tour-problem';

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

  private apiUrl = environment.apiHost + 'author/tours';
  getTours(page: number, pageSize: number): Observable<PagedResults<TourDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResults<TourDTO>>(this.apiUrl, { params });
  }

  getCheckpointIdsByTourId(tourId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${tourId}/checkpoint-ids`);
  }

  private checkpointUrl = environment.apiHost + 'author/tours/tour-checkpoints';
  getCheckpointById(checkpointId: number): Observable<CheckpointDTO> {
    return this.http.get<CheckpointDTO>(`${this.checkpointUrl}/${checkpointId}`);
  }

  addProblem(problem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'tourProblem', problem);
  }

  getTour(tourId: number): Observable<TourDTO>{
    return this.http.get<TourDTO>(`${environment.apiHost}tourProblem/tourForTourProblem/${tourId}`);
  }

}
