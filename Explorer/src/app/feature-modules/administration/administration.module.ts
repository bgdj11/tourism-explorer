import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountsComponent } from './accounts/accounts.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { UserAccountFormComponent } from './user-account-form/user-account-form.component';
import { EncounterComponent } from './encounter/encounter.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TourProblemsComponent } from './tour-problems/tour-problems.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    AccountsComponent,
    UserAccountComponent,
    UserAccountFormComponent,
    EncounterComponent,
    TourProblemsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
]
})
export class AdministrationModule { }
