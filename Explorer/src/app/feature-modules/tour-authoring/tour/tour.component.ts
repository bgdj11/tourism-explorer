import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TourDTO } from "../model/tour.model";
import { TourManagementService } from "../tour-management.service";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {
  tours: TourDTO[] = [];
  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  modalTitle: string = '';
  tour: TourDTO = {
    id: 0,
    name: '',
    description: '',
    weight: '',
    tags: [],
    price: undefined,
    equipmentIds: [],
    tourCheckpointIds: []
  };

  @ViewChild('tourModal') tourModal!: TemplateRef<any>;
  private modalRef!: NgbModalRef;

  constructor(
    private tourService: TourManagementService,
    private modalService: NgbModal,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.loadTours();

    // Check if we are reopening the modal with tour data after adding a checkpoint
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['reopenModal']) {
      this.tour = navigation.extras.state['tour'];
      this.openModal('edit', this.tour);
    }
  }

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

  openModal(mode: string, tour?: TourDTO): void {
    this.modalTitle = mode === 'add' ? 'Dodaj novu turu' : 'Izmeni turu';
    this.tour = tour
      ? { ...tour }
      : {
        id: 0,
        name: '',
        description: '',
        weight: '',
        tags: [],
        price: undefined,
        equipmentIds: [],
        tourCheckpointIds: []
      };
    this.modalRef = this.modalService.open(this.tourModal);
  }

  closeModal(): void {
    this.modalRef.close();
  }

  onSubmit(): void {
    if (this.tour.id) {
      this.tourService.updateTour(this.tour).subscribe(
        (response) => {
          this.loadTours();
          this.closeModal();
        },
        (error) => {
          console.error('Greška prilikom izmenjivanja ture', error);
        }
      );
    } else {
      this.tourService.createTour(this.tour).subscribe(
        (response) => {
          this.loadTours();
          this.closeModal();
        },
        (error) => {
          console.error('Greška prilikom dodavanja ture', error);
        }
      );
    }
  }

  deleteTour(tourId: number): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovu turu?')) {
      this.tourService.deleteTour(tourId).subscribe(
        (response) => {
          this.loadTours();
        },
        (error) => {
          console.error('Greška prilikom brisanja ture', error);
        }
      );
    }
  }

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

  // New method to navigate to the Add Checkpoint page
  goToAddCheckpoint(): void {
    this.router.navigate(['/add-checkpoint'], {
      state: { tour: this.tour, reopenModal: true }  // Pass the current tour data and reopen flag as state
    });
  }

  protected readonly faTrash = faTrash;
  protected readonly faPencil = faPencil;
}
