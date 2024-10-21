import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourPreferences } from '../model/tour-preferences.model';
import { MarketplaceService } from '../marketplace.service';
import { DifficultyLevel } from '../model/tour-preferences.model';


@Component({
  selector: 'xp-tour-preferences',
  templateUrl: './tour-preferences.component.html',
  styleUrls: ['./tour-preferences.component.css']
})
export class TourPreferencesComponent implements OnChanges {

  @Input() tourPreferences : TourPreferences;

  preferencesForm = new FormGroup({
    id: new FormControl(0),  
    difficulty: new FormControl(DifficultyLevel.Easy), 
    walkRating: new FormControl(0, [Validators.min(0), Validators.max(3)]),  
    bikeRating: new FormControl(0, [Validators.min(0), Validators.max(3)]),  
    carRating: new FormControl(0, [Validators.min(0), Validators.max(3)]),  
    boatRating: new FormControl(0, [Validators.min(0), Validators.max(3)]), 
    interestTags: new FormControl<string[]>([])
  });

  constructor(private service: MarketplaceService) {} 

  ngOnChanges(): void {
    this.preferencesForm.reset();
    if (this.tourPreferences) {
      this.preferencesForm.patchValue(this.tourPreferences);
    }
  }

  addTourPreferences() {
    if (this.preferencesForm.valid) {
      const formValues = this.preferencesForm.value;
      console.log('Submitted tour preferences:', formValues);
      
    }
  }
}
