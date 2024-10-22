import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog/blog.component';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    BlogComponent,
    BlogFormComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot()
  ],
  exports : [
    BlogComponent
  ]
})
export class BlogModule { }
