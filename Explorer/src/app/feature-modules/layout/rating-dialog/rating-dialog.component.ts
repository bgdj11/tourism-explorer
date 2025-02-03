import { Component, EventEmitter, Output } from '@angular/core';
import { LayoutService } from '../layout.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AppRating } from '../model/appRating.model';

@Component({
  selector: 'xp-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.css'],
})
export class RatingDialogComponent {
  isModalVisible = false;
  user: User | undefined;
  review = {
    rating: 1,
    comment: '',
  };

  stars = [false, false, false, false, false]; 
  hoveredStars = [false, false, false, false, false]; 

  constructor(private service: LayoutService, private authService: AuthService){}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  @Output() reviewSubmitted = new EventEmitter<{ rating: number; comment: string }>();

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  setRating(rating: number) {
    this.review.rating = rating;
    this.stars = this.stars.map((_, index) => index < rating);
  }

  handleHover(rating: number) {
    this.hoveredStars = this.hoveredStars.map((_, index) => index < rating);
  }

  clearHover() {
    this.hoveredStars = [false, false, false, false, false];
  }

  submitReview() {
    console.log(this.review);
    const rating: AppRating = {
      rating: this.review.rating || 0,
      comment: this.review.comment || "",
      timeCreated: new Date(),
      userPostedId: this.user?.id || 0
    };
    console.log(rating);
    this.service.addRating(rating).subscribe({
      next: (_) => {  }
    });
  
    if (this.review.rating && this.review.comment) {
      this.reviewSubmitted.emit(this.review);
      this.closeModal();
    }
  }
}
