import { Component, OnInit } from '@angular/core';
import { Blog } from './model/blog.model';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit{

  blogs : Blog[] = [];

  constructor(private service: BlogService) { }

  ngOnInit(): void {
    this.service.getBlogs().subscribe({
      next: (result : PagedResults<Blog>) => {
        console.log(result);
        this.blogs = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
}
