export interface CreateAccountTypeDto {
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

export interface AccountTypeDto {
    id: number;
    name: string;
    description: string;
    currency: string;
    isDeleted: boolean;
}
