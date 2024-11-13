import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { AppRatingComponent } from './app-rating/app-rating.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TourSearchComponent } from './tour-search/tour-search.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    AppRatingComponent,
    TourSearchComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    AppRatingComponent,
    TourSearchComponent
  ]
})
export class LayoutModule { }
