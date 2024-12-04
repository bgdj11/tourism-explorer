import { Component, OnInit } from '@angular/core';
import { TourManagementService } from '../tour-management.service';
import { BundleDTO } from '../model/bundle.model';
import { BundleTourDTO } from '../model/bundleTour.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourDTO } from '../model/tour.model';

@Component({
  selector: 'xp-bundle',
  templateUrl: './bundle.component.html',
  styleUrls: ['./bundle.component.css']
})
export class BundleComponent implements OnInit {
  bundles: BundleDTO[] = [];
  author: number|null = null;
  tours: TourDTO[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  showTourList: { [key: number]: boolean } = {}; 
  selectedTourIds: { [key: number]: boolean } = {}; 

  selectedBundleId: number | null = null;
  editNameMode: boolean = false;
  editPriceMode: boolean = false;
  editedName: string = '';
  editedPrice: number | null = null;


  newBundle: BundleDTO = {
    id: 0,
    name: '',
    customPrice: 0,
    totalToursPriceCalculated: 0,
    status: 0,
    authorId: 0,
    tours: [],
  };

  newBundleTour: BundleTourDTO = {
    id: 0,
    tourId: 0,
    name: '',
    price: 0,
    bundleId: 0,
  };

  selectedTour: TourDTO = {
    id: 0,
    name: '',
    description: '',
    weight: '',
    tags: [],
    status: 0,
    price: 0,
    lengthInKm: 0,
    publishedDate: undefined,
    archivedDate: undefined,
    equipments: [],
    tourCheckpoints: [],
    travelTimes: [],
    dailyAgendas: [],
    authorId: 0,
  }



  constructor(private tourManagementService: TourManagementService,
    private authService: AuthService) {}

  ngOnInit(): void {

    this.authService.user$.subscribe(user => {
      if (user) {
        this.author = user.id;

      }
    });
    this.loadBundles();
    this.loadTours();
  }

  loadBundles(): void {
    this.tourManagementService.getAllBundles().subscribe({
      next: (data) => {
        this.bundles = data;
      },
      error: (err) => {
        console.error('Error fetching bundles', err);
      }
    });
  }

  loadTours(): void {
    this.tourManagementService.getTours(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.tours = data.results;
        console.log(data)
      },
      (error) => {
        console.error('Greška prilikom dohvatanja tura', error);
      }
    );
  }

  toggleTourList(bundleId: number): void {
    this.showTourList[bundleId] = !this.showTourList[bundleId];
    console.log(this.showTourList); // Dodajte log da proverite da li se stanje menja

  }


    create(){
      if(this.author){
        this.newBundle.authorId = this.author;

        this.tourManagementService.createBundle(this.newBundle).subscribe(
          response => {
            console.log('Bundle created successfully', response);
            this.newBundle = {
              id: 0,
              name: '',
              customPrice: 0,
              totalToursPriceCalculated: 0,
              status: 0,
              authorId: 0,
              tours: [],
            };
          },
          error => {
            console.error('Error creating bundle: ', error);
          }

        )
      }
    }

    addSelectedTours(bundleId: number): void {
      const selectedTours = this.tours.filter((tour) => this.selectedTourIds[tour.id]);
  
      const bundleTours: BundleTourDTO[] = selectedTours.map((tour) => ({
        tourId: tour.id,
        name: tour.name,
        price: tour.price || 0,
        bundleId: bundleId,
      }));
  
      // Poziv servisa za svaki selektovani tour
      bundleTours.forEach((bundleTour) => {
        this.tourManagementService.addTourToBundle(bundleId, bundleTour).subscribe({
          next: () => {
            console.log(`Tour ${bundleTour.name} added to bundle.`);
          },
          error: (err) => {
            console.error(`Error adding tour ${bundleTour.name} to bundle:`, err);
          }
        });
      });
  
      // Resetujemo selekciju
      this.selectedTourIds = {};
      //this.showTourList = false; // Zatvaranje liste
      this.loadBundles(); // Osvježavanje liste bundle-ova
    }

    confirmAndRemoveTour(tourId: number, bundleId: number): void {
      const confirmation = confirm('Are you sure you want to delete this tour?');
      if (confirmation) {
        this.removeTour(tourId, bundleId);
      }
    }
    
    removeTour(tourId: number, bundleId: number): void {
      this.tourManagementService.deleteTourFromBundle(tourId).subscribe({
        next: () => {
          console.log(`Tour with ID ${tourId} removed successfully.`);
          
        },
        error: (err) => {
          console.error(`Error removing tour with ID ${tourId}:`, err);
        }
      });
    }
    

