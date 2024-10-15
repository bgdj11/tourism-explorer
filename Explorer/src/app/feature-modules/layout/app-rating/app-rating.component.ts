import { Component, NgModule, OnInit } from '@angular/core';
import { LayoutService } from '../layout.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AppRating } from '../model/appRating.model';

@Component({
  selector: 'xp-app-rating',
  templateUrl: './app-rating.component.html',
  styleUrls: ['./app-rating.component.css']
})


export class AppRatingComponent implements OnInit {
  
  appRatings: AppRating[] = [];
  constructor(private service: LayoutService){}
  ngOnInit(): void {
    this.service.getAppRating().subscribe({
      next: (result: PagedResults<AppRating>) => {
        this.appRatings = result.results;
      },
      error: () => {
      }
    })
  }
  
}
