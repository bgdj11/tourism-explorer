import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { Blog, BlogStatus } from '../model/blog.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent implements OnChanges {
    
  @Output() blogUpdated = new EventEmitter<null>();
  @Input() blog: Blog;
  @Input() shouldEdit: boolean = false;
  user: User | undefined;


  constructor(private service: BlogService,private authService: AuthService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.blogForm.reset();
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    if(this.shouldEdit){
      this.blogForm.patchValue(this.blog);
    }
  }

  blogForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    images: new FormArray([this.createImageFormControl()]),
    status: new FormControl(BlogStatus.Draft, [Validators.required])
  });

  get images(): FormArray {
    return this.blogForm.get('images') as FormArray;
  }

  createImageFormControl(): FormControl {
    return new FormControl('', [Validators.required]);
  }

  addImageField(): void {
    this.images.push(this.createImageFormControl());
  }

  removeImageField(index: number): void {
    this.images.removeAt(index);
  }

  addBlog(): void {
    console.log(this.blogForm.value);
    
    const blog: Blog = {
      title: this.blogForm.value.title || "",
      description: this.blogForm.value.description || "",
      createdDate: new Date().toISOString(),
      images: this.blogForm.value.images || [],
      status: this.blogForm.value.status as BlogStatus,
      userId: this.user?.id || 0,
      votes: [],
      voteStatus: 0
    };
  
    if (this.user?.role === 'author') {
      this.service.addBlogAuthor(blog).subscribe({
        next: () => {
          this.blogUpdated.emit();
          this.blogForm.reset();  
          this.images.clear();    
          this.addImageField();   
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  
    if (this.user?.role === 'tourist') {
      this.service.addBlogTourist(blog).subscribe({
        next: () => {
          this.blogUpdated.emit();
          this.blogForm.reset();  
          this.images.clear();    
          this.addImageField();   
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
  
  updateBlog(): void {
    const blog: Blog = {
      title: this.blogForm.value.title || "",
      description: this.blogForm.value.description || "",
      createdDate: new Date().toISOString(),
      images: this.blogForm.value.images || [],
      status: this.blogForm.value.status as BlogStatus,
      userId: this.user?.id || 0,
      votes: this.blog.votes || [],
      voteStatus: 0
    };
    blog.id = this.blog.id;
  
    if (this.user?.role === 'author') {
      this.service.updateBlogAuthor(blog).subscribe({
        next: () => {
          this.blogUpdated.emit();
          this.blogForm.reset();  
          this.images.clear();    
          this.addImageField();   
        }
      });
    }
  
    if (this.user?.role === 'tourist') {
      this.service.updateBlogTourist(blog).subscribe({
        next: () => {
          this.blogUpdated.emit();
          this.blogForm.reset();  
          this.images.clear();    
          this.addImageField();  
        }
      });
    }
  }
  
  
}
