import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Account } from './model/account.model';
import { UserAccount } from './model/user-account.model';
import {Encounter} from "./model/encounter.model";
import {TourProblem, ProblemComment} from "../marketplace/model/tour-problem";
import {TourDTO} from "../tour-authoring/model/tour.model";
import { User } from '../../infrastructure/auth/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
  }

  getAccounts(): Observable<PagedResults<Account>> {
    return this.http.get<PagedResults<Account>>(environment.apiHost + 'administration/accounts')
  }
  updateAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(environment.apiHost + 'administration/accounts/' + account.id, account);
  }

  getUserAccount(): Observable<PagedResults<UserAccount>> {
    return this.http.get<PagedResults<UserAccount>>(environment.apiHost + 'EditAccount')
  }
  updateUserAccount(account: UserAccount): Observable<UserAccount> {
    return this.http.put<UserAccount>(environment.apiHost + 'EditAccount/' + account.id, account);
  }
  getEncounters(page: number, pageSize: number): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(
      `${environment.apiHost}administrator/encounters?page=${page}&pageSize=${pageSize}`,
    );
  }

  getEncounterById(id: number): Observable<Encounter> {
    return this.http.get<Encounter>(`${environment.apiHost}administrator/encounters/${id}`);
  }

  createEncounter(encounter: Encounter): Observable<Encounter> {
    const url = `${environment.apiHost}administrator/encounters`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    console.log('Payload being sent to server:', encounter);

    return this.http.post<Encounter>(url, encounter);
  }

  getToken(): string {
    // Pretpostavka: Token je sačuvan u localStorage nakon prijave
    return localStorage.getItem('authToken') || '';
  }

  updateEncounter(encounter: Encounter): Observable<Encounter> {
    return this.http.put<Encounter>(`${environment.apiHost}administrator/encounters/${encounter.id}`, encounter);
  }

  deleteEncounter(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiHost}administrator/encounters/${id}`);
  }

  publishEncounter(id: number): Observable<void> {
    return this.http.post<void>(`${environment.apiHost}administrator/encounters/${id}/publish`, {});
  }

  archiveEncounter(id: number): Observable<void> {
    return this.http.post<void>(`${environment.apiHost}administrator/encounters/${id}/archive`, {});
  }
  getTourProblems(userId: number): Observable<TourProblem[]>{
    return this.http.get<TourProblem[]>(`${environment.apiHost}tourProblem/forUser/${userId}`);
  }

  getTour(tourId: number): Observable<TourDTO>{
    return this.http.get<TourDTO>(`${environment.apiHost}tourProblem/tourForTourProblem/${tourId}`);
  }

  getUser(userId: number): Observable<User>{
    return this.http.get<User>(`${environment.apiHost}tourProblem/findUser/${userId}`);
  }

  updateProblem(problem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'tourProblem/update', problem);
  }

  addProblemComment(problemId: number, problemComment: ProblemComment): Observable<any> {
    return this.http.post<any>(`${environment.apiHost}tourProblem/${problemId}/comments`, 
      problemComment
    );
  }

}
