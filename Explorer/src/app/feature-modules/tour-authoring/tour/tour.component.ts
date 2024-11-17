import { Component, OnInit, ViewChild, TemplateRef, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { TourDTO } from "../model/tour.model";
import { TourManagementService } from "../tour-management.service";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { faPencil, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Router } from '@angular/router';
import { Equipment } from "../../administration/model/equipment.model";
import { CheckpointDTO } from "../model/checkpoint.model"; // Import Router
import { MapComponent } from "../../../shared/map/map.component";
import { forkJoin } from 'rxjs';
import { TransportType, TravelTimeDTO } from '../model/travelTime.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {
  TransportType = TransportType;
  tours: TourDTO[] = [];
  selectedTourCheckpoints: CheckpointDTO[] = [];
  selectedTourEquipment: Equipment[] = [];
  availableEquipment: Equipment[] = [];
  selectedEquipmentIds: number[] = [];
  selectedTourTravelTimes: TravelTimeDTO[] = [];
  selectedTour: any = null;
  lengthInKm: number;
  totalCount: number = 0;
  totalEquipmentCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  modalTitle: string = '';
  userId: number =0;
  tour: TourDTO = {
    id: 0,
    name: '',
    description: '',
    weight: '',
    tags: [],
    status: 0,
    price: undefined,
    lengthInKm: 0, // Podrazumevana vrednost za dužinu ture
    publishedDate: undefined, // Prazan string za datum objave
    archivedDate: undefined,
    equipments: [],
    tourCheckpoints: [],
    travelTimes: [],
    authorId: 0
  };
  newCheckpoint: CheckpointDTO = {
    id: 0,
    checkpointName: '',
    checkpointDescription: '',
    latitude: undefined,
    longitude: undefined,
    image: undefined,
  };
  newTravelTime: TravelTimeDTO = {
    time: 0,
    transportType: 0
  }

  @Output() waypointsChanged = new EventEmitter<{ lat: number, lng: number }[]>();

  @ViewChild('tourModal') tourModal!: TemplateRef<any>;
  @ViewChild('checkpointModal') checkpointModal!: TemplateRef<any>;
  @ViewChild('equipmentModal') equipmentModal!: TemplateRef<any>;
  @ViewChild('travelTimeModal') travelTimeModal!: TemplateRef<any>;
  @ViewChild('modalMap') modalMapComponent!: MapComponent;
  @ViewChild("mapa") mapa!: MapComponent;

  private modalRef!: NgbModalRef;
  tagsInput: string = '';

  constructor(
    private tourService: TourManagementService,
    private modalService: NgbModal,
    private router: Router, // Inject Router
    private authService: AuthService
  ) {
    this.loadAvailableEquipment();
  }

  selectTour(tour: any): void {
    this.selectedTour = tour;
    this.selectedTourCheckpoints = tour.tourCheckpoints;
    this.getCheckpointsByTourId(tour.id);
    this.getEquipmentByTourId(tour.id);
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
  
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
  
      // Directly store the Blob in the newCheckpoint.image property
      this.newCheckpoint.image = file;
  
      console.log("Selected file as Blob:", file);
    }
  }
  ngOnInit(): void {
    this.loadTours();
    this.authService.user$.subscribe(user => {
      this.userId = user.id;});
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
        status: 0,
        price: undefined,
        lengthInKm: 0, // Podrazumevana vrednost za dužinu ture
        publishedDate: undefined, // Prazan string za datum objave
        archivedDate: undefined,
        equipments: [],
        tourCheckpoints: [],
        travelTimes: [],
        authorId: this.userId
      };
    this.modalRef = this.modalService.open(this.tourModal);
  }

  openCheckpointModal(checkpoint?: CheckpointDTO): void {
    if (checkpoint) {
      // Postavljamo podatke za izmenu postojećeg checkpointa
      this.newCheckpoint = { ...checkpoint };
    } else {
      // Resetujemo podatke za novi checkpoint
      this.newCheckpoint = { id: 0, checkpointName: '', checkpointDescription: '', latitude: undefined, longitude: undefined, image: undefined };
    }

    // Otvaranje modalnog dijaloga
    this.modalRef = this.modalService.open(this.checkpointModal, { size: 'lg' });
  }

  openEquipmentModal(): void {
    this.modalRef = this.modalService.open(this.equipmentModal);
  }
  openTravelTimeModal(): void {
    this.modalRef = this.modalService.open(this.travelTimeModal);
  }

  onMapClick(event: { lat: number, lng: number }) {
    this.newCheckpoint.latitude = event.lat;
    this.newCheckpoint.longitude = event.lng;

    // Postavite jedinstveni marker na mapi unutar modalnog dijaloga
    if (this.modalMapComponent) {
      this.modalMapComponent.setUniqueMarker(event.lat, event.lng);
    }
  }

  closeModal(): void {
    this.modalRef.close();

    // Očisti markere sa modalne mape, ali ne uklanjaj glavnu mapu
    if (this.modalMapComponent && this.modalMapComponent.singleMarker) {
      this.modalMapComponent.clearSingleMarker(); // Očisti jedinstveni marker na modalnoj mapi
    }
  }

  addCheckpoint(): void {
    console.log('NAME:' + this.newCheckpoint.checkpointName);
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
          //kada se izmeni checkpoint treba da izmeni mapu
          if (this.selectedTour.tourCheckpoints.length >= 2) {
            this.getCheckpointsByTourId(this.selectedTour.id);
          }
        },
        (error) => {
          console.error('Greška prilikom ažuriranja checkpointa', error);
        }
      );
    } else {
      // Ako nema ID, onda se radi o dodavanju novog checkpointa

      this.tourService.createCheckpoint(this.newCheckpoint, this.selectedTour.id).subscribe(
        (response) => {
          // Ažuriraj listu checkpointova ture
          this.selectedTourCheckpoints.push(response);
          this.selectedTour.tourCheckpoints.push(response);

          //Ako dodamo drugi checkpoint treba odmah da izracuna duzinu, kao i za svaki naredni
          if (this.selectedTour.tourCheckpoints.length >= 2)
            this.getCheckpointsByTourId(this.selectedTour.id);
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
    this.tour.tags = this.tagsInput.split(',').map(tag => tag.trim());
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

  archiveTour(tourId: number): void {
    if (confirm('Da li ste sigurni da želite da arhivirate ovu turu? ')) {
      this.tourService.archiveTour(tourId).subscribe(
        (response) => {
          this.loadTours();
        },
        (error) => {
          console.error('Greska prilikom arhiviranja ture')
        }
      );
    }
  }

  publishTour(tourId: number): void {
    if (confirm('Da li ste sigurni da želite da aktivirate ovu turu? ')) {
      this.tourService.publishTour(tourId).subscribe({
        next: () => {
          this.loadTours();
          alert('Tour Published succesfully.');
        },
        error: (error) => {
          alert(error.message); // Displays the error message from the backend
        }
      });
    }
  }

  getCheckpointsByTourId(tourId: number): void {
    this.selectedTourCheckpoints = [];
    this.tourService.getCheckpointIdsByTourId(tourId).subscribe(checkpointIds => {
      //Sortiramo rute da se svaki put ucitaju u istom redosledu
      checkpointIds.sort((a, b) => a - b);

      const allCheckpoints = checkpointIds.map(id =>
        this.tourService.getCheckpointById(id)
      );

      //Neophodna linija da bi se navigacija (leaflet onaj sa desne strane)
      //izbrisala ako tura nema nijedan checkpoint

      if (allCheckpoints.length === 0)
        this.mapa.setRoute([]);
      // Cekamo da prvo pribavi sve checkpoint-e
      forkJoin(allCheckpoints).subscribe(checkpoints => {
        this.selectedTourCheckpoints = checkpoints;

        const routePoints = this.selectedTourCheckpoints
          .filter(cp => cp.latitude !== undefined && cp.longitude !== undefined)
          .map(cp => ({
            lat: cp.latitude!,
            lng: cp.longitude!
          }));

        this.mapa.setRoute(routePoints).then((distance) => {
          console.log("Route length in km:", distance);

          // Set the length on the selectedTour object
          this.selectedTour.lengthInKm = Math.floor(distance);
          console.log("Selected Tour length set to:", this.selectedTour.lengthInKm);

          // Now call updateTour after setting the length
          this.tourService.updateTour(this.selectedTour).subscribe(
            response => {
              console.log("Tour updated successfully:", response);
            },
            error => {
              console.error("Error updating tour:", error);
            }
          );
        }).catch((error) => {
          console.error("Error calculating route length:", error);
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
  addTravelTime(): void {
    console.log("ADDTRAVELTIME")
    this.tourService.addNewTravelTime(this.newTravelTime, this.selectedTour.id).subscribe(
      t => this.selectedTour.travelTimes.push(t)
    );
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
    console.log(checkpoint.latitude + " nesto nesto " + checkpoint.longitude);

    // Otvorite modal za uređivanje checkpointa
    this.modalRef = this.modalService.open(this.checkpointModal, { size: 'lg' });
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
