import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Blog, Markdown, Status, Vote } from '../model/blog.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { map, of, switchMap } from 'rxjs';
import { Comment } from '../model/comment.model';

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

  private visibleComments = new Set<number>();


  constructor(private service: BlogService,private authService: AuthService) { }

  toggleComments(blogId: number | undefined): void {
    if (blogId === undefined) return;
    if (this.visibleComments.has(blogId)) {
      this.visibleComments.delete(blogId);
    } else {
      this.visibleComments.add(blogId);
    }
  }

  // Funkcija za proveru da li su komentari vidljivi za određeni blog
  isCommentsVisible(blogId: number | undefined): boolean {
    if (blogId === undefined) return false;
    return this.visibleComments.has(blogId);
  }

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
        this.blogs = result.results;
        
        Promise.all(this.blogs.map(blog => this.updateBlogStatus(blog)))
        .then(() => {
          console.log("All blogs have been updated.")
        })
        .catch(error => {
          console.log("Error occured during updating blogs: ", error)
        })
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

  getBlogStatusString(status: number): string {
    switch (status) {
      case 0:
        return 'None';
      case 1:
        return 'Read-Only';
      case 2:
        return 'Active';
      case 3:
        return 'Famous';
      default:
        return 'None';
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

updateBlogStatus(blog: Blog): void {
  const totalVotes = this.calculateTotalVotes(blog.votes);

  if (!blog.id) {
    console.error("Blog ID is undefined, cannot update status.");
    return;
  }

  // Proverite da li ulazi u deo kada su glasovi < -10
  if (totalVotes < -1) {
    blog.blogStatus = Status.ReadOnly;
    const updateMethod = this.isAuthor ? this.service.updateBlogAuthor.bind(this.service) : this.service.updateBlogTourist.bind(this.service);

    updateMethod(blog).subscribe({
      next: updatedBlog => {
        console.log("Blog status updated to Read-Only: ", updatedBlog);
      },
      error: err => console.log("Error occurred while updating status: ", err)
    });
    return;
  }

  // Dodajte log da proverite vrednost `blog.id` pre poziva `getComments`
  console.log(`Fetching comments for blog ID: ${blog.id}`);

  this.service.getComments(blog.id).pipe(
    map((pageResult: PagedResults<Comment>) => {
      console.log("Number of comments retrieved: ", pageResult.totalCount);
      return pageResult.totalCount;
    }),
    switchMap(commentCount => {
      console.log("Total votes: ", totalVotes, " Comment count: ", commentCount);

      if (totalVotes === 0 && commentCount > 2) {
        blog.blogStatus = Status.Active;
      } else if (totalVotes > 0 && commentCount > 2) {
        blog.blogStatus = Status.Famous;
      } else {
        blog.blogStatus = Status.None; // Ako uslovi nisu ispunjeni, vrati `blog` kao što jeste
      }

      const updateMethod = this.isAuthor ? this.service.updateBlogAuthor.bind(this.service) : this.service.updateBlogTourist.bind(this.service);
      return updateMethod(blog);

    })
  ).subscribe({
    next: updatedBlog => {
      console.log("Blog status updated: ", updatedBlog);
    },
    error: err => console.log("Error occurred while updating status: ", err)
  });
}
}