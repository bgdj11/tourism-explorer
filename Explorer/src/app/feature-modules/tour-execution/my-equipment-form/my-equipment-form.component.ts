import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-my-equipment-form',
  templateUrl: './my-equipment-form.component.html',
  styleUrls: ['./my-equipment-form.component.css']
})
export class MyEquipmentFormComponent {
  equipmentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

}
