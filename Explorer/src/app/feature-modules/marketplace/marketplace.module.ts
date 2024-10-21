import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourPreferencesComponent } from './tour-preferences/tour-preferences.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TourPreferencesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ],
  exports: [
    TourPreferencesComponent
  ]
})
export class MarketplaceModule { }
