import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TourComponent} from "./tour/tour.component";
import {FormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import { ObjectComponent } from './object/object.component';
import {SharedModule} from "../../shared/shared.module";



@NgModule({
  declarations: [
    TourComponent,
    ObjectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbPagination,
    FaIconComponent,
    SharedModule
  ],
  exports: [
    TourComponent,
    ObjectComponent
  ]
})
export class TourAuthoringModule { }
