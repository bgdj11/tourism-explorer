import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { TourSale } from '../model/tour-sale.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import {TourDTO} from "../../tour-authoring/model/tour.model";

@Component({
  selector: 'xp-tour-sale',
  templateUrl: './tour-sale.component.html',
  styleUrls: ['./tour-sale.component.css']
})
export class TourSaleComponent implements OnInit{
  showForm = false;
  loggedInUserId: number;
  tours: TourDTO[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  selectedTours: number[] = [];
  sales: TourSale[] = [];
  salesTourDetails: Map<number, TourDTO[]> = new Map();
  editingSaleId: number | null = null;
  selectedTourIds: number[] = [];

  constructor(private service: MarketplaceService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.loggedInUserId = user.id;
      this.loadTours();     
      this.getSales();
    });
  }

  getSales(): void {
    this.service.getTourSales().subscribe({
      next: (result: PagedResults<TourSale>) => {
        this.sales = result.results.filter(sale => sale.authorId === this.loggedInUserId);
        this.populateTourDetails();
        const salesToActivate = this.sales.filter(sale => !sale.active && new Date(sale.startDate) <= new Date());
        const salesToDeactivate = this.sales.filter(sale => sale.active && new Date(sale.endDate) < new Date());

        if (salesToActivate.length > 0) {
          this.service.activateSales(salesToActivate).subscribe({
            next: (response) => console.log(response),
            error: (err) => console.error('Error activating sales:', err),
          });
        }

        if (salesToDeactivate.length > 0) {
          this.service.deactivateSales(salesToDeactivate).subscribe({
            next: (response) => console.log(response),
            error: (err) => console.error('Error deactivating sales:', err),
          });
        }
      },
      error: () => {
      }
    })
  }

  populateTourDetails(): void {
    this.sales.forEach(sale => {
      const tourDetails: TourDTO[] = []; // Kreiraj listu za trenutni sale
      sale.tours.forEach(tourId => {
        this.service.getTour(tourId).subscribe({
          next: (tour) => {
            tourDetails.push(tour); // Dodaj tour u listu
            this.salesTourDetails.set(sale.id!, tourDetails); // Ažuriraj mapu
          },
          error: (err) => {
            console.error(`Error fetching tour with ID ${tourId}:`, err);
          }
        });
      });
    });
  }
  
  deleteSale(sale: TourSale): void {
    this.service.deleteTourSale(sale.id!).subscribe({
      next: () => {
        this.getSales();
        console.log('Sale successfully deleted.');
      },
      error: (err) => {
        console.error('Error deleting sale:', err);
      }
    });
  }

  toggleTourSelection(tourId: number): void {
    const index = this.selectedTours.indexOf(tourId);
    if (index === -1) {
      this.selectedTours.push(tourId); // Dodaj ako nije selektovana
    } else {
      this.selectedTours.splice(index, 1); // Ukloni ako jeste selektovana
    }
  }

  isTourSelected(tourId: number): boolean {
    return this.selectedTours.includes(tourId); // Proveri da li je tura selektovana
  }

  loadTours():void{
    this.service.getTours(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.tours = data.results.filter(tour => tour.authorId === this.loggedInUserId);
      }
    );
  }

  // Default vrednosti za formu
  newSale = {
    discount: null as number | null,
    startDate: '',
    endDate: '',
  };

  minStartDate: string = this.calculateTomorrow();
  maxEndDate: string = ''; // Dinamički izračunat


  toggleForm(): void {
    this.showForm = !this.showForm;

    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newSale = {
      discount: null,
      startDate: '',
      endDate: '',
    };
    this.maxEndDate = '';
    this.selectedTours = [];
  }

  calculateTomorrow(): string {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  }

  updateMaxEndDate(): void {
    if (this.newSale.startDate) {
      const startDate = new Date(this.newSale.startDate);
      const maxDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 dana nakon startDate
      this.maxEndDate = maxDate.toISOString().split('T')[0];
    } else {
      this.maxEndDate = '';
    }
  }

  updateMaxEndDate1(): void {
    if (this.newSale1.startDate) {
      const startDate = new Date(this.newSale1.startDate);
      const maxDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 dana nakon startDate
      this.maxEndDate = maxDate.toISOString().split('T')[0];
    } else {
      this.maxEndDate = '';
    }
  }

  isFormValid() {
    const { discount, startDate, endDate } = this.newSale;
    if (!discount || !startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return discount >= 1 && discount <= 100 && startDate && this.selectedTours.length > 0 && end <= new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);
  }

  isFormValid1() {
    const { discount, startDate, endDate } = this.newSale1;
    if (!discount || !startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return discount >= 1 && discount <= 100 && startDate && this.selectedTours.length > 0 && end <= new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);
  }

  onStartDateChange(): void {
    this.updateMaxEndDate();
    this.updateMaxEndDate1(); 
  }

  submitForm(): void {
    const tourSale: TourSale = {
      tours: this.selectedTours, 
      startDate: new Date(this.newSale.startDate), 
      endDate: new Date(this.newSale.endDate), 
      discount: this.newSale.discount!,
      active: false,
      authorId: this.loggedInUserId,
    };
  
    this.service.addSale(tourSale).subscribe(
      (response) => {
        console.log('Sale successfully created:', response);
        this.toggleForm();
        this.resetForm();
      },
      (error) => {
        console.error('Error creating sale:', error);
      }
    );
    this.getSales();
  }

  newSale1 = {
    discount: null as number | null,
    startDate: '',
    endDate: '',
  };

  updateSale(sale: TourSale): void {
    this.editingSaleId = sale.id!;
    const start = new Date(sale.startDate);
    start.setDate(start.getDate() + 1);
    const end = new Date(sale.endDate);
    end.setDate(end.getDate() + 1);
    this.newSale1 = {
      discount: sale.discount,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    }; 
    this.loadTours(); // Učitaj sve ture
    this.selectedTours = [...sale.tours];
    this.minStartDate = this.calculateTomorrow();
    this.updateMaxEndDate1();
  }

  submitEdit(sale: TourSale): void {
    const updatedSale: TourSale = {
      ...sale,
      discount: this.newSale1.discount!,
      startDate: new Date(this.newSale1.startDate),
      endDate: new Date(this.newSale1.endDate),
      tours: this.selectedTours,
    };
  
    this.service.updateTourSale(updatedSale).subscribe(
      () => {
        this.editingSaleId = null;
        this.getSales(); // Osvježavanje
        this.newSale1 = {
          discount: null,
          startDate: '',
          endDate: '',
        };
        this.maxEndDate = '';
        this.selectedTours = [];
      },
      (error) => {
        console.error('Error updating sale:', error);
      }
    );
  }
  
  cancelEdit(): void {
    this.editingSaleId = null;
    this.newSale1 = {
      discount: null,
      startDate: '',
      endDate: '',
    };
    this.maxEndDate = '';
    this.selectedTours = [];
  }

  toggleTourSelection1(tourId: number, isChecked: boolean): void {
    if (isChecked) {
      if (!this.selectedTourIds.includes(tourId)) {
        this.selectedTourIds.push(tourId);
      }
    } else {
      this.selectedTourIds = this.selectedTourIds.filter((id) => id !== tourId);
    }
  }

}
