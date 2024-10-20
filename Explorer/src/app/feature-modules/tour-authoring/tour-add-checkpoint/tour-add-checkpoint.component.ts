import { Component } from '@angular/core';
import {TourManagementService} from "../tour-management.service";
import {Router} from "@angular/router";

@Component({
  selector: 'xp-tour-add-checkpoint',
  templateUrl: './tour-add-checkpoint.component.html',
  styleUrls: ['./tour-add-checkpoint.component.css']
})
export class TourAddCheckpointComponent {
  checkpoint = {
    id: 0,
    name: '',
    description: '',
    latitude: 0,
    longitude: 0,
    image: ''
  };

  tour: any; // To store the passed tour information

  constructor(
    private checkpointService: TourManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.tour = navigation.extras.state['tour']; // Retrieve the passed tour object
    }
  }
  onSubmit(): void {
    // Log the current checkpoint data
    console.log('Checkpoint data:', this.checkpoint);

    // Create the checkpoint by calling the checkpoint service
    this.checkpointService.createCheckpoint(this.checkpoint).subscribe(
      (response) => {
        console.log('Checkpoint successfully created:', response);

        // Check if tour is defined before accessing tourCheckpointIds
        if (this.tour && this.tour.tourCheckpointIds) {
          this.tour.tourCheckpointIds.push(response.id); // Correct method to add to an array
        } else {
          console.error('Tour or tourCheckpointIds is undefined');
        }

        // Navigate back to the tour component and pass the updated tour
        this.router.navigate(['/author'], { state: { tour: this.tour, reopenModal: true } }); // Set reopenModal to true
      },
      (error) => {
        console.error('Error creating checkpoint:', error);
      }
    );
  }




  resetForm(): void {
    this.checkpoint = {
      id: 0,
      name: '',
      description: '',
      latitude: 0,
      longitude: 0,
      image: ''
    };
  }
}
