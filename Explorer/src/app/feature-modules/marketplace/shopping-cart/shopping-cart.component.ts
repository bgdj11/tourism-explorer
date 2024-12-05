import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { ShoppingCartDTO, ShoppingCartItemDTO } from '../model/shopping-cart';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { empty } from 'rxjs';

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  shoppingCart: ShoppingCartDTO | null = null;  // Shopping cart podaci
  touristId: number | null = null;  // ID korisnika (turista)
  user: User | undefined;  // Ulogovani korisnik
  errorMessage: string | null = null;  // Greška pri učitavanju
  removeErrorMessage: string | null = null;  // Greška pri brisanju ture
  
  couponCode: string = '';
  showCouponForm: boolean = false;

  constructor(private service: MarketplaceService, private authService: AuthService) {}

  ngOnInit(): void {
    // Učitavanje podataka o ulogovanom korisniku
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.touristId = user.id;  // Koristimo ID korisnika iz ulogovanog korisnika
        this.loadShoppingCart();  // Ako je korisnik ulogovan, učitavamo shopping karticu
      }
    });
  }

  // Metoda za učitavanje shopping kartice
  loadShoppingCart(): void {
    if (this.touristId === null) {
      this.errorMessage = 'User not logged in';
      return;
    }

    this.service.getShoppingCart(this.touristId).subscribe({
      next: (cart) => {
        console.log('Shopping cart data:', cart);  // Proverite sve podatke
        console.log('Shopping Bundles:', cart.shopingBundles);  // Proverite samo pakete
        console.log('Shopping Bundles:', cart.shopingItems);  // Proverite samo pakete

        this.shoppingCart = cart;
        this.errorMessage = null;  // Resetujemo grešku ako je učitavanje uspešno
      },
      error: (err) => {
        console.error('Error loading shopping cart', err);
        this.shoppingCart = null;  // Resetujemo shopping cart u slučaju greške
        this.errorMessage = 'There was an error loading your shopping cart. Please try again later.';
      }
    });
  }


  // Metoda za brisanje ture iz shopping kartice
  removeTour(tourId: number): void {
    if (!this.touristId) {
      this.removeErrorMessage = 'User not logged in';
      return;
    }

    this.service.removeTourFromCart(this.touristId, tourId).subscribe({
      next: () => {
        this.removeErrorMessage = null;  // Resetujemo grešku nakon uspešnog brisanja
        this.loadShoppingCart();  // Ponovo učitavamo shopping karticu
      },
      error: (err) => {
        console.error('Error removing tour from cart', err);
        this.removeErrorMessage = 'There was an error removing the tour from your cart. Please try again later.';
      }
    });
  }

  removeBundle(bundleId: number): void {
    if (!this.touristId) {
      this.removeErrorMessage = 'User not logged in';
      return;
    }

    this.service.removeBundleFromCart(this.touristId, bundleId).subscribe({
      next: () => {
        this.removeErrorMessage = null;  // Resetujemo grešku nakon uspešnog brisanja
        this.loadShoppingCart();  // Ponovo učitavamo shopping karticu
      },
      error: (err) => {
        console.error('Error removing tour from cart', err);
        this.removeErrorMessage = 'There was an error removing the tour from your cart. Please try again later.';
      }
    });
  }

  checkout(): void {
    if (this.touristId === null) {
      this.errorMessage = 'User not logged in';
      return;
    }

    const confirmed = window.confirm("Are you sure you want to proceed with the checkout?");
    if (!confirmed) {
      return; 
    }
  
    this.service.checkout(this.touristId).subscribe({
      next: () => {
        this.errorMessage = null;
        this.shoppingCart = null; 
        alert('Checkout completed successfully!');
      },
      error: (err) => {
        console.error('Error during checkout', err);
        this.errorMessage = 'There was an error processing your checkout. Please try again later.';
      }
    });
  }

  toggleCouponForm(){
    this.showCouponForm = !this.showCouponForm;
  }

  applyCoupon(){
    if(!this.couponCode.trim()){
      alert('put the valid coupon code.');
      return;
    }

    if (!this.touristId) {
      alert('Tourist ID is invalid!');
      return;
    }    

    this.service.applyCoupon(this.touristId, this.couponCode).subscribe(
      (response: ShoppingCartDTO) => {
        //ucitaj ture sa novim cijenama.. neka funkcija 
        alert('Coupon has successfully been applied.');
        this.loadShoppingCart();
      },
      (err) => {
        console.log('An error occured while applying a coupon: ', err);
      }
    );


  }

  clearCoupon(){
    this.couponCode = '';
    this.errorMessage = null;
    alert('Coupon is not used.');
    this.showCouponForm = !this.showCouponForm;
  }
}

