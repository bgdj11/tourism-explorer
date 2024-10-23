import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TourComponent} from "./tour/tour.component";
import {FormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SharedModule} from "../../shared/shared.module";



@NgModule({
  declarations: [
    TourComponent,
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
  ]
})
export class TourAuthoringModule { }
