import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { Blog } from './model/blog.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  getBlogs() : Observable<PagedResults<Blog>>{
    return this.http.get<PagedResults<Blog>>(environment.apiHost + 'author/blogs');
  }

  addBlogAuthor(blog : Blog) : Observable<Blog>{
    return this.http.post<Blog>(environment.apiHost + 'author/blogs',blog)
  }

  deleteBlogAuthor(id: number): Observable<Blog> {
    return this.http.delete<Blog>(environment.apiHost + 'author/blogs/' + id);
  }

  updateBlogAuthor(blog : Blog) : Observable<Blog> {
    return this.http.put<Blog>(environment.apiHost + 'author/blogs/' + blog.id,blog);
  }

  addBlogTourist(blog : Blog) : Observable<Blog>{
    return this.http.post<Blog>(environment.apiHost + 'tourist/blogs',blog)
  }

  deleteBlogTourist(id: number): Observable<Blog> {
    return this.http.delete<Blog>(environment.apiHost + 'tourist/blogs/' + id);
  }

  updateBlogTourist(blog : Blog) : Observable<Blog> {
    return this.http.put<Blog>(environment.apiHost + 'tourist/blogs/' + blog.id,blog);
  }
}
