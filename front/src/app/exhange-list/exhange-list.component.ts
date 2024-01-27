import { Component, OnInit } from '@angular/core';
import { ExchangeRatesService } from '../Shared/services/exchange-rates/exchange-rates.service';
import { MessageService } from 'primeng/api';
import { ExchangeRate, ExchangeRateDisplays } from '../Shared/models/exchange-rate-response.models';

@Component({
  selector: 'app-exhange-list',
  templateUrl: './exhange-list.component.html',
  styleUrls: ['./exhange-list.component.scss']
})

export class ExhangeListComponent implements OnInit {
  displayExchangeRates:ExchangeRateDisplays[] = [];
  currentDate:string;

  constructor(private exchangeRatesService: ExchangeRatesService, private messageService: MessageService) {
    this.currentDate = this.currentDateToString();
   }

  ngOnInit(): void {
    this.getExchangeRates();
  }

  getExchangeRates(): void {
    this.exchangeRatesService.getLatestExchangeRates().subscribe(
      (data:ExchangeRate[]) => {
        this.displayExchangeRates = data.map((exhangeRate, index) => {

          return {
            id: index,
            currency: exhangeRate.currency,
            rate: exhangeRate.rate,
          };
        });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Can't get current exchange rates. Please try again later.` });
      }
    );
  }

  currentDateToString():string {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); 
    const day = ('0' + currentDate.getDate()).slice(-2);

    const isoDateString = `${day}-${month}-${year}`;
    return isoDateString;
  }

  refresh = ():void => this.getExchangeRates();
}
