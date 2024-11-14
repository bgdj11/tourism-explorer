import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Comment } from './model/comment.model'; 
import { Blog, Vote } from './model/blog.model';

import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  // Funkcija za preuzimanje user role iz JWT tokena
  getUserRoleFromToken(): string | null {
    const token = localStorage.getItem('access-token'); // Retrieve token from local storage
  
    if (!token) {
      console.error('Token not found');
      return null;
    }
  
    try {
      // JWT format: header.payload.signature -> We need the payload (second part)
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      const payloadObject = JSON.parse(decodedPayload);
  
      // Access the role field from the payload, specific key for role
      const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      return payloadObject[roleKey] || null; // Return role if exists, otherwise null
  
    } catch (error) {
      console.error('Error decoding token: ', error);
      return null;
    }
  }


  getComments(blogId: number): Observable<PagedResults<Comment>> {
    const userRole = this.getUserRoleFromToken();
  
    let endpoint = '';
    if (userRole === 'author') {
      endpoint = `author/blog/${blogId}/comment`;
    } else if (userRole === 'tourist') {
      endpoint = `tourist/blog/${blogId}/comment`;
    }else{
      endpoint = `author/blog/${blogId}/comment`;
    }
  
    return this.http.get<PagedResults<Comment>>(`${environment.apiHost}${endpoint}`);
  }

  addComment(comment: Comment): Observable<Comment>{

    const userRole = this.getUserRoleFromToken();

    let endpoint = '';
    if (userRole === 'author') {
      endpoint = `author/blog/${comment.blogId}/comment`;
    } else if (userRole === 'tourist') {
      endpoint = `tourist/blog/${comment.blogId}/comment`;
    }

    console.log('sss: ', userRole);
    return this.http.post<Comment>(environment.apiHost + endpoint, comment)
  }

  updateComment(comment: Comment): Observable<Comment>{
    const userRole = this.getUserRoleFromToken();

    let endpoint = '';
    if (userRole === 'author') {
      endpoint = `author/blog/${comment.blogId}/comment/`;
    } else if (userRole === 'tourist') {
      endpoint = `tourist/blog/${comment.blogId}/comment/`;
    }

    
    return this.http.put<Comment>(environment.apiHost + endpoint + comment.id, comment);
    
  }

  deleteComment(comment: Comment): Observable<Comment>{
    const userRole = this.getUserRoleFromToken();

    let endpoint = '';
    if (userRole === 'author') {
      endpoint = `author/blog/${comment.blogId}/comment/`;
    } else if (userRole === 'tourist') {
      endpoint = `tourist/blog/${comment.blogId}/comment/`;
    }

    return this.http.delete<Comment>(environment.apiHost + endpoint + comment.id);
  }
  
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

  addVoteTourist(vote: Vote) : Observable<Vote> {
    return this.http.put<Vote>(environment.apiHost + 'tourist/blogs/vote', vote);
  }

  addVoteAuthor(vote: Vote) : Observable<Vote> {
    return this.http.put<Vote>(environment.apiHost + 'author/blogs/vote', vote);
  }

  removeVote(vote: Vote): Observable<Vote> {
    return this.http.delete<Vote>(environment.apiHost + 'tourist/blogs/' + vote);
  }

  
}
