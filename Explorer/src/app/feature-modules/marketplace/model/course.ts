export interface ExchangeRateDTO {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  date: string;
}
