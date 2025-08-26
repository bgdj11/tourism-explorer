import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class MemoryGameService {

  private apiUrl = environment.apiHost + 'games';

  constructor(private http: HttpClient) {}


  saveScore(gameId: number, userId: number, score: number): Observable<any> {
    const requestBody = {
      userId,
      score
    };
    return this.http.post(`${this.apiUrl}/${gameId}/add-score`, requestBody);
  }


  awardTopScorerCoupon(): Observable<any> {
    return this.http.post(`${this.apiUrl}/award-top-scorer`, {});
  }
}
