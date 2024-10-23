import { Component, OnInit } from '@angular/core';
import { Equipment } from '../model/my-equipment.model';
import { TouristEquipment } from '../model/tourist-equipment.model';
import { TourExecutionService } from '../tour.execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service'; // <-- Import AuthService

@Component({
  selector: 'xp-my-equipment',
  templateUrl: './my-equipment.component.html',
  styleUrls: ['./my-equipment.component.css']
})
export class MyEquipmentComponent implements OnInit {
  equipment: Equipment[] = [];
  touristEquipment: TouristEquipment;
  userId: number = 0; // <-- Hold the logged-in user's ID
  equipmentOwnership: { [equipmentId: number]: boolean } = {}; // <-- Hold ownership check results

  constructor(private service: TourExecutionService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.userId = user.id;  // <-- Get logged-in user ID from AuthService
      this.getEquipment();
    });
  }

  getEquipment(): void {
    this.service.getEquipment().subscribe({
      next: (result: PagedResults<Equipment>) => {
        this.equipment = result.results;
        this.equipment.forEach(eq => {
          this.checkEquipmentOwnership(eq.id); // <-- Check ownership for each equipment item
        });
      },
      error: () => {
        // handle error
      }
    });
  }

  onDelete(equipmentId: number): void {
    // Prvo dobavi TouristEquipment na osnovu userId i equipmentId
    this.service.getByTouristAndEquipment(this.userId, equipmentId).subscribe({
      next: (touristEquipment) => {
        // Zatim pozovi funkciju za brisanje
        this.service.deleteEquipment(Number(touristEquipment.id)).subscribe({
          next: () => {
            // Nakon brisanja, osveži equipment listu
            this.getEquipment();
          },
          error: () => {
            // Handle error during delete
          }
        });
      },
      error: () => {
        // Handle error if equipment not found
      }
    });
  }

  onAdd(equipmentId: number): void {
    const touristEquipment: TouristEquipment = {
      touristId: this.userId,
      equipmentId: equipmentId
    };

    this.service.addTouristEquipment(touristEquipment).subscribe({
      next: () => {
        this.getEquipment();  // Osveži listu opreme nakon dodavanja
      },
      error: () => {
        // Handle error during add
      }
    });
  }

  // Call the backend to check if the logged-in user owns the equipment
  checkEquipmentOwnership(equipmentId: number): void {
    console.log("Proveravam ownership za touristId:", this.userId, " i equipmentId:", equipmentId);
  
    this.service.getByTouristAndEquipment(this.userId, equipmentId).subscribe({
      next: () => {
        this.equipmentOwnership[equipmentId] = true; // <-- Set to true if the user owns the equipment
      },
      error: () => {
        this.equipmentOwnership[equipmentId] = false; // <-- Set to false if not owned
      }
    });
  }
}