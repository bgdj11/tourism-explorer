import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Coupon } from '../model/coupon';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from '../marketplace.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { TourDTO } from '../../tour-authoring/model/tour.model';

@Component({
  selector: 'xp-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrls: ['./coupon-form.component.css']
})
export class CouponFormComponent implements OnChanges {

  selectedTourIds: number[] = []; // Niz za selektovane ID tura
  couponCode: string = ''; // Kod kupona koji će biti korišćen za sve ture

  @Output() couponUpdated = new EventEmitter<null>();
  @Input() coupon: Coupon;
  @Input() shouldEditCoupon: boolean = false;
  user: User | undefined;

  tours: TourDTO[] = []; // Čuva liste tura

  constructor(
    private service: MarketplaceService,
    private authService: AuthService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.couponForm.reset();
  
    // Pretplata na korisnika iz AuthService
    this.authService.user$.subscribe(user => {
      this.user = user;
  
      if (this.user?.id) {
        // Preuzimanje tura (strana 1, veličina strane 10)
        this.service.getPublishToursByAuthorId(this.user.id).subscribe({
          next: (response) => {
            if (Array.isArray(response)) {
              this.tours = response; // Ako je `response` niz, direktno ga dodelite
            } else {
              this.tours = response.results; // Ako je paginiran, koristite `results`
            }
          },
          error: (err) => {
            console.error('Failed to fetch tours:', err);
          }
        });
      }
    });
  
    // Generišemo novi kod samo ako nismo u modu uređivanja
    if (!this.shouldEditCoupon) {
      this.couponCode = this.generateRandomCode(); // Dodeljujemo kod samo jednom
    }
  
    // Ako je edit mod, patch-ujemo formu sa podacima kupona
    if (this.shouldEditCoupon && this.coupon) {
      const formattedDate = this.coupon.expiryDate
        ? new Date(this.coupon.expiryDate).toISOString().split('T')[0]
        : '';
  
      this.couponForm.patchValue({
        ...this.coupon,
        expiryDate: formattedDate
      });
      this.couponCode = this.coupon.code || ''; // Koristimo postojeći kod ako je u edit modu
    }
  
    // Postavljanje vrednosti za `code` direktno u formu
    this.couponForm.patchValue({
      code: this.couponCode
    });
  }
  
  

  couponForm = new FormGroup({
    code: new FormControl(this.couponCode, [Validators.required]), // Kod kupona, obavezno polje
    discountPercentage: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]), // Procenat popusta (0-100)
    expiryDate: new FormControl('', [Validators.required]), // Datum isteka, obavezno polje
    tourIds: new FormArray([], [Validators.required]), // Mora biti FormArray
    authorId: new FormControl(0, [Validators.required]),
  });
  

  addCoupon(): void {
    const selectedTourIds = this.couponForm.value.tourIds as number[]; // Dohvata odabrane ture
    
    if (selectedTourIds.length === 0) {
      alert('Please select at least one tour!');
      return;
    }
  
    // Generišemo novi kod kupona
    const couponCode = this.generateRandomCode(); // Novi kod svakog puta
  
    // Postavite novi kod u formu pre nego što šaljete podatke
    this.couponForm.patchValue({
      code: couponCode
    });
  
    // Iteriramo kroz sve odabrane ture i kreiramo pojedinačne kupone
    selectedTourIds.forEach(tourId => {
      const coupon: Coupon = {
        code: couponCode, // Koristimo novi generisani kod za sve ture
        discountPercentage: this.couponForm.value.discountPercentage || 0,
        expiryDate: this.couponForm.value.expiryDate ? new Date(this.couponForm.value.expiryDate).toISOString() : "",
        tourId,
        authorId: this.user?.id,
        recipientId: undefined,
        isPublic: false
      };
  
      this.service.createCoupon(coupon).subscribe({
        next: () => {
          console.log(`Coupon created for tourId: ${tourId}`);
          this.couponUpdated.emit(); // Emituje signal da je kupon kreiran
        },
        error: (err: any) => {
          console.error(`Failed to create coupon for tourId: ${tourId}`, err);
        }
      });
    });
  
    // Resetovanje svih vrednosti u formi, uključujući FormArray
    this.couponForm.reset(); // Resetuje sve kontrole
    this.couponForm.setControl('tourIds', new FormArray([])); // Vraća FormArray na početno stanje
  
    // Poništavanje selektovanih tura (ako je potrebno)
    this.selectedTourIds = []; // Poništavanje selektovanih tura u komponenti
  
    // Dodeljujemo novi kod za sledeći unos
    this.couponCode = this.generateRandomCode(); // Dodeljujemo novi kod za sledeći unos
  }
  
  

  updateCoupon(): void {
    const selectedTourIds = this.couponForm.value.tourIds as number[]; // Dohvata odabrane ture iz forme
    const rawDate = this.couponForm.value.expiryDate;

    if (selectedTourIds.length === 0) {
      alert('Please select at least one tour to update!');
      return;
    }

    // Koristimo isti kod za sve selektovane ture
    const couponCode = this.couponCode;

    // Iteriramo kroz sve odabrane ture i ažuriramo pojedinačne kupone
    selectedTourIds.forEach(tourId => {
      const coupon: Coupon = {
        id: this.coupon.id, // ID kupona koji se ažurira
        code: couponCode, // Koristimo isti kod
        discountPercentage: this.couponForm.value.discountPercentage || 0,
        expiryDate: rawDate ? new Date(rawDate).toISOString() : "",
        tourId,
        authorId: this.user?.id || 0,
        isPublic: false
      };

      this.service.updateCoupon(coupon).subscribe({
        next: () => {
          console.log(`Coupon updated for tourId: ${tourId}`);
          this.couponUpdated.emit(); // Emit signal da je kupon ažuriran
        },
        error: (err: any) => {
          console.error(`Failed to update coupon for tourId: ${tourId}`, err);
        }
      });
    });

    this.couponForm.reset(); // Resetuje formu nakon ažuriranja svih kupona
    this.couponForm.setControl('tourIds', new FormArray([]));
  }

  generateRandomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  onSelectionChange(event: any): void {
    const tourIds = this.couponForm.get('tourIds') as FormArray;

    // Ako 'event.source.selectedOptions' nije definisano, logujte grešku
    if (!event.source.selectedOptions) {
      console.error('event.source.selectedOptions is undefined');
      return;
    }

    // Prolazak kroz sve selektovane opcije
    const selectedTourIds = event.source.selectedOptions.selected.map((option: any) => option.value);

    // Dodajte selektovane ture u FormArray
    selectedTourIds.forEach((tourId: number) => {
      if (!tourIds.value.includes(tourId)) {
        tourIds.push(new FormControl(tourId));
      }
    });

    // Ako neki ID nije selektovan, uklonite ga iz FormArray
    tourIds.controls.forEach((control, index) => {
      if (!selectedTourIds.includes(control.value)) {
        tourIds.removeAt(index);
      }
    });
  }
}
