import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProblemComponent } from './add-problem/add-problem.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MyEquipmentComponent } from './my-equipment/my-equipment.component';
import { MyEquipmentFormComponent } from './my-equipment-form/my-equipment-form.component';



@NgModule({
  declarations: [
    AddProblemComponent,
    MyEquipmentComponent,
    MyEquipmentFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule 
   ],
    exports: [
      AddProblemComponent,
      MyEquipmentComponent
    ]

})
export class TourExecutionModule { }
