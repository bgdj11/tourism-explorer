import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TourComponent} from "./tour/tour.component";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    TourComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TourComponent
  ]
})
export class TourAuthoringModule { }
