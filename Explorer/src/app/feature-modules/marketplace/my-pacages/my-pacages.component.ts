import { Component } from '@angular/core';
import { BundleDTO } from '../model/pacages-publ';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-my-pacages',
  templateUrl: './my-pacages.component.html',
  styleUrls: ['./my-pacages.component.css']
})
export class MyPacagesComponent {
  bundles: BundleDTO[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private marketplaceService: MarketplaceService, private authService: AuthService) {}

  touristId: number | null = null;  // ID korisnika (turista)
  user: User | undefined;  // Ulogovani korisnik


  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.touristId = user.id;
        
        this.marketplaceService.getBundlesForTourist(this.touristId).subscribe({
          next: (data) => {
            this.bundles = data;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching bundles:', error);
            this.errorMessage = 'Failed to load bundles.';
            this.loading = false;
          }
        });
      }
    });
  }
}
