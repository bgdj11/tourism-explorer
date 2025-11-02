import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EncounterDTO } from './model/encounter';
import {environment} from "../../env/environment";

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  private apiUrl = environment.apiHost + 'administrator/encounters'; // Backend API endpoint

  constructor(private http: HttpClient) {}

  getEncounters(page: number, pageSize: number): Observable<EncounterDTO[]> {
    return this.http.get<EncounterDTO[]>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }
  updateEncounter(encounter: EncounterDTO): Observable<EncounterDTO> {
    console.log("Encounter: ")
    return this.http.put<EncounterDTO>(`${this.apiUrl}/` + encounter.id,encounter);
  }
  checkTouristsInEncounters(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/check-tourists-in-encounters`, {}); // Dodato prazno telo {}
  }
}
