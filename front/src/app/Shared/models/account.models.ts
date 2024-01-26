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

    constructor(id: number, accountTypeId: number, customerUsername: string, currency: string, isClosed: boolean, accountType: AccountTypeDto) {
        this.id = id;
        this.accountTypeId = accountTypeId;
        this.customerUsername = customerUsername;
        this.currency = currency;
        this.isClosed = isClosed;
        this.accountType = accountType;
    }
}

export interface AccountTypeDto {
    id: number;
    name: string;
    description: string;
    currency: string;
    isDeleted: boolean;
}
