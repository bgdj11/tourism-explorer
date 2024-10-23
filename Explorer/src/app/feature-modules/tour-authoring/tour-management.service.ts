import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PagedResults} from "../../shared/model/paged-results.model";
import {TourDTO} from "./model/tour.model";
import {environment} from "../../../env/environment";
import { CheckpointDTO } from './model/checkpoint.model';
import {Equipment} from "../administration/model/equipment.model";
import { ClubDTO } from './model/club.model';

@Injectable({
  providedIn: 'root'
})
export class TourManagementService {
  private apiUrl = environment.apiHost + 'author/tours';
  private checkpointUrl = environment.apiHost + 'author/tours/tour-checkpoints';
  private equipmentUrl = environment.apiHost + 'author/tours/equipment';
  private clubUrl = environment.apiHost + 'tourist/clubs';

  constructor(private http: HttpClient) { }

  getTours(page: number, pageSize: number): Observable<PagedResults<TourDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResults<TourDTO>>(this.apiUrl, { params });
  }

  addEquipmentToTour(tourId: number, equipmentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${tourId}/equipment-ids/${equipmentId}`, {});
  }

  removeEquipmentFromTour(tourId: number, equipmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tourId}/equipment-ids/${equipmentId}`);
  }

  getAllEquipment(page: number, pageSize: number): Observable<PagedResults<Equipment>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResults<Equipment>>(this.equipmentUrl, {params});
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

  getClubs(page: number, pageSize: number): Observable<PagedResults<ClubDTO>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

    return this.http.get<PagedResults<ClubDTO>>(this.clubUrl, { params });
  }

  getClubById(id : number) : Observable<ClubDTO> {
    return this.http.get<ClubDTO>(`${this.clubUrl}/${id}`);
  }

  createClub(club: ClubDTO): Observable<ClubDTO> {
    return this.http.post<ClubDTO>(environment.apiHost + 'tourist/clubs', club);

  }

  updateClub(club: ClubDTO): Observable<ClubDTO> {
    return this.http.put<ClubDTO>(environment.apiHost + 'tourist/clubs/' + club.id, club);
  }

  deleteClub(id: number): Observable<void> {
    return this.http.delete<void>(`${this.clubUrl}/${id}`);
  }
}
