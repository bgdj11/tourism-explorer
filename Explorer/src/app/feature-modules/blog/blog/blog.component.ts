import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Blog, Markdown, Vote } from '../model/blog.model';
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

  getUserVote(blog: Blog): Vote | undefined {
    return blog.votes.find(vote => vote.userId === this.user?.id);
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

  upvote(blogId: number): void {
    if(this.user?.role==='tourist' || this.user?.role==='author'){
      const blog = this.blogs.find(b => b.id === blogId);
      if (!blog || !this.user) return;
    
      const currentVote = this.getUserVote(blog);
      const newVote: Vote = {
        userId: this.user.id,
        mark: Markdown.Upvote,
        createdDate: new Date().toISOString(),
        blogId: blog.id
      };
    
      if (currentVote && currentVote.mark === Markdown.Upvote) {
        // Poništi glas
        blog.votes = blog.votes.filter(vote => vote.userId !== this.user?.id);
        this.updateVotesInDatabase(blogId, currentVote, 'upvote');
      } else {
        // Dodaj ili ažuriraj glas
        if (currentVote) {
          currentVote.mark = Markdown.Upvote; // Ažuriraj glas
          this.updateVotesInDatabase(blogId, currentVote, 'upvote');
        } else {
          blog.votes.push(newVote); // Dodaj novi glas
          this.updateVotesInDatabase(blogId, newVote, 'upvote');
        }
      }
    }
    
  }
  
  downvote(blogId: number): void {
    if(this.user?.role==='tourist' || this.user?.role==='author'){
      const blog = this.blogs.find(b => b.id === blogId);
      if (!blog || !this.user) return;
    
      const currentVote = this.getUserVote(blog);
      const newVote: Vote = {
        userId: this.user.id,
        mark: Markdown.Downvote,
        createdDate: new Date().toISOString(),
        blogId: blog.id
      };
    
      if (currentVote && currentVote.mark === Markdown.Downvote) {
        // Poništi glas
        blog.votes = blog.votes.filter(vote => vote.userId !== this.user?.id);
        this.updateVotesInDatabase(blogId, currentVote, 'downvote');
      } else {
        // Dodaj ili ažuriraj glas
        if (currentVote) {
          currentVote.mark = Markdown.Downvote; // Ažuriraj glas
          this.updateVotesInDatabase(blogId, currentVote, 'downvote');
        } else {
          blog.votes.push(newVote); // Dodaj novi glas
          this.updateVotesInDatabase(blogId, newVote, 'downvote');
        }
      }
    }

    
  }
  
updateVotesInDatabase(blogId: number, vote: Vote, action: 'upvote' | 'downvote' | 'remove'): void {
  if (action === 'upvote' && this.user?.role==='author') {
    this.service.addVoteAuthor(vote).subscribe({ next: () => this.getBlogs() });
  }
  else if(action === 'upvote' && this.user?.role==='tourist') {
    this.service.addVoteTourist(vote).subscribe({ next: () => this.getBlogs() });
  } 

  else if (action === 'downvote' && this.user?.role==='tourist') {
    this.service.addVoteTourist(vote).subscribe({ next: () => this.getBlogs() });
  }
  else if (action === 'downvote' && this.user?.role==='author') {
    this.service.addVoteAuthor(vote).subscribe({ next: () => this.getBlogs() });
  } 
   else if (action === 'remove') {
    this.service.removeVote(vote).subscribe({ next: () => this.getBlogs() });
  }
}


calculateTotalVotes(votes: Vote[]): number {
  return votes.reduce((total, vote) => {
    return total + (vote.mark === Markdown.Upvote ? 1 : -1);
  }, 0);
}

hasUpvoted(blog: Blog): boolean {
  return blog.votes.some(vote => vote.userId === this.user?.id && vote.mark === Markdown.Upvote);
}

hasDownvoted(blog: Blog): boolean {
  return blog.votes.some(vote => vote.userId === this.user?.id && vote.mark === Markdown.Downvote);
}


}
