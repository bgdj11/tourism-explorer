import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { LocationSimulatorComponent } from './location-simulator/location-simulator.component';
import { TouristProfileComponent } from './tourist-profile/tourist-profile.component';
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [
    MapComponent,
    LocationSimulatorComponent,
    TouristProfileComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule
  ],
  exports: [MapComponent]
})
export class SharedModule { }
