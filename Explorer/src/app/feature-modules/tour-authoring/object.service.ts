import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {PagedResults} from "../../shared/model/paged-results.model";
import {ObjectDTO} from "./model/object.model";
import {environment} from "../../../env/environment";

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  private apiUrl = environment.apiHost + 'author/objects';
  constructor(private http: HttpClient) { }

  getObjects(page: number, pageSize: number): Observable<PagedResults<ObjectDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<PagedResults<ObjectDTO>>(this.apiUrl, { params });
  }
  createObject(object: ObjectDTO): Observable<ObjectDTO> {
    return this.http.post<ObjectDTO>(this.apiUrl, object);
  }
  updateObject(object: ObjectDTO): Observable<ObjectDTO> {
    return this.http.put<ObjectDTO>(`${this.apiUrl}/${object.id}`, object);
  }
  deleteObject(objectId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${objectId}`);
  }
}
