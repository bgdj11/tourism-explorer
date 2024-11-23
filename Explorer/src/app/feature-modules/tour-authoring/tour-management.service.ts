import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {PagedResults} from "../../shared/model/paged-results.model";
import {TourDTO} from "./model/tour.model";
import {environment} from "../../../env/environment";
import { CheckpointDTO } from './model/checkpoint.model';
import {Equipment} from "../administration/model/equipment.model";
import { ClubDTO } from './model/club.model';
import { TransportType, TravelTimeDTO } from './model/travelTime.model';
import { TourReviewDTO } from './model/tourReview.model';
import { MembershipRequest } from './model/membershipRequest.model';
import { DailyAgendaDTO } from './model/DailyAgendaDTO.model';

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

  addNewTravelTime(newTravelTime: TravelTimeDTO, tourId: number): Observable<TravelTimeDTO> {
    console.log(newTravelTime)
    console.log(this.apiUrl + '/' + tourId + '/time');
    return this.http.post<TravelTimeDTO>(this.apiUrl + '/' + tourId + '/addNewTravelTime', newTravelTime);
  }
  addNewDailyAgenda(newDailyAgenda: DailyAgendaDTO, tourId: number): Observable<DailyAgendaDTO> {
    return this.http.post<DailyAgendaDTO>(this.apiUrl + '/' + tourId + '/addNewDailyAgenda', newDailyAgenda);
  }
  createCheckpoint(checkpoint: CheckpointDTO, tourId: number): Observable<CheckpointDTO> {
    console.log(checkpoint)
    return this.http.post<CheckpointDTO>(`${this.apiUrl}/${tourId}/checkpoint`,checkpoint);
  }
  archiveTour(tourId: number): Observable<void>{
    return this.http.post<void>(`${this.apiUrl}/${tourId}/archive`,{});
  }

  publishTour(tourId: number): Observable<any>{
    return this.http.post<void>(`${this.apiUrl}/${tourId}/publish`,{}).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
  
        // Extract the error details from the response
        if (error.error && error.error.detail) {
          errorMessage = error.error.detail; // Get the `detail` field from the ProblemDetails object
        }
  
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  getTourReviews(tourId: number): Observable<PagedResults<TourReviewDTO>> {
    return this.http.get<PagedResults<TourReviewDTO>>(this.apiUrl + '/'+ tourId + '/reviews');
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

  updateCheckpoint(newCheckpoint: CheckpointDTO) {
    return this.http.put<CheckpointDTO>(`${this.checkpointUrl}/${newCheckpoint.id}`, newCheckpoint);
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


  createMembershipRequest(clubId: number, request: MembershipRequest): Observable<MembershipRequest> {
    return this.http.post<MembershipRequest>(environment.apiHost + `tourist/club/${clubId}/memshiprequest`, request);
  }

  getMembershipRequests(clubId: number): Observable<{ results: MembershipRequest[], totalCount: number }> {
    return this.http.get<{ results: MembershipRequest[], totalCount: number }>(
      environment.apiHost + `tourist/club/${clubId}/memshiprequest`
    );
  }
  
  isTouristInvited(clubId: number, touristId: number): Observable<boolean> {
    return this.http.get<boolean>(environment.apiHost + `tourist/club/${clubId}/memshiprequest/is-tourist-invited/${touristId}`);
  }

  deleteMembershipRequest(clubId: number, id: number): Observable<void> {
    return this.http.delete<void>(environment.apiHost + `tourist/club/${clubId}/memshiprequest/${id}`);
  }
  
  
  


}
