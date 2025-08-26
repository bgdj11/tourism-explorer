import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministrationService } from '../administration.service';
import { Encounter, EncounterStatus, EncounterType } from "../model/encounter.model";
import { AuthService } from "../../../infrastructure/auth/auth.service";
import { BehaviorSubject } from "rxjs";
import { User } from "../../../infrastructure/auth/model/user.model";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit {
  encounterForm!: FormGroup;
  encounters: Encounter[] = [];
  encounter: Encounter;
  toReviewEncounters: Encounter[] = [];
  isEditing = false;
  editingId: number | null = null;
  user: BehaviorSubject<User>;
  isAdmin = false;
  statuses = [
    {label: 'Draft', value: EncounterStatus.DRAFT},
    {label: 'Active', value: EncounterStatus.ACTIVE},
    {label: 'Archived', value: EncounterStatus.ARCHIVED}
  ];

  types = [
    {label: 'Social', value: EncounterType.SOCIAL},
    {label: 'Location', value: EncounterType.LOCATION},
    {label: 'Miscellaneous', value: EncounterType.MISC}
  ];
  showImageForHiddenEncounter = false;  // Flag to show the additional input for 'Location' type
  image: string | null = null;

  constructor(private fb: FormBuilder, private adminService: AdministrationService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.user = this.authService.user$;
    this.user.subscribe(user => {
      this.isAdmin = user.role === 'administrator';
    });
    this.initializeForm();
    if (this.isAdmin) {
      this.loadEncounters();
      this.loadToReviewEncounters();
    }

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
      additionalLocationInfo: [''], // Add the additional field for Location type
      requiredParticipants: [0], // Default value for SOCIAL encounters
      radius: [0]
    });
  }

  loadEncounters(): void {
    console.log("OVDE SE POZIVA");
    this.adminService.getEncounters(1, 11).subscribe((response) => {
      // Filtriraj encountere sa isReviewed === true
      this.encounters = response.results.filter(encounter => encounter.isReviewed);
      console.log("Učitani pregledani encounteri: ", this.encounters);
    });
  }

  onSubmit(): void {
    const formValue = this.encounterForm.value;

    const payload: any = {
      ...formValue,
      id: this.isEditing ? this.editingId : undefined,
      publishedDate: formValue.publishedDate || null,
      archivedDate: formValue.archivedDate || null,
      location: {
        latitude: formValue.location.latitude,
        longitude: formValue.location.longitude,
      },
      isReviewed: this.isAdmin,
    };

    // Dodaj specificna polja za SOCIAL type
    if (formValue.type === EncounterType.SOCIAL) {
      payload.requiredParticipants = formValue.requiredParticipants;
      payload.radius = formValue.radius;
    }

    if (this.image) {
      payload.image = this.image;
    } else {
      payload.image = null;
    }

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

  // lak mapping za klase (prikaz)
  statusClass(status: EncounterStatus | string): string {
    // očekujem 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
    switch (String(status)) {
      case 'ACTIVE': return 'badge success';
      case 'DRAFT': return 'badge info';
      case 'ARCHIVED': return 'badge danger';
      default: return 'badge';
    }
  }

  typeClass(type: EncounterType | string): string {
    // očekujem 'SOCIAL' | 'LOCATION' | 'MISC'
    switch (String(type)) {
      case 'SOCIAL': return 'badge';
      case 'LOCATION': return 'badge warn';
      case 'MISC': return 'badge info';
      default: return 'badge';
    }
  }


  editEncounter(encounter: Encounter): void {
    this.isEditing = true;
    this.editingId = encounter.id!;
    this.encounterForm.patchValue(encounter);
  }

  deleteEncounter(id: number): void {
    this.adminService.deleteEncounter(id).subscribe(() => {
      this.loadToReviewEncounters(); // Ponovno učitavanje liste nakon brisanja
      this.loadEncounters();
    });
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

  loadToReviewEncounters(): void {
    this.adminService.getEncounters(1, 100).subscribe((response) => {
      this.toReviewEncounters = response.results.filter(encounter => !encounter.isReviewed);
    });
  }

  markAsReviewed(id: number): void {
    const encounter = this.toReviewEncounters.find(e => e.id === id);
    if (encounter) {
      encounter.isReviewed = true; // Postavi isReviewed lokalno
      this.adminService.updateEncounter(encounter).subscribe(() => {
        this.loadToReviewEncounters(); // Ponovno učitavanje liste nakon promene
        this.loadEncounters();
      });
    }
  }
}
