import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TouristProfile} from "./model/tourist-profile.model";
import {environment} from "../../env/environment";

@Injectable({
  providedIn: 'root'
})
export class TouristProfileService {
  private apiUrl = environment.apiHost + 'tourist/profiles'; // API endpoint

  constructor(private http: HttpClient) {}

  getTouristProfile(username: string): Observable<TouristProfile> {
    return this.http.get<TouristProfile>(`${this.apiUrl}/${username}`);
  }
}
