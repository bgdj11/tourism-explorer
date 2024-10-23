import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { Comment } from '../model/comment.model';

@Component({
  selector: 'xp-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent  implements OnChanges{
  
  @Output() commentUpdated = new EventEmitter<null>();
  @Input() comment: Comment;
  @Input() shouldEdit: boolean = false;

  constructor(private service: BlogService){ }

  ngOnChanges(changes: SimpleChanges): void { 
    this.commentForm.reset();
    if(this.shouldEdit){
      this.commentForm.patchValue(this.comment) 
    }
  }

  commentForm = new FormGroup({
    text: new FormControl('', Validators.required)
  })

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('access-token'); 

    if (!token) {
      console.error('Token not found');
      return null;
    }

    const payloadBase64 = token.split('.')[1]; const decodedPayload = atob(payloadBase64);
    const payloadObject = JSON.parse(decodedPayload);
    
    console.log('payload:', payloadObject)
    return payloadObject.id || null;
  }


  addComment(): void{ 
    this.commentForm.markAllAsTouched();

    if (this.commentForm.invalid) {
      return; 
    }

    const userId = this.getUserIdFromToken();

    if (!userId) {
      console.error('User is not logged in');
      return;
    }

    const comment: Comment = {
      blogId: 1, 
      userId: userId, // uzmi ga iz autentifikacije
      creationTime: new Date(), 
      lastModifiedTime: new Date(), 
      text: this.commentForm.value.text || "",
    };
    
    this.service.addComment(comment).subscribe({
      next: () =>{
        this.commentUpdated.emit() 
        
        this.commentForm.reset({
          text: ''
        })

        this.commentForm.controls['text'].setErrors(null); 
      },
      error: (err) =>{
        console.error('Error occured: ', err)
      }
    }); 
  
  }
  
  updateComment(): void{
    const userId = this.getUserIdFromToken();

    if (!userId) {
      console.error('User is not logged in');
      return;
    }

    const comment: Comment = {
      id: this.comment.id,
      blogId: 1,
      userId: userId,
      creationTime: new Date(),
      lastModifiedTime: new Date(),
      text: this.commentForm.value.text || ""
    }; 
    
    this.service.updateComment(comment).subscribe({
      next: (_) => {
        this.commentUpdated.emit();
        this.commentForm.reset({
          text: ''
        });
        this.shouldEdit = false;
      },
      error: (err) => {
        console.log('Error occured: ', err);
      }
    })
  }
}

