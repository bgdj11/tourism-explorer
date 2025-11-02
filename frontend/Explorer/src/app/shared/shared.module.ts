import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { LocationSimulatorComponent } from './location-simulator/location-simulator.component';
import { TouristProfileComponent } from './tourist-profile/tourist-profile.component';
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatChipsModule} from "@angular/material/chips";
import {MatProgressBarModule} from "@angular/material/progress-bar";



@NgModule({
  declarations: [
    MapComponent,
    LocationSimulatorComponent,
    TouristProfileComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  exports: [MapComponent]
})
export class SharedModule { }