    publishBundle(bundleId: number): void {
      const confirmPublish = window.confirm("Are you sure you want to publish this bundle?");
      if (!confirmPublish) {
        return; // Ako korisnik klikne "Cancel", prekini funkciju.
      }
    
      this.tourManagementService.publishBundle(bundleId).subscribe({
        next: (response) => {
          console.log(response.message); // Poruka iz backend-a
          this.loadBundles(); // Osvježavanje liste bundle-ova
          alert("The bundle has been successfully published.");
        },
        error: (err) => {
          console.error(`Error publishing bundle with ID ${bundleId}:`, err);
          if (err.error && err.error.message) {
            alert(err.error.message); // Prikaz poruke o grešci iz backend-a
          } else {
            alert("An error occurred while publishing the bundle.");
          }
        }
      });
    }
    
    archiveBundle(bundleId: number): void {
      const confirmArchive = window.confirm("Are you sure you want to archive this bundle?");
      if (!confirmArchive) {
        return; // Ako korisnik klikne "Cancel", prekini funkciju.
      }

      this.tourManagementService.archiveBundle(bundleId).subscribe({
        next: (response) => {
          console.log(response.message); // Poruka iz backend-a
          this.loadBundles(); // Osvježavanje liste bundle-ova
        },
        error: (err) => {
          console.error(`Error archiving bundle with ID ${bundleId}:`, err);
        }
      });
    }
    
    getStatusText(status: number): string {
      switch (status) {
        case 0:
          return "DRAFT";
        case 1:
          return "PUBLISHED";
        case 2:
          return "ARCHIVED";
        default:
          return "Unknown";
      }
    }

    
    // Otvoriti polje za editovanje imena
  editName(bundleId: number): void {
    this.selectedBundleId = bundleId;
    const bundle = this.bundles.find(b => b.id === bundleId);
    if (bundle) {
      this.editedName = bundle.name;
      this.editNameMode = true;
    }
  }

  // Otvoriti polje za editovanje cene
  editPrice(bundleId: number): void {
    this.selectedBundleId = bundleId;
    const bundle = this.bundles.find(b => b.id === bundleId);
    if (bundle) {
      this.editedPrice = bundle.customPrice;
      this.editPriceMode = true;
    }
  }

// Spremiti izmenjeno ime
saveName(bundleId: number): void {
  const bundle = this.bundles.find(b => b.id === bundleId);
  
  if (!bundle) {
    console.error('Bundle not found');
    return; // Ako bundle nije pronađen, ne šaljite zahtev
  }

  const updatedBundle: BundleDTO = {
    ...bundle, // Kopirajte sve postojeće vrednosti iz bundle-a
    name: this.editedName, // Ažurirajte samo name
  };

  this.tourManagementService.updateBundle(updatedBundle).subscribe({
    next: () => {
      console.log('Bundle name updated');
      this.loadBundles();  // Ponovo učitajte sve bundle-ove
      this.cancelEdit();    // Poništite režim editovanja
    },
    error: (err) => {
      console.error('Error updating bundle name', err);
    }
  });
}

  savePrice(bundleId: number): void {
    const bundle = this.bundles.find(b => b.id === bundleId);

    if (!bundle) {
      console.error('Bundle not found');
      return; // Ako bundle nije pronađen, ne šaljite zahtev
    }

    const updatedBundle: BundleDTO = {
      ...bundle, // Kopirajte sve postojeće vrednosti iz bundle-a
      customPrice: this.editedPrice !== null ? this.editedPrice : 0, // Ako je null, postavi na 0
    };

    this.tourManagementService.updateBundle(updatedBundle).subscribe({
      next: () => {
        console.log('Bundle price updated');
        this.loadBundles();  // Ponovo učitajte sve bundle-ove
        this.cancelEdit();    // Poništite režim editovanja
      },
      error: (err) => {
        console.error('Error updating bundle price', err);
      }
    });
  }


  // Cancel editovanje
  cancelEdit(): void {
    this.editNameMode = false;
    this.editPriceMode = false;
    this.selectedBundleId = null;
  }

  // Funkcija za brisanje bundle-a
deleteBundle(bundleId: number): void {
  const confirmDelete = window.confirm("Are you sure you want to delete this bundle?");
  if (!confirmDelete) {
    return; // Ako korisnik klikne "Cancel", prekinite funkciju.
  }

  this.tourManagementService.deleteBundle(bundleId).subscribe({
    next: () => {
      console.log('Bundle deleted successfully');
      this.loadBundles(); // Osvježavanje liste bundle-ova
    },
    error: (err) => {
      console.error('Error deleting bundle', err);
    }
  });
}


    
      

    
}

