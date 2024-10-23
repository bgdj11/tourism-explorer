import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from './model/problem.model';
import { Equipment } from './model/my-equipment.model';
import { TouristEquipment } from './model/tourist-equipment.model';


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

  }  