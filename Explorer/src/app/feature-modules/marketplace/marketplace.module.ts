import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TourPreferencesComponent } from './tour-preferences/tour-preferences.component';
import { TourPreferencesFormComponent } from './tour-preferences-form/tour-preferences-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MarketComponent } from './market/market.component';
import { RouterModule } from '@angular/router';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

@NgModule({
  declarations: [
    TourPreferencesComponent,
    TourPreferencesFormComponent,
    MarketComponent,
    ShoppingCartComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    TourPreferencesComponent
  ]
})
export class MarketplaceModule { }
