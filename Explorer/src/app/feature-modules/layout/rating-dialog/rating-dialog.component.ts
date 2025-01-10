import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'xp-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.css'],
})
export class RatingDialogComponent {
  isModalVisible = false;

  review = {
    rating: 1,
    comment: '',
  };

  stars = [false, false, false, false, false]; 
  hoveredStars = [false, false, false, false, false]; 

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
    if (this.review.rating && this.review.comment) {
      this.reviewSubmitted.emit(this.review);
      this.closeModal();
    }
  }
}
