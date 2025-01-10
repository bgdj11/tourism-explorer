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
import { DailyAgendaDTO } from '../model/DailyAgendaDTO.model';
import { EncounterDTO } from 'src/app/shared/model/encounter';
import { Encounter } from '../../administration/model/encounter.model';
import { Tour } from '../../tour-execution/model/review.model';
import { AccomodationDTO } from '../model/accomodation.model';
import { AdministrationService } from '../../administration/administration.service';

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
  selectedTourDailyAgendas: DailyAgendaDTO[] = [];
  encounters: Encounter[] = []; 
  allAccomodations: AccomodationDTO[] = [];
  selectedAccomodations: AccomodationDTO[] = [];
  selectedImages: string[] = [];
  selectedTour: any = null;
  lengthInKm: number;
  totalCount: number = 0;
  totalEquipmentCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  modalTitle: string = '';
  userId: number =0;
  newBetweenDestination: string = '';
  encounterStatuses = ['DRAFT', 'ACTIVE', 'ARCHIVED'];
  encounterTypes = ['SOCIAL', 'LOCATION', 'MISC'];
  selectedCheckpoint: CheckpointDTO | null = null;
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
  newDailyAgenda: DailyAgendaDTO = {
    day: 0,
    startDestination: '',
    betweenDestinations: [] as string[],
    endDestination: '',
    description: ''
  }
  newEncounter: EncounterDTO = {
    id: 0,
    name: '',
    description: '',
    location: { latitude: 0, longitude: 0 },
    xp: 0,
    status: 'DRAFT',
    type: 'SOCIAL',
    authorId: 0,
    usersWhoCompletedId: [],
    isRequired: false
  };

  @Output() waypointsChanged = new EventEmitter<{ lat: number, lng: number }[]>();

  @ViewChild('tourModal') tourModal!: TemplateRef<any>;
  @ViewChild('checkpointModal') checkpointModal!: TemplateRef<any>;
  @ViewChild('equipmentModal') equipmentModal!: TemplateRef<any>;
  @ViewChild('travelTimeModal') travelTimeModal!: TemplateRef<any>;
  @ViewChild('dailyAgendaModal') dailyAgendaModal!: TemplateRef<any>;
  @ViewChild('modalMap') modalMapComponent!: MapComponent;
  @ViewChild("mapa") mapa!: MapComponent;
  @ViewChild('encounterModal') encounterModal!: TemplateRef<any>;
  @ViewChild('accomodationModal') accomodationModal!: TemplateRef<any>;
  @ViewChild('photoModal') photoModal!: TemplateRef<any>;

  private modalRef!: NgbModalRef;
  private photosModalRef!: NgbModalRef;
  tagsInput: string = '';

  constructor(
    private tourService: TourManagementService,
    private modalService: NgbModal,
    private router: Router, // Inject Router
    private authService: AuthService,
    private adminService: AdministrationService
  ) {
    this.loadAvailableEquipment();
    //this.loadEncounters();
  }
  
  addBetweenDestination() {
    if (this.newBetweenDestination.trim()) {
      this.newDailyAgenda.betweenDestinations.push(this.newBetweenDestination);
      this.newBetweenDestination = ''; // Clear the input
    }
  }

  // Method to remove a destination from the list
  removeBetweenDestination(index: number) {
    this.newDailyAgenda.betweenDestinations.splice(index, 1);
  }
  selectTour(tour: any): void {
    this.selectedTour = tour;
    this.mapa.showAccomodation(this.selectedTour.accomodations)
    console.log("Selected tour status: ",this.selectedTour)
    this.selectedTourCheckpoints = tour.tourCheckpoints;
    this.getEquipmentByTourId(tour.id);
    this.loadEncounters();
    
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
  
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
  
      // Create a FileReader to read the file as base64
      const reader = new FileReader();
  
      reader.onloadend = () => {
        // The result is the base64 string representation of the file
        const base64Image = reader.result as string;
  
        // Store the base64 string in the newCheckpoint.image property
        this.newCheckpoint.image = base64Image;
  
        console.log("Selected file as base64:", base64Image);
      };
  
      // Read the file as base64 (this gives us the base64-encoded string)
      reader.readAsDataURL(file);
    }
  }
  
  
  ngOnInit(): void {
    this.loadTours();
    this.loadAccomodations();
    this.authService.user$.subscribe(user => {
      this.userId = user.id;});
      
  }

  loadAccomodations(): void {
    this.adminService.getAllAccomodations(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.allAccomodations = data.results
        console.log(this.allAccomodations)
      }
    )
  }

  loadTours(): void {
    this.tourService.getTours(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.tours = data.results;
        console.log(data)
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
  openDailyAgendaModal(): void {
    this.modalRef = this.modalService.open(this.dailyAgendaModal);
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
  addDailyAgenda(): void {
    
    this.tourService.addNewDailyAgenda(this.newDailyAgenda, this.selectedTour.id).subscribe(
      t => this.selectedTour.dailyAgendas.push(t)
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

  openEncounterModal(): void {
    this.newEncounter = {
      id: 0,
      name: '',
      description: '',
      location: { latitude: 0, longitude: 0 },
      xp: 0,
      status: 'DRAFT',
      type: 'SOCIAL',
      authorId: this.userId,
      usersWhoCompletedId: [],
      isRequired: false
    };
  
    this.modalRef = this.modalService.open(this.encounterModal, { size: 'lg' });
  }
  openAccomodationModal(): void {
    this.modalRef = this.modalService.open(this.accomodationModal, { size: 'lg' });
  }
  openPhotoModal(images: string[]): void {
    this.photosModalRef = this.modalService.open(this.photoModal, { size: 'lg' });
    this.selectedImages = images;
    const photoModal = document.querySelector('#photoModal');
    if (photoModal) {
      photoModal.classList.add('show');
    }
  }

  // Method to close the photo modal
  closePhotoModal(): void {
    this.photosModalRef.close();
  }
  createEncounter(): void {
    if (!this.newEncounter.name || !this.newEncounter.description) {
      console.error('Ime i opis su obavezni!');
      return;
    }
  
    if (!this.selectedCheckpoint) {
      console.error('Checkpoint nije odabran!');
      return;
    }
  
    console.log('Podaci za Encounter:', this.newEncounter);
    // Kreiraj novi Encounter pozivom servisa
    this.tourService.createEncounter(this.newEncounter).subscribe(
      (response) => {
        console.log('Encounter uspešno kreiran:', response);
        this.loadEncounters();
        this.closeModal(); // Zatvori modal
      },
      (error) => {
        if (error.status) {
          console.error(`HTTP Status Code: ${error.status}`);
        }
        if (error.error) {
          console.error('Detalji greške sa servera:', error.error);
        } else {
          console.error('Greška prilikom kreiranja Encounter-a:', error);
        }
      }
    );
  }
  
  onCheckpointChange(): void {
    if (!this.selectedCheckpoint) {
      console.error('Checkpoint ID nije odabran!');
      return;
    }
  
    const selectedCheckpoint = this.selectedTourCheckpoints.find(cp => cp.id === this.selectedCheckpoint?.id);
  
    console.log('ID = ', this.selectedCheckpoint);
    if (selectedCheckpoint) {
      // Postavi latitude i longitude iz odabranog checkpoint-a
      this.newEncounter.location.latitude = selectedCheckpoint.latitude!;
      this.newEncounter.location.longitude = selectedCheckpoint.longitude!;
      console.log('Checkpoint pronađen i lokacija je postavljena:', selectedCheckpoint);
    } else {
      console.error('Checkpoint sa datim ID-om nije pronađen!');
    }
  }
  
  loadEncounters(): void {
    console.log("OVDE SE POZIVA");
    console.log("ID ture ", this.selectedTour);
    this.selectedCheckpoint = this.selectedTour.tourCheckpoints;
    console.log("Broj checkpointa: ", this.selectedCheckpoint);
    this.tourService.getEncounters(1, 11).subscribe((response) => {
      // Pripremamo validne lokacije iz checkpointa
      const selectedLocations = this.selectedTourCheckpoints
        .filter(checkpoint => checkpoint.latitude !== undefined && checkpoint.longitude !== undefined)
        .map(checkpoint => ({
          latitude: checkpoint.latitude!,
          longitude: checkpoint.longitude!
        }));
  
      // Filtriramo encountere
      this.encounters = response.results.filter(encounter =>
        encounter.location && // Proveravamo da li encounter ima validnu lokaciju
        selectedLocations.some(location =>
          this.areLocationsEqual(location, encounter.location)
        )
      );
  
      console.log("FILTRIRANI ENCOUNTERI: ", this.encounters);
    });
  }
  
  // Method to check if an accommodation is already selected
  isSelected(accomodation: any): boolean {
    console.log("Selected acc: ", this.selectedTour.accomodations.includes(accomodation));
    return this.selectedTour.accomodations.some((a: { id: any }) => a.id === accomodation.id);
  }

  // Method to toggle selection of an accommodation
  toggleSelection(accomodation: any, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedAccomodations.push(accomodation);
      
    } else {
      this.selectedAccomodations = this.selectedAccomodations.filter(
        (selected) => selected !== accomodation
      );
      
    }
  }

  // Placeholder for adding selected accommodations
  addSelectedAccomodation(): void {
    
    this.tourService.addAccomodations(this.selectedTour.id,this.selectedAccomodations).subscribe(() => {
      this.selectedAccomodations.forEach(accomodation => {
        this.selectedTour.accomodations.push(accomodation);
      });
      this.selectedAccomodations = []
      console.log("Selected ACC: ", this.selectedAccomodations)
    }
      
    )
  }
  removeAccomodation(accomodation: any): void {
    // Filter out the removed accommodation
      
    this.tourService.removeAccomodation(this.selectedTour.id, accomodation).subscribe(() => {
      
      this.selectedTour.accomodations = this.selectedTour.accomodations.filter(
        (selected: AccomodationDTO) => selected.id !== accomodation.id
      )
      console.log("Selected TOUR: ", this.selectedTour)
   
}   
    );
    
  }
  
  areLocationsEqual(
    loc1: { latitude: number | undefined; longitude: number | undefined },
    loc2: { latitude: number | undefined; longitude: number | undefined }
  ): boolean {
    if (!loc1.latitude || !loc1.longitude || !loc2.latitude || !loc2.longitude) {
      return false; // Ako neka od vrednosti nije definisana, lokacije nisu jednake
    }
  
    const precision = 1e-6; // Preciznost za poređenje koordinata
    return (
      Math.abs(loc1.latitude - loc2.latitude) < precision &&
      Math.abs(loc1.longitude - loc2.longitude) < precision
    );
  }
  
  
  
  
  
  protected readonly faTrash = faTrash;
  protected readonly faPencil = faPencil;
  protected readonly faPlus = faPlus;
}
