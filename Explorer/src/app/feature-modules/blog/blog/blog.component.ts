import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Blog } from '../model/blog.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit{

  blogs : Blog[] = [];
  shouldRenderBlogForm: boolean = false;
  shouldEdit: boolean = false;
  selectedBlog : Blog;
  user: User | undefined;
  isTourist : boolean = false;
  isAuthor : boolean = false;

  constructor(private service: BlogService,private authService: AuthService) { }

  ngOnInit(): void {
    this.getBlogs();
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

  getBlogs(): void {
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

  getStatusString(status: number): string {
    switch (status) {
      case 0:
        return 'Draft';
      case 1:
        return 'Published';
      case 2:
        return 'Closed';
      default:
        return 'Unknown';
    }
  }

  onAddClicked(): void {
    this.shouldRenderBlogForm = true;
    this.shouldEdit = false;
  }

  onEditClicked(blog: Blog): void {
    this.selectedBlog = blog;
    this.shouldRenderBlogForm = true;
    this.shouldEdit = true;
  }

  deleteBlog(id: number): void {
    if(this.user?.role==='author'){
      this.service.deleteBlogAuthor(id).subscribe({
        next: () => {
          this.getBlogs();
        },
      })
    }
    if(this.user?.role==='tourist'){
      this.service.deleteBlogTourist(id).subscribe({
        next: () => {
          this.getBlogs();
        },
      })
    }   
  }
}
