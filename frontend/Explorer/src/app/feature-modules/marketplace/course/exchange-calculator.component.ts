import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { ExchangeRateDTO } from '../model/course';

@Component({
  selector: 'app-exchange-calculator',
  templateUrl: './exchange-calculator.component.html',
  styleUrls: ['./exchange-calculator.component.css']
})
export class ExchangeCalculatorComponent implements OnInit {

  currencies: { [key: string]: string } = {};
  fromCurrency: string = 'USD';
  toCurrency: string = 'EUR';
  amount: number = 1;
  result?: ExchangeRateDTO;
  loading: boolean = false;
  error: string = '';

  constructor(private marketplaceService: MarketplaceService) { }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies() {
    this.marketplaceService.getAllCurrencies().subscribe({
      next: (data) => {
        this.currencies = data;
      },
      error: (err) => {
        this.error = 'Greška pri učitavanju valuta.';
        console.error(err);
      }
    });
  }

  convert() {
    if (!this.amount || this.amount <= 0) {
      this.error = 'Unesite validan iznos.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.result = undefined;

    this.marketplaceService.convertCurrency(this.amount, this.fromCurrency, this.toCurrency).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Greška pri konverziji.';
        console.error(err);
        this.loading = false;
      }
    });
  }

}
