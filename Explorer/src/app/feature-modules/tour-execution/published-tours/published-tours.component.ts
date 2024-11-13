import { Component, OnInit } from '@angular/core';
import { TourDTO } from '../model/tour-model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourExecutionService } from '../tour.execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ShoppingCartItemDTO } from '../model/shopping-cart.model';

@Component({
  selector: 'xp-published-tours',
  templateUrl: './published-tours.component.html',
  styleUrls: ['./published-tours.component.css']
})
export class PublishedToursComponent implements OnInit {

  problems: TourDTO[] = [];
  user: User | undefined;  // Definiši promenljivu za korisnika


  constructor(private service: TourExecutionService, private authService: AuthService) { }

  ngOnInit(): void {

    this.getProblem();

    this.authService.user$.subscribe(user => {
      this.user = user;
    });

  }

  getProblem(): void {
    this.service.getToursPublished().subscribe({
      next: (result: PagedResults<TourDTO>) => {
        console.log(result.results);
        this.problems = result.results;
      },
      error: () => {
      }
    })
  }

 // Metoda za dodavanje ture u korpu
 addTourToCart(tour: TourDTO): void {
  if (!this.user) {
    alert('You must be logged in to add a tour to your cart');
    return;  // Ako korisnik nije ulogovan, izlazimo iz funkcije
  }

  const touristId = this.user.id;  // Koristimo ID iz ulogovanog korisnika

  // Kreiramo objekat za stavku korpe
  const shoppingCartItem: ShoppingCartItemDTO = {
    tourId: tour.id,
    tourName: tour.name,
    tourPrice: tour.price ?? 0  
  };

  // Pozivamo servis za dodavanje ture u korpu
  this.service.addTourToCart(touristId, shoppingCartItem).subscribe({
    next: () => {
      alert('Tour added to cart successfully!');
    },
    error: (error) => {
      // Ovde ispisujemo detalje greške ako dođe do nje
      if (error.status && error.message) {
        alert(`Error adding tour to cart. Status: ${error.status}, Message: ${error.message}`);
      } else {
        alert('Error adding tour to cart');
      }
    }
  });
  }
}
