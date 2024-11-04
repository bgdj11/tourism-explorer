import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { LocationSimulatorComponent } from './location-simulator/location-simulator.component';



@NgModule({
  declarations: [
    MapComponent,
    LocationSimulatorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [MapComponent]
})
export class SharedModule { }
