import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import {Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from './model/problem.model';
import { Equipment } from './model/my-equipment.model';
import { TouristEquipment } from './model/tourist-equipment.model';
import { TourDTO } from "../tour-authoring/model/tour.model";
import {TourExecution} from "./model/tour-execution.model";
import {TourReview} from "./model/review.model";

@Injectable({
    providedIn: 'root'
  })
  export class TourExecutionService {

    constructor(private http: HttpClient) { }

    getProblem(): Observable<PagedResults<Problem>> {
      return this.http.get<PagedResults<Problem>>(environment.apiHost + 'tourist/problems')
    }

    addProblem(problem: Problem): Observable<Problem> {
        return this.http.post<Problem>(environment.apiHost + 'tourist/problems', problem);
      }

    getEquipment(): Observable<PagedResults<Equipment>> {
        return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'tourist/touristEquipment')
      }

    getByTouristAndEquipment(touristId: number, equipmentId: number): Observable<TouristEquipment> {
        return this.http.get<TouristEquipment>(`${environment.apiHost}tourist/touristEquipment/tourist/${touristId}/equipment/${equipmentId}`);
      }

    deleteEquipment(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiHost}tourist/touristEquipment/${id}`);
      }

    addTouristEquipment(touristEquipment: TouristEquipment): Observable<TouristEquipment> {
        return this.http.post<TouristEquipment>(`${environment.apiHost}tourist/touristEquipment`, touristEquipment);
      }

    startTourExecution(tourId: number, userId: number): Observable<any> {
        return this.http.post<any>(`${environment.apiHost}tourist/tour-executions/start?tourId=${tourId}&userId=${userId}`, {});
      }

    getAllTours(): Observable<TourDTO[]> {
        return this.http.get<TourDTO[]>(`${environment.apiHost}tourist/tour-executions/all-tours`);
      }

    getTourExecutionStatus(tourId: number, userId: number): Observable<TourExecution> {
        return this.http.get<TourExecution>(`${environment.apiHost}tourist/tour-executions/status?tourId=${tourId}&userId=${userId}`);
      }

    completeTourExecution(executionId: number): Observable<void> {
      return this.http.post<void>(`${environment.apiHost}tourist/tour-executions/${executionId}/complete`, {});
    }

    abandonTourExecution(executionId: number): Observable<void> {
      return this.http.post<void>(`${environment.apiHost}tourist/tour-executions/${executionId}/abandon`, {});
    }

  // Prikaz svih recenzija za turu
  getAllReviews(tourId: number, page: number, pageSize: number): Observable<PagedResults<TourReview>> {
    return this.http.get<PagedResults<TourReview>>(`${environment.apiHost}author/tours/${tourId}/reviews?page=${page}&pageSize=${pageSize}`);
  }

  // Dodavanje nove recenzije za turu
  addReview(tourId: number, review: TourReview): Observable<TourReview> {
    return this.http.post<TourReview>(`${environment.apiHost}author/tours/${tourId}/reviews`, review);
  }

  // Ažuriranje postojeće recenzije
  updateReview(reviewId: number, review: TourReview): Observable<TourReview> {
    return this.http.put<TourReview>(`${environment.apiHost}author/tours/reviews/${reviewId}`, review);
  }

  // Brisanje recenzije
  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiHost}author/tours/reviews/${reviewId}`);
  }
  }
