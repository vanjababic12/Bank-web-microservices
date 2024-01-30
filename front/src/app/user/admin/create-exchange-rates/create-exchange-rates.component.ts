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
  constructor(private exchangeRatesService: ExchangeRatesService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void { }


  // Getter
  get currencyInput(): string {
    console.log("read" + this.newRate.currency);
    return this.newRate.currency;
  }

  // Setter
  set currencyInput(value: string) {
    const onlyLetters = value.replace(/[^a-zA-Z]/g, ''); // Remove non-letter characters
    console.log(onlyLetters);
    this.newRate.currency = onlyLetters.toUpperCase();
  }

  addRate() {
    if (this.newRate.currency && this.newRate.rate) {
      if (this.exchangeRates.rates.find(i => i.currency == this.newRate.currency) != null) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Currency with same name already exists' });
        return;
      }
      this.exchangeRates.rates.push(this.newRate);
      this.newRate = new ExchangeRateDto('', 0);
    }
  }

  deleteRate(index: number) {
    this.exchangeRates.rates.splice(index, 1);
  }

  createRates(): void {
    if (this.exchangeRates.rates.length === 0) return;

    this.exchangeRatesService.createExchangeRateList(this.exchangeRates).subscribe(
      response => {
        if (response) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New exchange rate list added successfully' });
          this.router.navigateByUrl("/exchange-list");
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Bad request' });
        }
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message || 'Unknown error' });
      }
    );
  }

  currentDateToString(): string {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    const isoDateString = `${year}-${month}-${day}`;
    return isoDateString;
  }
}
