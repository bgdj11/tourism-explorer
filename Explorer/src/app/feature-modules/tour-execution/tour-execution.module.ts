import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { AddProblemComponent } from './add-problem/add-problem.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MyEquipmentComponent } from './my-equipment/my-equipment.component';
import { MyEquipmentFormComponent } from './my-equipment-form/my-equipment-form.component';
import { StartTourComponent } from './start-tour/start-tour.component';
//import { PublishedToursComponent } from './published-tours/published-tours.component';
import { MyToursComponent } from './my-tours/my-tours.component';
//import { CardComponent } from './card/card.component';
import { FollowersComponent } from './followers/followers.component';



@NgModule({
  declarations: [
    MyEquipmentComponent,
    MyEquipmentFormComponent,
    StartTourComponent,
    MyToursComponent,
    FollowersComponent
  ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [
      MyEquipmentComponent,
      MyToursComponent,
      FollowersComponent
    ]

})
export class TourExecutionModule { }
