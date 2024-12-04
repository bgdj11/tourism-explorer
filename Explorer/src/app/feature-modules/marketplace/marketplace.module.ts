import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TourPreferencesComponent } from './tour-preferences/tour-preferences.component';
import { TourPreferencesFormComponent } from './tour-preferences-form/tour-preferences-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MarketComponent } from './market/market.component';
import { RouterModule } from '@angular/router';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { TourSaleComponent } from './tour-sale/tour-sale.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { CouponComponent } from './coupon/coupon.component';
import { CouponFormComponent } from './coupon-form/coupon-form.component';
import { PacagesPublComponent } from './pacages-publ/pacages-publ.component';
import { MyPacagesComponent } from './my-pacages/my-pacages.component';


@NgModule({
  declarations: [
    TourPreferencesComponent,
    TourPreferencesFormComponent,
    MarketComponent,
    ShoppingCartComponent,
    TourSaleComponent,
    CouponComponent,
    CouponFormComponent,
    PacagesPublComponent,
    MyPacagesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCheckboxModule,
    SharedModule
  ],
  providers: [MatDatepickerModule],
  exports: [
    TourPreferencesComponent,
    MyPacagesComponent
  ]
})
export class MarketplaceModule { }
