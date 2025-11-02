import { Component } from '@angular/core';
import { BundleDTO } from '../model/pacages-publ';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ShoppingCartBundleDTO } from '../model/shopping-cart';

@Component({
  selector: 'xp-pacages-publ',
  templateUrl: './pacages-publ.component.html',
  styleUrls: ['./pacages-publ.component.css']
})
export class PacagesPublComponent {
  
  bundles: BundleDTO[] = [];
  touristId: number | null = null; // Dinamički ID turiste
  bundle: ShoppingCartBundleDTO[] = [];

  constructor(
    private marketplaceService: MarketplaceService,
    private authService: AuthService // Dodato za autentifikaciju
  ) {}

  ngOnInit(): void {
    // Pretplaćujemo se na korisnika da bismo dobili ID turiste
    this.authService.user$.subscribe(user => {
      if (user) {
        this.touristId = user.id; // Pretpostavlja se da id sadrži ID korisnika
        this.loadPublishedBundles();
      }
    });
  }

  loadPublishedBundles(): void {
    this.marketplaceService.getPublishedBundles().subscribe({
      next: (data) => {
        this.bundles = data;
      },
      error: (err) => {
        console.error('Error fetching published bundles', err);
      }
    });
  }
  
  addBundleToCart(bundle: BundleDTO): void {
  
    if (this.touristId === null) {
      alert('Tourist ID not found. Please log in again.');
      return;
    }

    const shoppingCartItem: ShoppingCartBundleDTO = {
      bundleId: bundle.id,
      name: bundle.name,
      price: bundle.customPrice ,
    };
    
    this.marketplaceService.addBundleToCart(this.touristId, shoppingCartItem).subscribe({
      next: () => {
        alert('Pacage added to cart successfully!');
      },
      error: (error) => {
        if (error.status && error.message) {
          alert(`Error adding pacage to cart. Status: ${error.status}, Message: ${error.message}`);
        } else {
          alert('Error adding pacage to cart');
        }
      }
    });
    }
}
