import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TourPreferencesComponent } from './tour-preferences/tour-preferences.component';
import { TourPreferencesFormComponent } from './tour-preferences-form/tour-preferences-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MarketComponent } from './market/market.component';
import { RouterModule } from '@angular/router';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CouponComponent } from './coupon/coupon.component';
import { CouponFormComponent } from './coupon-form/coupon-form.component';

@NgModule({
  declarations: [
    TourPreferencesComponent,
    TourPreferencesFormComponent,
    MarketComponent,
    ShoppingCartComponent,
    CouponComponent,
    CouponFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule
    
  ],
  exports: [
    TourPreferencesComponent
  ]
})
export class MarketplaceModule { }
