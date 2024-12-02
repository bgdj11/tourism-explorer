import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountsComponent } from './accounts/accounts.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { UserAccountFormComponent } from './user-account-form/user-account-form.component';
import { TourProblemsComponent } from './tour-problems/tour-problems.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    AccountsComponent,
    UserAccountComponent,
    UserAccountFormComponent,
    TourProblemsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [MatDatepickerModule],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
]
})
export class AdministrationModule { }
