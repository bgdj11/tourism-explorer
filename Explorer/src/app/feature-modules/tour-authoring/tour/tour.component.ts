import {Component, OnInit} from '@angular/core';
import {TourDTO} from "../model/tour.model";
import {TourManagementService} from "../tour-management.service";
import {PagedResults} from "../../../shared/model/paged-results.model";
import {NgForm} from "@angular/forms";

declare var $: any;

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {
  tours: TourDTO[] = []; // Lista tura
  totalCount: number = 0; // Ukupan broj tura
  currentPage: number = 1; // Trenutna strana
  pageSize: number = 10; // Broj stavki po stranici
  modalTitle: string = '';
  tour: TourDTO = {
    id: 0,
    name: '',
    description: '',
    weight: '',
    tags: [],
    price: undefined,
    equipmentIds: []
  };

  constructor(private tourService: TourManagementService) {}

  ngOnInit(): void {
    this.loadTours();
  }

  // Učitavanje tura sa paginacijom
  loadTours(): void {
    this.tourService.getTours(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.tours = data.results;
        this.totalCount = data.totalCount;
      },
      (error) => {
        console.error('Greška prilikom dohvatanja tura', error);
      }
    );
  }

  // Otvaranje modala za dodavanje ili izmenu ture
  openModal(mode: string, tour?: TourDTO): void {
    this.modalTitle = mode === 'add' ? 'Dodaj novu turu' : 'Izmeni turu';
    this.tour = tour
      ? { ...tour } // Ako je prosleđen objekat ture (za izmenu), kopiramo ga
      : {
        id: 0,
        name: '',
        description: '',
        weight: '',
        tags: [],
        price: undefined,
        equipmentIds: [],
      }; // Ako se radi o dodavanju nove ture, koristimo prazan objekat

    $('#tourModal').modal('show'); // Otvaranje modala korišćenjem jQuery-a
  }

  // Zatvaranje modala
  closeModal(): void {
    $('#tourModal').modal('hide'); // Zatvaranje modala korišćenjem jQuery-a
  }

  // Podnošenje forme za dodavanje ili izmenu ture
  onSubmit(): void {
    if (this.tour.id) {
      // Ako postoji ID, radi se o izmeni
      this.tourService.updateTour(this.tour).subscribe(
        (response) => {
          this.loadTours(); // Osvežavanje liste tura
          this.closeModal(); // Zatvaranje modala
        },
        (error) => {
          console.error('Greška prilikom izmenjivanja ture', error);
        }
      );
    } else {
      // Ako nema ID-a, radi se o dodavanju nove ture
      this.tourService.createTour(this.tour).subscribe(
        (response) => {
          this.loadTours(); // Osvežavanje liste tura
          this.closeModal(); // Zatvaranje modala
        },
        (error) => {
          console.error('Greška prilikom dodavanja ture', error);
        }
      );
    }
  }

  // Brisanje ture
  deleteTour(tourId: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovu turu?')) {
      this.tourService.deleteTour(tourId).subscribe(
        (response) => {
          this.loadTours(); // Osvežavanje liste tura nakon brisanja
        },
        (error) => {
          console.error('Greška prilikom brisanja ture', error);
        }
      );
    }
  }

  // Metode za navigaciju po stranicama
  nextPage(): void {
    if (this.currentPage * this.pageSize < this.totalCount) {
      this.currentPage++;
      this.loadTours();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTours();
    }
  }
}
