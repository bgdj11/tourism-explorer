import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Comment } from '../model/comment.model';

@Component({
  selector: 'xp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit{

  comments: Comment[] = [];
  selectedComment: Comment;
  shouldEdit: boolean; 

  constructor(private service: BlogService) { }

  ngOnInit(): void {
    this.getComments()
  }

  getComments(): void {
    this.service.getComments().subscribe({
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

  canUserComment(): boolean{
    return this.service.hasUserAccess();
  }

}
