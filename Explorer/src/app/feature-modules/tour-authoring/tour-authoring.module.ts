import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TourComponent} from "./tour/tour.component";
import {FormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import { ObjectComponent } from './object/object.component';
import {SharedModule} from "../../shared/shared.module";
import { ClubsComponent } from './club/club.component';


@NgModule({
  declarations: [
    TourComponent,
    ObjectComponent,
    ClubsComponent

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
    ObjectComponent,
    ClubsComponent
  ]
})
export class TourAuthoringModule { }
