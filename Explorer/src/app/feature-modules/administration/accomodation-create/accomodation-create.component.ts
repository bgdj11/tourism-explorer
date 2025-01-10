import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AdministrationService } from '../administration.service';
import { Encounter, EncounterStatus, EncounterType } from "../model/encounter.model";
import { AuthService } from "../../../infrastructure/auth/auth.service";
import { BehaviorSubject } from "rxjs";
import { User } from "../../../infrastructure/auth/model/user.model";
import { AccomodationDTO, AccomodationType } from '../../tour-authoring/model/accomodation.model';
import { MapComponent } from 'src/app/shared/map/map.component';

@Component({
  selector: 'app-accomodation-create',
  templateUrl: './accomodation-create.component.html',
  styleUrls: ['./accomodation-create.component.css']
})
export class AccomodationComponent implements OnInit {
    accomodationForm! : FormGroup
    image: string | null = null;
    isAccomodationContext: boolean = true;
    @ViewChild("mapa") mapa!: MapComponent;
    categories = [
        {label: 'Hotel', value: AccomodationType.HOTEL},
        {label: 'Appartment', value: AccomodationType.APPARTMENT},
        {label: 'House', value: AccomodationType.HOUSE}
      ];
      constructor(private fb: FormBuilder, private adminService: AdministrationService) {
    }
    ngOnInit(): void {
        this.initializeForm();
        
    }

    initializeForm(): void {
        this.accomodationForm = this.fb.group({
          name: [''],
          description: [''],
          
          latitude: [0],
          longitude: [0],
         
          images: this.fb.array([]),
          category: [AccomodationType.HOTEL],
          contactNumber: [''],
          city: ['']
        });
      }
      get images(): FormArray {
        return this.accomodationForm.get('images') as FormArray;
      }
      onLocationSelected(location: { lat: number; lng: number }): void {
        // Update the form with the selected latitude and longitude
        this.accomodationForm.patchValue({
          latitude: location.lat,
          longitude: location.lng,
        });
      }
      removeImage(index: number, fileInput: HTMLInputElement): void {
        
        console.log("Slika: ",fileInput.value )
        if (this.images.length == index + 1) {
            fileInput.value = ''; // Reset file input to clear its selected files
          }
        this.images.removeAt(index); // Remove image from FormArray  
      }
      onImageSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
    
        if (fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          const reader = new FileReader();
    
          reader.onloadend = () => {
            const base64Image = reader.result as string;
    
            this.images.push(this.fb.control(base64Image));
          };
    
    
          reader.readAsDataURL(file);
        }
      }
      onSubmit(): void {
        const formValue = this.accomodationForm.value;

    const payload: any = {
      ...formValue,
      id: undefined,
      
      
      latitude: this.mapa.accomodationMarker
      ? this.mapa.accomodationMarker.getLatLng().lat
      : null,
        longitude: formValue.longitude,
      
    };

    

    if (this.image) {
      payload.image = this.image;
    } else {
      payload.image = null;
    }

    console.log('Submitting payload:', payload);
    this.adminService.createAccomodation(payload).subscribe(
        (data: AccomodationDTO) => {
            console.log(data)
        }
    )
      }
      resetForm(): void {

      }
}
