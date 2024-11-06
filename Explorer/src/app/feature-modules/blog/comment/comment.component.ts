import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Comment } from '../model/comment.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit{

  @Input() blogId: number;
  

  comments: Comment[] = [];
  selectedComment: Comment;
  shouldEdit: boolean; 
  user: User | undefined;
  isAuthor: boolean = false;
  isTourist: boolean = false;

  constructor(private service: BlogService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getComments()
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    if(this.user?.role === 'tourist'){
      this.isTourist=true;
    }
    if(this.user?.role==='author'){
      this.isAuthor=true;
    }
  }

  getComments(): void {
    this.service.getComments(this.blogId).subscribe({
      next: (result: PagedResults<Comment>) => {
        this.comments = result.results
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

  onEditClicked(comment: Comment): void{
    this.shouldEdit = true; 
    this.selectedComment = comment;
  }

  onCommentUpdated(): void{
    this.getComments();
    this.shouldEdit = false; 
  }

  deleteComment(comment: Comment): void{
    this.service.deleteComment(comment).subscribe({
      next:(_) => {
        this.getComments();
      },
      error: (err) => {
        console.log('Error occured: ', err); 
      }
    })
  }

}
