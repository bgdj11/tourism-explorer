import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministrationService } from '../administration.service';
import { Encounter } from "../model/encounter.model";

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

  constructor(private fb: FormBuilder, private adminService: AdministrationService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadEncounters();
  }

  initializeForm(): void {
    this.encounterForm = this.fb.group({
      name: [''],
      description: [''],
      location: [''],
      xp: [0],
      status: ['DRAFT'], // Postavi podrazumevani status
      type: ['SOCIAL'], // Postavi podrazumevani tip
      publishedDate: [null],
      archivedDate: [null],
      authorId: [1], // Pretpostavimo da je ID autora "1"
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
    const payload = {
      ...this.encounterForm.value,
      id: this.isEditing ? this.editingId : null, // Dodaj ID samo kod uređivanja
      publishedDate: this.encounterForm.value.publishedDate || null,
      archivedDate: this.encounterForm.value.archivedDate || null,
    };

    console.log('Submitting:', payload);

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
    this.encounterForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }
}
