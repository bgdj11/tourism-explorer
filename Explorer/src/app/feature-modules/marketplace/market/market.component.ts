import { Component, OnInit } from '@angular/core';
import {TourDTO} from "../../tour-authoring/model/tour.model";
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourProblem } from "../model/tour-problem";
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ShoppingCartDTO, ShoppingCartItemDTO } from '../model/shopping-cart';

@Component({
  selector: 'xp-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
  tours: TourDTO[] = [];
  checkpointNames: { [tourId: number]: string } = {};
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  reportFormVisible: { [tourId: number]: boolean } = {};
  reportData: { [tourId: number]: TourProblem } = {};
  userId: number = 0;
  reportSubmitted: { [tourId: number]: boolean } = {};

  constructor(private service: MarketplaceService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.userId = user.id;  // <-- Get logged-in user ID from AuthService
      this.loadTours();
    });
  }

  loadTours(): void {
    this.service.getTours(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.tours = data.results.filter(tour => tour.status === 1);
        this.totalCount = data.totalCount;

        // Load checkpoint names for each tour
        this.tours.forEach(tour => {
          this.reportFormVisible[tour.id] = false;
          this.reportData[tour.id] = {
            touristId: 0, // This will be replaced with the logged-in user's ID
            tourId: tour.id,
            authorId: 0, // Set appropriately later
            category: '',
            priority: '',
            description: '',
            reportedAt: new Date(),
            resolved: false,
            problemComments: []
          };

          this.service.getCheckpointIdsByTourId(tour.id).subscribe(
            (checkpointIds) => {
              if (checkpointIds.length > 0) {
                this.service.getCheckpointById(checkpointIds[0]).subscribe(
                  (checkpoint) => {
                    this.checkpointNames[tour.id] = checkpoint.checkpointName as string;
                  },
                  (error) => console.error(`Error fetching checkpoint:`, error)
                );
              } else {
                this.checkpointNames[tour.id] = 'Nema CheckPoint';
              }
            },
            (error) => console.error(`Error fetching checkpoint IDs:`, error)
          );
        });

      },
      (error) => {
        console.error('Greška prilikom dohvatanja tura', error);
      }
    );
  }

  toggleReportForm(tourId: number): void {
    this.reportFormVisible[tourId] = !this.reportFormVisible[tourId];
  }

  submitReport(tourId: number): void {
    const loggedInTouristId = this.userId;
    const reportData = this.reportData[tourId];
    
    this.service.getTour(tourId).subscribe(
      (tour) => {
        const problem: TourProblem = {
          touristId: loggedInTouristId,
          tourId: tourId,
          authorId: tour.authorId, // Use authorId from the fetched tour
          category: reportData.category,
          priority: reportData.priority,
          description: reportData.description,
          reportedAt: new Date(),
          resolved: false,
          problemComments: []
        };
  
        // Submit the problem report
        this.service.addProblem(problem).subscribe(
          (response) => {
            console.log('Problem reported successfully:', response);
            // Optionally clear the form or give feedback to the user
            this.reportSubmitted[tourId] = true;
          },
          (error) => {
            console.error('Error reporting problem:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching tour data:', error);
      }
    );
  }

  addTourToCart(tour: TourDTO): void {
  
    const touristId = this.userId;  // Koristimo ID iz ulogovanog korisnika
  
    // Kreiramo objekat za stavku korpe
    const shoppingCartItem: ShoppingCartItemDTO = {
      tourId: tour.id,
      tourName: tour.name,
      tourPrice: tour.price ?? 0  
    };
  
    // Pozivamo servis za dodavanje ture u korpu
    this.service.addTourToCart(touristId, shoppingCartItem).subscribe({
      next: () => {
        alert('Tour added to cart successfully!');
      },
      error: (error) => {
        // Ovde ispisujemo detalje greške ako dođe do nje
        if (error.status && error.message) {
          alert(`Error adding tour to cart. Status: ${error.status}, Message: ${error.message}`);
        } else {
          alert('Error adding tour to cart');
        }
      }
    });
    }

  onCategoryChange(event: Event, tourId: number): void {
    const value = (event.target as HTMLSelectElement).value;
    this.reportData[tourId].category = value;
  }
  
  onPriorityChange(event: Event, tourId: number): void {
    const value = (event.target as HTMLSelectElement).value;
    this.reportData[tourId].priority = value;
  }
  
  onDescriptionChange(event: Event, tourId: number): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.reportData[tourId].description = value;
  }

}