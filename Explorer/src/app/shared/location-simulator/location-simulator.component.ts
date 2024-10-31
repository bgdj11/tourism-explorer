import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'location-simulator',
  templateUrl: './location-simulator.component.html',
  styleUrls: ['./location-simulator.component.css']
})
export class LocationSimulatorComponent implements OnInit {
  currentLocation: { lat: number, lng: number } | null = null;
  user: User | undefined; // Dodaj promenljivu za korisnika

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Pretplatite se na promene korisnika
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  onLocationSelected(location: { lat: number, lng: number }): void {
    this.currentLocation = location;
  }
}
