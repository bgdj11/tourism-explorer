import { Component, NgModule, OnInit } from '@angular/core';
import { LayoutService } from '../layout.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AppRating } from '../model/appRating.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'xp-app-rating',
  templateUrl: './app-rating.component.html',
  styleUrls: ['./app-rating.component.css']
})


export class AppRatingComponent implements OnInit {
  
  appRatings: AppRating[] = [];
  user: User | undefined;

  constructor(private service: LayoutService, private authService: AuthService){}
  ngOnInit(): void {
    
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    if(this.user?.role === 'administrator'){
    this.service.getAppRating().subscribe({
      next: (result: PagedResults<AppRating>) => {
        this.appRatings = result.results;
      },
      error: () => {
      }
    
    })
  }
  }
  ratingForm = new FormGroup({
    rating: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
    comment: new FormControl('')
  });

  addRating(): void {
    const rating: AppRating = {
      rating: this.ratingForm.value.rating || 0,
      comment: this.ratingForm.value.comment || "",
      timeCreated: new Date(),
      userPostedId: this.user?.id || 0
    };
    console.log(rating);
    this.service.addRating(rating).subscribe({
      next: (_) => {  }
    });
  }
  
}
