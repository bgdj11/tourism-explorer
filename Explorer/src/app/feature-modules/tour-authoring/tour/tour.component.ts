import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { TourDTO } from "../model/tour.model";
import { TourManagementService } from "../tour-management.service";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {faPencil, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import { Router } from '@angular/router';
import {Equipment} from "../../administration/model/equipment.model";
import {CheckpointDTO} from "../model/checkpoint.model"; // Import Router
import {MapComponent} from "../../../shared/map/map.component";
import {L} from "@angular/cdk/keycodes";

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {
  private modalMarker: L.Marker | null = null;
  tours: TourDTO[] = [];
  selectedTourCheckpoints: CheckpointDTO[] = [];
  selectedTourEquipment: Equipment[] = [];
  availableEquipment: Equipment[] = [];
  selectedEquipmentIds: number[] = [];
  selectedTour: any = null;
  totalCount: number = 0;
  totalEquipmentCount: number = 0;
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
  newCheckpoint: CheckpointDTO = {
    id: 0,
    checkpointName: '',
    checkpointDescription: '',
    latitude: undefined,
    longitude: undefined,
    image: ''
  };

  @ViewChild('tourModal') tourModal!: TemplateRef<any>;
  @ViewChild('checkpointModal') checkpointModal!: TemplateRef<any>;
  @ViewChild('equipmentModal') equipmentModal!: TemplateRef<any>;
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  private modalRef!: NgbModalRef;

  constructor(
    private tourService: TourManagementService,
    private modalService: NgbModal,
    private router: Router // Inject Router
  ) {
    this.loadAvailableEquipment();
  }

  selectTour(tour: any): void {
    this.selectedTour = tour;
    this.getCheckpointsByTourId(tour.id);
    this.getEquipmentByTourId(tour.id);
  }

  ngOnInit(): void {
    this.loadTours();
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

  loadAvailableEquipment(): void {
    this.tourService.getAllEquipment(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.availableEquipment = data.results.map(e => ({ ...e, selected: false }));
        this.totalEquipmentCount = data.totalCount;
      },
      (error) => {
        console.error('Greška prilikom dohvatanja opreme', error);
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

  openCheckpointModal(checkpoint?: CheckpointDTO): void {
    if (checkpoint) {
      // Postavljamo podatke za izmenu postojećeg checkpointa
      this.newCheckpoint = { ...checkpoint };
    } else {
      // Resetujemo podatke za novi checkpoint
      this.newCheckpoint = { id: 0, checkpointName: '', checkpointDescription: '', latitude: undefined, longitude: undefined, image: '' };
    }

    // Otvaranje modalnog dijaloga
    this.modalRef = this.modalService.open(this.checkpointModal, { size: 'lg' });
  }



  openEquipmentModal(): void {
    this.modalRef = this.modalService.open(this.equipmentModal);
  }

  onMapClick(event: { lat: number, lng: number }) {
    this.newCheckpoint.latitude = event.lat;
    this.newCheckpoint.longitude = event.lng;

    // Postavite jedinstveni marker na mapi unutar modalnog dijaloga
    if (this.mapComponent) {
      this.mapComponent.setUniqueMarker(event.lat, event.lng);
    }
  }

  clearModalMarker(): void {
    if (this.modalMarker) {
      this.mapComponent.map.removeLayer(this.modalMarker);
      this.modalMarker = null;
    }
  }

  closeModal(): void {
    // Zatvori modalni dijalog
    this.modalRef.close();

    // Očisti markere sa modalne mape, ali ne uklanjaj glavnu mapu
    if (this.mapComponent && this.mapComponent.singleMarker) {
      this.mapComponent.clearSingleMarker(); // Očisti jedinstveni marker na modalnoj mapi
    }
  }

  addCheckpoint(): void {
    // Ako postoji ID, onda se radi o uređivanju postojećeg checkpointa
    if (this.newCheckpoint.id) {
      this.tourService.updateCheckpoint(this.newCheckpoint).subscribe(
        (response) => {
          // Ažurirajte listu checkpointova ture sa izmenjenim checkpointom
          const index = this.selectedTourCheckpoints.findIndex(c => c.id === this.newCheckpoint.id);
          if (index !== -1) {
            this.selectedTourCheckpoints[index] = response;
          }
          this.closeModal();
        },
        (error) => {
          console.error('Greška prilikom ažuriranja checkpointa', error);
        }
      );
    } else {
      // Ako nema ID, onda se radi o dodavanju novog checkpointa
      this.tourService.createCheckpoint(this.newCheckpoint).subscribe(
        (response) => {
          // Ažuriraj listu checkpointova ture
          this.selectedTourCheckpoints.push(response);

          if (this.selectedTour) {
            this.tourService.updateTourCheckpointIds(this.selectedTour.id, response.id).subscribe(
              () => {
                console.log('Checkpoint ID uspešno dodat u turu.');
                this.selectedTour.tourCheckpointIds.push(response.id);
              },
              (error) => {
                console.error('Greška prilikom ažuriranja ID-eva checkpointa na serveru', error);
              }
            );
          }
          this.closeModal();
        },
        (error) => {
          console.error('Greška prilikom dodavanja checkpointa', error);
        }
      );
    }
  }

  removeEquipment(equipmentId: number): void {
    if (this.selectedTour) {
      this.tourService.removeEquipmentFromTour(this.selectedTour.id, equipmentId).subscribe(
        () => {
          this.selectedTourEquipment = this.selectedTourEquipment.filter(e => e.id !== equipmentId);
          console.log(`Oprema sa ID-jem ${equipmentId} je uspešno uklonjena.`);
        },
        (error) => {
          console.error(`Greška prilikom uklanjanja opreme sa ID-jem ${equipmentId}`, error);
        }
      );
    } else {
      console.error('Nijedna tura nije selektovana.');
    }
  }


  onSubmit(): void {
    this.tour = {
      ...this.tour,
      tags: ['ad', 'asd']
    }
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

  getCheckpointsByTourId(tourId: number): void {
    this.selectedTourCheckpoints = [];
    this.tourService.getCheckpointIdsByTourId(tourId).subscribe(checkpointIds => {
      checkpointIds.forEach(id => {
        this.tourService.getCheckpointById(id).subscribe(checkpoint => {
          this.selectedTourCheckpoints.push(checkpoint);
        });
      });
    });
  }

  getEquipmentByTourId(tourId: number): void {
    this.selectedTourEquipment = [];
    this.tourService.getEquipmentIdsByTourId(tourId).subscribe(equipmentIds => {
      equipmentIds.forEach(id => {
        this.tourService.getEquipmentById(id).subscribe(equipment => {
          this.selectedTourEquipment.push(equipment);
        });
      });
    });
  }

  addSelectedEquipment(): void {
    if (this.selectedTour) {
      this.selectedEquipmentIds.forEach(equipmentId => {
        this.tourService.addEquipmentToTour(this.selectedTour.id, equipmentId).subscribe(
          () => {
            const equipment = this.availableEquipment.find(e => e.id === equipmentId);
            if (equipment) {
              this.selectedTourEquipment.push(equipment);
            }
          },
          (error) => {
            console.error(`Greška prilikom dodavanja opreme sa ID-jem: ${equipmentId}`, error);
          }
        );
      });
      // Očistimo selekciju i zatvorimo modal
      this.selectedEquipmentIds = [];
      this.closeModal();
    } else {
      console.error('Nijedna tura nije selektovana.');
    }
  }


  isEquipmentSelected(equipmentId: number): boolean {
    return this.selectedEquipmentIds.includes(equipmentId);
  }

  toggleEquipmentSelection(equipmentId: number): void {
    const index = this.selectedEquipmentIds.indexOf(equipmentId);
    if (index > -1) {
      this.selectedEquipmentIds.splice(index, 1);
    } else {
      this.selectedEquipmentIds.push(equipmentId);
    }
  }

  editCheckpoint(checkpoint: CheckpointDTO): void {
    // Popunite formu sa postojećim podacima checkpointa
    this.newCheckpoint = { ...checkpoint };

    // Otvorite modal za uređivanje checkpointa
    this.modalRef = this.modalService.open(this.checkpointModal, { size: 'lg' });

    // Postavite marker na mapu
    if (this.mapComponent) {
      this.mapComponent.setUniqueMarker(checkpoint.latitude, checkpoint.longitude);
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

  protected readonly faTrash = faTrash;
  protected readonly faPencil = faPencil;
  protected readonly faPlus = faPlus;
}
