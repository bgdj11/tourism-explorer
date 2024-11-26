import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministrationService } from '../administration.service';
import { Encounter, EncounterStatus, EncounterType } from "../model/encounter.model";
import { AuthService } from "../../../infrastructure/auth/auth.service";
import { BehaviorSubject } from "rxjs";
import { User } from "../../../infrastructure/auth/model/user.model";

@Component({
  selector: 'app-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit {
  encounterForm!: FormGroup;
  encounters: Encounter[] = [];
  encounter: Encounter;
  isEditing = false;
  editingId: number | null = null;
  user: BehaviorSubject<User>;
  statuses = [
    { label: 'Draft', value: EncounterStatus.DRAFT },
    { label: 'Active', value: EncounterStatus.ACTIVE },
    { label: 'Archived', value: EncounterStatus.ARCHIVED }
  ];

  types = [
    { label: 'Social', value: EncounterType.SOCIAL },
    { label: 'Location', value: EncounterType.LOCATION },
    { label: 'Miscellaneous', value: EncounterType.MISC }
  ];
  showImageForHiddenEncounter = false;  // Flag to show the additional input for 'Location' type
  image: string | null = null; 
  constructor(private fb: FormBuilder, private adminService: AdministrationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.user$;
    this.initializeForm();
    this.loadEncounters();

    // Watch for changes in the 'type' form control
    this.encounterForm.get('type')?.valueChanges.subscribe((type: EncounterType) => {
      this.showImageForHiddenEncounter = type === EncounterType.LOCATION; // Show location input if 'Location' type is selected
    });
  }

  initializeForm(): void {
    this.encounterForm = this.fb.group({
      name: [''],
      description: [''],
      location: this.fb.group({
        latitude: [0],
        longitude: [0],
      }),
      xp: [0],
      status: [EncounterStatus.DRAFT],
      type: [EncounterType.SOCIAL],
      publishedDate: [null],
      archivedDate: [null],
      authorId: [this.user.value.id],
      additionalLocationInfo: ['']  // Add the additional field for Location type
    });
  }

  loadEncounters(): void {
    console.log("OVDE SE POZIVA");
    this.adminService.getEncounters(1, 11).subscribe((response) => {
      this.encounters = response.results;
      console.log("OVO JE ENC: " + this.encounters);
    });
  }

  onSubmit(): void {
    const formValue = this.encounterForm.value;

    const payload = {
      ...formValue,
      id: this.isEditing ? this.editingId : undefined,
      publishedDate: formValue.publishedDate || null,
      archivedDate: formValue.archivedDate || null,
      location: {
        latitude: formValue.location.latitude,
        longitude: formValue.location.longitude,
      },
    };
    // Samo za hidden location encounter
    if (this.image) 
      payload.image = this.image; 
    else
      payload.image = null;
    console.log('Submitting payload:', payload);

    if (this.isEditing) {
      this.adminService.updateEncounter(payload).subscribe(() => {
        console.log('Encounter updated successfully');
        this.loadEncounters();
        this.resetForm();
      });
    } else {
      this.adminService.createEncounter(payload).subscribe(() => {
        console.log('Encounter created successfully');
        this.loadEncounters();
        this.resetForm();
      });
    }
  }

  editEncounter(encounter: Encounter): void {
    this.isEditing = true;
    this.editingId = encounter.id!;
    this.encounterForm.patchValue(encounter);
  }

  deleteEncounter(id: number): void {
    this.adminService.deleteEncounter(id).subscribe(() => this.loadEncounters());
  }

  publishEncounter(id: number): void {
    this.adminService.publishEncounter(id).subscribe(() => this.loadEncounters());
  }

  archiveEncounter(id: number): void {
    this.adminService.archiveEncounter(id).subscribe(() => this.loadEncounters());
  }

  resetForm(): void {
    this.encounterForm.reset({
      status: EncounterStatus.DRAFT,
      type: EncounterType.SOCIAL,
    });
    this.isEditing = false;
    this.editingId = null;
  }


  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
  
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const base64Image = reader.result as string;
  
        this.image = base64Image;
      };
  

      reader.readAsDataURL(file);
    }
  }
}
