export interface CreateAccountTypeDto {
    name: string;
    description: string;
    currency: string;
}


export interface AccountRequestDto {
    accountTypeId: number;
}

export class AccountDto {
    id: number;
    accountTypeId: number;
    customerUsername: string;
    currency: string;
    isClosed: boolean;
    accountType: AccountTypeDto;
    balance: number;

    constructor(id: number, accountTypeId: number, customerUsername: string, currency: string, isClosed: boolean, accountType: AccountTypeDto, balance: number) {
        this.id = id;
        this.accountTypeId = accountTypeId;
        this.customerUsername = customerUsername;
        this.currency = currency;
        this.isClosed = isClosed;
        this.accountType = accountType;
        this.balance = balance;
    }
}

export interface AccountTypeDto {
    id: number;
    name: string;
    description: string;
    currency: string;
    isDeleted: boolean;
}

export class ExchangeTransferDto {
    accountFromId: number;
    accountToId: number;
    amount: number;

    constructor(accountFromId: number, accountToId: number, amount: number) {
        this.accountFromId = accountFromId;
        this.accountToId = accountToId;
        this.amount = amount;
    }
}

