import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { AppRatingComponent } from './app-rating/app-rating.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToursListComponent } from './tours-list/tours-list.component';
import { TourSearchComponent } from './tour-search/tour-search.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HomePageComponent } from './home-page/home-page.component';
import { ToursViewComponent } from './tours-view/tours-view.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';


@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    AppRatingComponent,
    ToursListComponent,
    TourSearchComponent,
    HomePageComponent,
    ToursViewComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    TranslateModule,
    MatIconModule,
    MatSidenavModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    AppRatingComponent,
    ToursListComponent,
    TourSearchComponent,
    HomePageComponent
  ]
})
export class LayoutModule { }
