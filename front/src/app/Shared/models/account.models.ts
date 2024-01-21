export interface AccountTypeDto {
    name: string;
}

export interface AccountRequestDto {
    loanTypeId: number;
    amount: number;
    numberOfInstallments: number;
}

export interface AccountDto {
    accountTypeId: number;
}