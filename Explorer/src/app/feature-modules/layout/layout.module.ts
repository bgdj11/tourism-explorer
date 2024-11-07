import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { AppRatingComponent } from './app-rating/app-rating.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToursListComponent } from './tours-list/tours-list.component';
@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    AppRatingComponent,
    ToursListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    AppRatingComponent,
    ToursListComponent
  ]
})
export class LayoutModule { }
