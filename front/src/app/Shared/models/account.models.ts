export interface AccountTypeDto {
    name: string;
    description: string;
}

export interface AccountRequestDto {
    loanTypeId: number;
    amount: number;
    numberOfInstallments: number;
}

export interface AccountDto {
    accountTypeId: number;
}