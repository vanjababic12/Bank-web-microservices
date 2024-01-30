import { Component, OnInit } from '@angular/core';
import { ExchangeRatesService } from '../Shared/services/exchange-rates/exchange-rates.service';
import { MessageService } from 'primeng/api';
import { ExchangeRate, ExchangeRateDisplays } from '../Shared/models/exchange-rate-response.models';
import { AccountDto } from '../Shared/models/account.models';
import { BackAccountService } from '../Shared/services/bankaccount/back-account.service';
import { roleGetter } from '../app.module';

@Component({
  selector: 'app-exhange-list',
  templateUrl: './exhange-list.component.html',
  styleUrls: ['./exhange-list.component.scss']
})

export class ExhangeListComponent implements OnInit {
  exchangeRates: ExchangeRateDisplays[] = [];
  displayedExchangeRates: ExchangeRateDisplays[] = [];
  currentDate: string;
  accounts: AccountDto[];
  selectedSourceAccount: AccountDto;
  selectedDestinationAccount: AccountDto;
  amount: number;
  role = roleGetter();


  rowsPerPage = 9;
  totalRecords = 0;
  currentPage = 1;

  constructor(private accountService: BackAccountService, private exchangeRatesService: ExchangeRatesService, private messageService: MessageService) {
    this.currentDate = this.currentDateToString();
  }

  ngOnInit(): void {
    this.getExchangeRates();
    this.fetchAccounts();
  }

  fetchAccounts(): void {
    this.accountService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
  }
  updateDisplayedExhangeRates(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.displayedExchangeRates = this.exchangeRates.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG paginator počinje od 0
    this.rowsPerPage = event.rows;
    this.updateDisplayedExhangeRates();
  }

  getExchangeRates(): void {
    this.exchangeRatesService.getLatestExchangeRates().subscribe(
      (data: ExchangeRate[]) => {
        this.exchangeRates = data.map((exhangeRate, index) => {

          return {
            id: index,
            currency: exhangeRate.currency,
            rate: exhangeRate.rate,
          };
        });

        this.totalRecords = this.exchangeRates.length;
        this.updateDisplayedExhangeRates();
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Can't get current exchange rates. Please try again later.` });
      }
    );
  }

  currentDateToString(): string {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    const isoDateString = `${day}.${month}.${year}.`;
    return isoDateString;
  }

  refresh = (): void => this.getExchangeRates();
}
