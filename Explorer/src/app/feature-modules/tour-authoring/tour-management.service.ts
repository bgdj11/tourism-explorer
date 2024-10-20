import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PagedResults} from "../../shared/model/paged-results.model";
import {TourDTO} from "./model/tour.model";
import {environment} from "../../../env/environment";
import { CheckpointDTO } from './model/checkpoint.model';
import {Equipment} from "../administration/model/equipment.model";

@Injectable({
  providedIn: 'root'
})
export class TourManagementService {
  private apiUrl = environment.apiHost + 'author/tours';
  private checkpointUrl = environment.apiHost + 'author/tours/tour-checkpoints';
  private equipmentUrl = environment.apiHost + 'author/tours/equipment';

  constructor(private http: HttpClient) { }

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
  createCheckpoint(checkpoint: CheckpointDTO): Observable<CheckpointDTO> {
    return this.http.post<CheckpointDTO>(`${this.apiUrl}/tour-checkpoints`, checkpoint);
  }

  getCheckpointIdsByTourId(tourId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${tourId}/checkpoint-ids`);
  }

  getEquipmentIdsByTourId(tourId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${tourId}/equipment-ids`);
  }

  getCheckpointById(checkpointId: number): Observable<CheckpointDTO> {
    return this.http.get<CheckpointDTO>(`${this.checkpointUrl}/${checkpointId}`);
  }

  getEquipmentById(equipmentId: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.equipmentUrl}/${equipmentId}`);
  }
  updateTourCheckpointIds(tourId: number, checkpointId: number): Observable<TourDTO> {
    return this.http.put<TourDTO>(`${this.apiUrl}/${tourId}/checkpoint-ids/${checkpointId}`, {});
  }
}
