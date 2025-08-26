import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TouristProfile } from './model/tourist-profile.model';
import { environment } from '../../env/environment';
import {Coupon} from "../feature-modules/marketplace/model/coupon";

class PagedResult<T> {
}

@Injectable({
  providedIn: 'root'
})
export class TouristProfileService {
  private apiUrl = environment.apiHost + 'tourist/profiles'; // API endpoint
  private apiUrlCup = `${environment.apiHost}author/coupon`;
  constructor(private http: HttpClient) {}

  getTouristProfile(username: string): Observable<TouristProfile> {
    return this.http.get<TouristProfile>(`${this.apiUrl}/${username}`);
  }

  syncCompletedEncounters(username: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${username}/sync-completed-encounters`, {});
  }

  getCouponsByIds(couponIds: number[]): Observable<Coupon[]> {
    return this.http.post<Coupon[]>(`${this.apiUrlCup}/get-by-ids`, couponIds);
  }
}
