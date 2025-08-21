// tourist-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { TouristProfileService } from '../tourist-profile.service';
import { TouristProfile } from '../model/tourist-profile.model';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { Coupon } from '../../feature-modules/marketplace/model/coupon';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'xp-tourist-profile',
  templateUrl: './tourist-profile.component.html',
  styleUrls: ['./tourist-profile.component.css']
})
export class TouristProfileComponent implements OnInit {
  profile: TouristProfile | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  syncMessage: string | null = null;
  coupons: Coupon[] = [];
  isLoadingCoupons = true;

  // UI helpers
  levelProgressPercent = 0;
  levelProgressText = '';

  constructor(
    private touristProfileService: TouristProfileService,
    private authService: AuthService,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    const username = this.authService.user$.value?.username;
    this.isLoading = true;
    this.errorMessage = null;

    if (!username) {
      this.errorMessage = 'Username is not available.';
      this.isLoading = false;
      this.isLoadingCoupons = false;
      return;
    }

    this.touristProfileService.getTouristProfile(username).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.computeLevelProgress();
        this.isLoading = false;
        this.loadCoupons();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load tourist profile.';
        this.isLoading = false;
        this.isLoadingCoupons = false;
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
        this.ngOnInit();
      },
      error: (err) => {
        console.error(err);
        this.syncMessage = 'Failed to sync completed encounters.';
      }
    });
  }

  loadCoupons(): void {
    if (!this.profile?.couponIds?.length) {
      this.isLoadingCoupons = false;
      this.coupons = [];
      return;
    }

    this.isLoadingCoupons = true;
    this.touristProfileService.getCouponsByIds(this.profile.couponIds).subscribe({
      next: (coupons) => {
        this.coupons = coupons ?? [];
        this.isLoadingCoupons = false;
      },
      error: (error) => {
        console.error('Error fetching coupons:', error);
        this.errorMessage = 'Failed to load coupons.';
        this.isLoadingCoupons = false;
      }
    });
  }

  /* ===== UI helpers ===== */
  computeLevelProgress(): void {
    if (!this.profile) { this.levelProgressPercent = 0; this.levelProgressText = ''; return; }

    // primer: recimo da je prag za sledeći nivo 1000 XP (adjust if you have real rules)
    const xpPerLevel = 1000;
    const currentLevelBaseXp = (this.profile.level ?? 0) * xpPerLevel;
    const nextLevelBaseXp = (this.profile.level ?? 0 + 1) * xpPerLevel;

    const progress = Math.max(0, Math.min(
      1,
      (this.profile.xp - currentLevelBaseXp) / (nextLevelBaseXp - currentLevelBaseXp)
    ));

    this.levelProgressPercent = Math.round(progress * 100);
    const remaining = Math.max(0, nextLevelBaseXp - this.profile.xp);
    this.levelProgressText = `${this.levelProgressPercent}% • ${remaining} XP to next level`;
  }

  daysUntil(date: string | Date): number {
    const now = new Date();
    const d = new Date(date);
    const diff = d.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    // koristi se u template-u za badge "Xd left"
  }

  copyCode(code: string): void {
    this.clipboard.copy(code);
    this.syncMessage = `Copied coupon code "${code}"`;
    setTimeout(() => (this.syncMessage = null), 2500);
  }

  trackById = (_: number, id: string | number) => id;
  trackByCoupon = (_: number, c: Coupon) => c?.code ?? _;
}
