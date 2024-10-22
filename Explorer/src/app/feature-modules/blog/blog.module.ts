import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment/comment.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BlogComponent } from './blog/blog.component';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    BlogComponent,
    BlogFormComponent,
    CommentComponent,
    CommentFormComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot() // Add this line if you're using ngx-markdown
  ],
  exports: [
    BlogComponent,
    CommentComponent,
    ReactiveFormsModule
  ],
})
export class BlogModule { }
