import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from '../marketplace.service';
import { Coupon } from '../model/coupon';
import { TourDTO } from '../../tour-authoring/model/tour.model';
import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'xp-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit {

  coupons: Coupon[] = [];
  shouldRenderCouponForm: boolean = false;
  shouldEditCoupon: boolean = false;
  selectedCoupon : Coupon;
  user: User | undefined;
  tours: TourDTO[] = []; // Čuva liste tura

  constructor(private service: MarketplaceService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
  
      this.loadTours().then(() => {
      this.getCoupons(1, 10); // Učitaj kuponsku listu nakon tura
      });
    });
  }
  

  getCoupons(page: number, pageSize: number): void {
    this.service.getCoupons(page, pageSize).subscribe(response => {
      this.coupons = response.results.filter(c => c.authorId === this.user?.id)
  
      // Dodajte naziv ture ako je lista `tours` dostupna
      this.coupons.forEach(coupon => {
        if (coupon.tourId) {
          const tour = this.tours.find(t => t.id === coupon.tourId);
          coupon.tourName = tour ? tour.name : 'Nepoznata tura';
        } else {
          coupon.tourName = 'Sve ture';
        }
      });
    });
  }
  
  
  loadTours(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.user?.id) {
        this.service.getPublishToursByAuthorId(this.user.id).subscribe({
          next: (response) => {
            if (Array.isArray(response)) {
              this.tours = response;
            } else {
              this.tours = response.results;
            }
            resolve();
          },
          error: (err) => {
            console.error('Failed to fetch tours:', err);
            reject(err);
          }
        });
      } else {
        resolve();
      }
    });
  }
  
  onAddCouponClicked(): void {
    this.shouldRenderCouponForm = true;
    this.shouldEditCoupon = false;
  }

  onEditCouponClicked(coupon: Coupon): void {
    this.selectedCoupon = coupon;
    this.shouldRenderCouponForm = true;
    this.shouldEditCoupon = true;
  }

  // Brisanje kupona
  deleteCoupon(id: number): void {
    this.service.deleteCoupon(id).subscribe({
      next: () => {
        this.getCoupons(1,10);
      },
    })
  }

  makeCouponPublic(id: number): void{
    this.service.publishCoupon(id).subscribe({
      next: (response) => {
        console.log(response)
        alert(response.message || 'Publish successfully.');
      },
      error: (err: HttpErrorResponse) => {
        let errorMessage = 'Failed to publish the coupon. Please try again later.';
        if(err.error && err.error.message){
          errorMessage = err.error.message;
        }
        alert(errorMessage);
      }
    })

  }
}
