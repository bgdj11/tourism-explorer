import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProblemComponent } from './add-problem/add-problem.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddProblemComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule 
   ],
    exports: [
      AddProblemComponent
    ]

})
export class TourExecutionModule { }
