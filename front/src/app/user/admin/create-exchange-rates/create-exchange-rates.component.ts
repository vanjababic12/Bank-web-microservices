import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ExchangeRateListDto, ExchangeRateDto } from 'src/app/Shared/models/exchange-rate.models';
import { ExchangeRatesService } from 'src/app/Shared/services/exchange-rates/exchange-rates.service';

@Component({
  selector: 'app-create-exchange-rates',
  templateUrl: './create-exchange-rates.component.html',
  styleUrls: ['./create-exchange-rates.component.scss']
})

export class CreateExchangeRatesComponent implements OnInit {
  isLoading = false;
  exchangeRates: ExchangeRateListDto = new ExchangeRateListDto(this.currentDateToString(), []);
  newRate: ExchangeRateDto = new ExchangeRateDto('', 0);

  constructor( private exchangeRatesService: ExchangeRatesService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {}

  addRate() {
    if (this.newRate.currency && this.newRate.rate) {
      this.exchangeRates.rates.push(this.newRate);
      this.newRate = new ExchangeRateDto('', 0);
    }
  }

  deleteRate(index: number) {
    this.exchangeRates.rates.splice(index, 1);
  }

  createRates():void {
    if (this.exchangeRates.rates.length === 0) return;

    this.exchangeRatesService.createExchangeRateList(this.exchangeRates).subscribe(
      response => {
        if (response) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New exchange rate list added successfully' });
          this.router.navigateByUrl("/home");
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Bad request' });
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Unknown error' });
      }
    );
  }

  currentDateToString():string {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); 
    const day = ('0' + currentDate.getDate()).slice(-2);

    const isoDateString = `${year}-${month}-${day}`;
    return isoDateString;
  }
}
