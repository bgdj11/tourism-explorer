import { Component, OnInit } from '@angular/core';
import { TouristProfileService } from '../tourist-profile.service';
import { TouristProfile } from '../model/tourist-profile.model';
import { AuthService } from '../../infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tourist-profile',
  templateUrl: './tourist-profile.component.html',
  styleUrls: ['./tourist-profile.component.css']
})
export class TouristProfileComponent implements OnInit {
  profile: TouristProfile | null = null; // Podaci o turističkom profilu
  isLoading = true; // Indikator učitavanja
  errorMessage: string | null = null; // Poruka o grešci
  syncMessage: string | null = null; // Poruka za sinhronizaciju

  constructor(
    private touristProfileService: TouristProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const username = this.authService.user$.value?.username; // Preuzimanje username-a iz AuthService

    if (!username) {
      this.errorMessage = 'Username is not available.';
      this.isLoading = false;
      return;
    }

    // Dohvati podatke o turističkom profilu prema username-u
    this.touristProfileService.getTouristProfile(username).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load tourist profile.';
        console.error(err); // Logovanje greške za analizu
        this.isLoading = false;
      }
    });
  }

  syncEncounters(): void {
    const username = this.authService.user$.value?.username;

    if (!username) {
      this.syncMessage = 'Username is not available.';
      return;
    }

    this.touristProfileService.syncCompletedEncounters(username).subscribe({
      next: () => {
        this.syncMessage = 'Successfully synced completed encounters.';
        this.ngOnInit(); // Ponovo učitaj profil nakon sinhronizacije
      },
      error: (err) => {
        this.syncMessage = 'Failed to sync completed encounters.';
        console.error(err); // Logovanje greške za analizu
      }
    });
  }
}
