import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from './model/problem.model';


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

  }  