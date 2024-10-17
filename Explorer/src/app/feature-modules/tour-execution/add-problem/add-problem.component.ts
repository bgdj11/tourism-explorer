import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Problem } from '../model/problem.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourExecutionService } from '../tour.execution.service';

@Component({
  selector: 'xp-add-problem',
  templateUrl: './add-problem.component.html',
  styleUrls: ['./add-problem.component.css']
})
export class AddProblemComponent implements OnChanges {

  @Input() equipment: Problem;


  constructor(private service: TourExecutionService) { }

  ngOnChanges(): void {
    this.problemsForm.reset();
  } 

  problemsForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });


  addProblem(): void {

    if (!this.problemsForm.value.category || !this.problemsForm.value.priority || !this.problemsForm.value.description) {
      alert('Sva polja moraju biti popunjena!');
      return;
    }

    const equipment: Problem = {
      userId:  "aeb69f04-efc4-4e9d-8b61-cfb573cdeaa3",
      tourId:  "-1",
      category: this.problemsForm.value.category || "",
      priority: this.problemsForm.value.priority || "",
      description: this.problemsForm.value.description || "",
      reportedAt: new Date()
    };
    this.service.addProblem(equipment).subscribe({
      next: () => {
        alert('Problem uspešno dodat!');
        this.problemsForm.reset();

         },
         error: (err) => {
          console.error('Error adding problem:', err);
          if (err.error && err.error.errors) {
              console.error('Validation errors:', err.error.errors); // Prikazivanje validacionih grešaka
              alert('Došlo je do greške: ' + JSON.stringify(err.error.errors));
          } else {
              alert('Došlo je do greške prilikom dodavanja problema.');
          }
      }
    });
  }




}
