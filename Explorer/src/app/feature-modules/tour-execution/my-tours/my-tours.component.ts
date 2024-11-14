import { Component, OnInit } from '@angular/core';
import { TourDTO } from '../model/tour-model';
import { TourExecutionService } from '../tour.execution.service';

@Component({
  selector: 'xp-my-tours',
  templateUrl: './my-tours.component.html',
  styleUrls: ['./my-tours.component.css']
})
export class MyToursComponent implements OnInit {

  // Sadržaj kupljenih tura
  purchasedTours: TourDTO[] = [];

  constructor(private tourExecutionService: TourExecutionService) { }

  ngOnInit(): void {
    // Učitavanje kupljenih tura kada komponenta bude inicijalizovana
    this.loadPurchasedTours();
  }

  // Metoda za učitavanje kupljenih tura
  loadPurchasedTours(): void {
    const touristId = 1; // Ovaj ID bi trebalo da preuzimate iz autentifikacije/tokensa
    this.tourExecutionService.getPurchasedTours(touristId).subscribe(
      (tours) => {
        this.purchasedTours = tours;
      },
      (error) => {
        console.error('Error fetching purchased tours', error);
      }
    );
  }
}
