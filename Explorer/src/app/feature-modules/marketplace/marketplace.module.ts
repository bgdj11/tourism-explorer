import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TourPreferencesComponent } from './tour-preferences/tour-preferences.component';
import { TourPreferencesFormComponent } from './tour-preferences-form/tour-preferences-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';

@NgModule({
  declarations: [
    TourPreferencesComponent,
    TourPreferencesFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule 
  ],
  exports: [
    TourPreferencesComponent
  ]
})
export class MarketplaceModule { }
