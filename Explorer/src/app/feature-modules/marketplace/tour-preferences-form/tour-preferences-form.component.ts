import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourPreferences } from '../model/tour-preferences.model';
import { MarketplaceService } from '../marketplace.service';
import { DifficultyLevel } from '../model/tour-preferences.model';

@Component({
  selector: 'xp-tour-preferences-form',
  templateUrl: './tour-preferences-form.component.html',
  styleUrls: ['./tour-preferences-form.component.css']
})
export class TourPreferencesFormComponent implements OnChanges {

  @Input() tourPreferences : TourPreferences;
  @Output() tourPreferencesUpdate = new EventEmitter<null>();
  @Input() shouldEdit: boolean = false;

  constructor(private service: MarketplaceService) {} 

  ngOnChanges(): void {
    this.preferencesForm.reset();
    /*if (this.shouldEdit) {
      this.preferencesForm.patchValue(this.tourPreferences);
    }*/
      if (this.shouldEdit && this.tourPreferences) {
        this.preferencesForm.patchValue({
            difficulty: this.tourPreferences.difficulty,
            walkRating: this.tourPreferences.walkRating,
            bikeRating: this.tourPreferences.bikeRating,
            carRating: this.tourPreferences.carRating,
            boatRating: this.tourPreferences.boatRating,
            interestTagsIn: this.tourPreferences.interestTags.join(', ') // Spoji tagove u string
        });
    }
  }

  preferencesForm = new FormGroup({
    difficulty: new FormControl(1, [Validators.required]), 
    walkRating: new FormControl(0, [Validators.min(0), Validators.max(3)]),  
    bikeRating: new FormControl(0, [Validators.min(0), Validators.max(3)]),  
    carRating: new FormControl(0, [Validators.min(0), Validators.max(3)]),  
    boatRating: new FormControl(0, [Validators.min(0), Validators.max(3)]), 
    interestTagsIn: new FormControl('', Validators.required)
  });

  addTourPreferences(): void {
    if (this.preferencesForm.valid) {
      const formValues = this.preferencesForm.value;
      console.log('Submitted tour preferences:', formValues);
    }

    const interestTagsInput: string = this.preferencesForm.value.interestTagsIn || '';
    const interestTagsArray: string[] = interestTagsInput
      .split(',')               
      .map(tag => tag.trim())    
      .filter(tag => tag.length > 0); 

    const tourPreferences: TourPreferences = {
      difficulty: this.preferencesForm.value.difficulty as DifficultyLevel,
      walkRating: this.preferencesForm.value.walkRating || 0,
      bikeRating: this.preferencesForm.value.bikeRating || 0,
      carRating: this.preferencesForm.value.carRating || 0,
      boatRating: this.preferencesForm.value.boatRating || 0,
      interestTags: interestTagsArray 
    }

    this.service.addTourPreferences(tourPreferences).subscribe({
      next:  (_) => {
        console.log("Successful")
        this.tourPreferencesUpdate.emit()
      },
      error: (err) => {
        console.error('Error adding tour preferences:', err);
        if (err.error && err.error.errors) {
            console.error('Validation errors:', err.error.errors); 
            alert('Error: ' + JSON.stringify(err.error.errors));
        } 
      }
    });
  }

  updateTourPreferences(): void {
    const interestTagsInput: string = this.preferencesForm.value.interestTagsIn || '';
    const interestTagsArray: string[] = interestTagsInput
      .split(',')               
      .map(tag => tag.trim())    
      .filter(tag => tag.length > 0); 

    const tourPreferences: TourPreferences = {
      difficulty: this.preferencesForm.value.difficulty as DifficultyLevel,
      walkRating: this.preferencesForm.value.walkRating || 0,
      bikeRating: this.preferencesForm.value.bikeRating || 0,
      carRating: this.preferencesForm.value.carRating || 0,
      boatRating: this.preferencesForm.value.boatRating || 0,
      interestTags: interestTagsArray 
    };
    tourPreferences.id = this.tourPreferences.id;
    this.service.updateTourPreferences(tourPreferences).subscribe({
      next: () => { this.tourPreferencesUpdate.emit();}
    });
  }
}
