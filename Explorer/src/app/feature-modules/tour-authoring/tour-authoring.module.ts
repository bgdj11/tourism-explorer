import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TourComponent} from "./tour/tour.component";
import {FormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import { TourAddCheckpointComponent } from './tour-add-checkpoint/tour-add-checkpoint.component';



@NgModule({
  declarations: [
    TourComponent,
    TourAddCheckpointComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbPagination,
    FaIconComponent
  ],
  exports: [
    TourComponent,
    TourAddCheckpointComponent
  ]
})
export class TourAuthoringModule { }
