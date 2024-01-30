import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { AccountDto, ExchangeTransferDto } from 'src/app/Shared/models/account.models';
import { ExchangeRate } from 'src/app/Shared/models/exchange-rate-response.models';
import { ExchangeRateDto } from 'src/app/Shared/models/exchange-rate.models';
import { BackAccountService } from 'src/app/Shared/services/bankaccount/back-account.service';
import { ExchangeRatesService } from 'src/app/Shared/services/exchange-rates/exchange-rates.service';

@Component({
  selector: 'app-exchange-transfer',
  templateUrl: './exchange-transfer.component.html',
  styleUrls: ['./exchange-transfer.component.scss']
})
export class ExchangeTransferComponent implements OnInit {
  exchangeRates: ExchangeRate[] = [];
  currentDate: string;
  accounts: SelectItem<AccountDto>[];
  // selectedSourceAccount: AccountDto;
  // selectedDestinationAccount: AccountDto;
  // amount: number;
  transferForm: FormGroup = new FormGroup({
    // username: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    sourceAccount: new FormControl(null, [Validators.required]),
    destinationAccount: new FormControl(null, [Validators.required]),
    amount: new FormControl(1, [Validators.required, Validators.min(0.001)]),
  });

  sourceAccountBalance: number = 0;
  destinationAccountBalance: number = 0;
  newSourceAccountBalance: number = 0;
  newDestinationAccountBalance: number = 0;

  allAccountsZeroBalance: boolean = false;

  get sourceAccounts(): SelectItem<AccountDto>[] {
    return this.accounts.filter(account => account.value.balance > 0);
  }

  get destinationAccounts(): SelectItem<AccountDto>[] {
    const selectedSourceAccountId = this.transferForm.get('sourceAccount').value?.value.id;
    // console.log(selectedSourceAccountId);
    return this.accounts.filter(account => account.value.id != selectedSourceAccountId);
  }


  rowsPerPage = 9;
  totalRecords = 0;
  currentPage = 1;

  constructor(private accountService: BackAccountService, private exchangeRatesService: ExchangeRatesService,
    private confirmationService: ConfirmationService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getExchangeRates();
    this.fetchAccounts();
    // Listen for changes and update balances
    this.transferForm.get('sourceAccount').valueChanges.subscribe(value => {
      console.log(this.transferForm.get('sourceAccount').value?.value?.balance);
      this.updateAmountValidator();
      this.updateBalances();
    });

    this.transferForm.get('destinationAccount').valueChanges.subscribe(value => {
      this.updateBalances();
    });

    this.transferForm.get('amount').valueChanges.subscribe(value => {
      this.checkAmountAgainstBalance();
      this.updateBalances();
    });
  }

  updateBalances(): void {
    const sourceAccount = this.transferForm.get('sourceAccount').value?.value;
    const destinationAccount = this.transferForm.get('destinationAccount').value?.value;
    const amount = this.transferForm.get('amount').value;

    if (sourceAccount) {
      this.sourceAccountBalance = sourceAccount.balance;
      this.newSourceAccountBalance = this.sourceAccountBalance - amount;
    }

    if (destinationAccount) {
      this.destinationAccountBalance = destinationAccount.balance;

      // If currencies are different, apply exchange rate
      let transferredAmount = amount;
      if (sourceAccount && sourceAccount.currency !== destinationAccount.currency) {
        const fromExchangeRate = this.exchangeRates.find(rate => rate.currency === sourceAccount.currency)?.rate;
        const toExchangeRate = this.exchangeRates.find(rate => rate.currency === destinationAccount.currency)?.rate;
        if (fromExchangeRate && toExchangeRate) {
          var rate = fromExchangeRate / toExchangeRate;
          transferredAmount *= rate;
        }
      }

      this.newDestinationAccountBalance = this.destinationAccountBalance + transferredAmount;
    }
  }

  fetchAccounts(): void {
    this.accountService.getAccounts().subscribe(data => {
      this.accounts = data.filter(i => !i.isClosed).map(
        i => {
          var label = this.formatAccountLabel(i);
          return {
            label: label,
            value: i
          };
        }
      );

      // Check if all accounts have zero balance
      this.checkAllAccountsZeroBalance();
    });
  }

  updateAmountValidator(): void {
    const sourceAccount = this.transferForm.get('sourceAccount').value?.value;
    if (sourceAccount) {
      const maxAmount = sourceAccount.balance;
      this.transferForm.get('amount').setValidators([
        Validators.required,
        Validators.min(0.001),
        Validators.max(maxAmount)
      ]);
      this.transferForm.get('amount').updateValueAndValidity();
      // console.log(this.transferForm.get('amount').value);
    }
  }

  checkAmountAgainstBalance(): void {
    const amountControl = this.transferForm.get('amount');
    const sourceAccount = this.transferForm.get('sourceAccount').value?.value;
    if (sourceAccount && amountControl.value > sourceAccount.balance) {
      amountControl.setValue(sourceAccount.balance);
    }
    if (sourceAccount && amountControl.value < 0) {
      amountControl.setValue(1);
    }

  }

  checkAllAccountsZeroBalance(): void {
    console.log(this.accounts.map(i => i.value.balance === 0));
    this.allAccountsZeroBalance = this.accounts.every(account => account.value.balance == 0);
  }

  formatAccountLabel(account: AccountDto): string {
    return `${account.id} - ${account.accountType.name} - ${account.currency}`;
  }

  getExchangeRates(): void {
    this.exchangeRatesService.getLatestExchangeRates().subscribe(data => {
      this.exchangeRates = data;
    });
  }

  onSubmit(): void {
    if (this.transferForm.invalid) {
      // Handle invalid form
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to perform this transfer?',
      accept: () => {
        // Perform the transfer
        const exchangeTransferDto = new ExchangeTransferDto(
          this.transferForm.get('sourceAccount').value?.value.id,
          this.transferForm.get('destinationAccount').value?.value.id,
          this.transferForm.get('amount').value
        );

        console.log(exchangeTransferDto);
        this.accountService.exchangeTransfer(exchangeTransferDto).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Transfer completed successfully' });
            // Additional success handling
            this.transferForm.reset();
            this.sourceAccountBalance = -1;
            this.newSourceAccountBalance = -1;
            this.getExchangeRates();
            this.fetchAccounts();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Transfer failed' });
            // Additional error handling
          }
        });
      }
    });

  }
}
