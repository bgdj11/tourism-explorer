import { Component, OnInit } from '@angular/core';
import { ClubDTO } from '../model/club.model';
import { TourManagementService } from '../tour-management.service'; 
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubsComponent implements OnInit {

  clubs: ClubDTO[] = [];
  currentUserId : number = 0;
  newClub: ClubDTO = { name: '', description: '', photo: '', ownerId: 0 };
  editingClub: ClubDTO | null = null;


  constructor(private service: TourManagementService,
    private authService : AuthService
  ) { }

  ngOnInit(): void {

    this.authService.user$.subscribe(user => {
      this.currentUserId = user.id;
    });

    this.getClubs(1, 10);
  }

  getClubs(page: number, pageSize: number): void {
    this.service.getClubs(page, pageSize).subscribe(response => {
      this.clubs = response.results;
    });
  }

    addClub(){
      if (this.currentUserId) {
        this.newClub.ownerId = this.currentUserId;

      this.service.createClub(this.newClub).subscribe(
        response => {
          console.log('Club added successfully', response);
          this.newClub = {name: '', description: '', photo: '', ownerId: this.currentUserId};
        },
        error => {
          console.error('Error creating club:', error);
        }
        
        
      )
    }
  }
    

  deleteClub(id: number): void {
    this.service.deleteClub(id).subscribe(() => {
      console.log('Club deleted');
      this.getClubs(1, 10);
    });
  } 

  editClub(club: ClubDTO): void {
    this.editingClub = { ...club };  
  }

  updateClub(): void {
    if (this.editingClub && this.editingClub.ownerId === this.currentUserId) {
      this.service.updateClub(this.editingClub).subscribe(
        response => {
          console.log('Club updated successfully', response);
          this.editingClub = null;  
          this.getClubs(1, 10);  
        },
        error => {
          console.error('Error updating club:', error);
        }
      );
    } else {
      console.error('You are not authorized to update this club.');
    }
  }
  


}
