import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from '../marketplace.service';
import { Coupon } from '../model/coupon';

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

  constructor(private service: MarketplaceService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getCoupons(1, 10);
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  // Dobavljanje liste kupona
  getCoupons(page: number, pageSize: number): void {
    this.service.getCoupons(page, pageSize).subscribe(response => {
      this.coupons = response.results;
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

}
