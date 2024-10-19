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

  constructor(private service: BlogService) { }

  ngOnInit(): void {
    this.service.getComments().subscribe({
      next: (result: PagedResults<Comment>) => {
        this.comments = result.results;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

}
