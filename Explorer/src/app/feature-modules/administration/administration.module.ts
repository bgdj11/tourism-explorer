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
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AccomodationComponent } from './accomodation-create/accomodation-create.component';
import { MapComponent } from 'src/app/shared/map/map.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TourProblemsStatisticsComponent } from './tour-problems-statistics/tour-problems-statistics.component';
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatLegacyChipsModule} from "@angular/material/legacy-chips";



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    AccountsComponent,
    UserAccountComponent,
    UserAccountFormComponent,
    EncounterComponent,
    TourProblemsComponent,

    AccomodationComponent

    TourProblemsStatisticsComponent

  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,

    SharedModule

    RouterModule,
    NgxEchartsModule.forRoot({echarts}),
    HttpClientModule,
    MatCardModule,
    MatChipsModule,
    MatLegacyChipsModule

  ],
  providers: [MatDatepickerModule],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    AccomodationComponent
]
})
export class AdministrationModule { }
