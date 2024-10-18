import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Blog } from './blog/model/blog.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  getBlogs() : Observable<PagedResults<Blog>>{
    return this.http.get<PagedResults<Blog>>('https://localhost:44333/api/author/blogs');

  }
}
