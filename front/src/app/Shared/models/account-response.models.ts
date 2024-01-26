export interface AccountTypeResponse {
    id: number;
    name: string;
}

export class AccountRequestDto {
    id: number;
    customerUsername: string;
    accountTypeId: number;
    isReviewed: boolean;
    isApproved: boolean;

    constructor(id: number, customerUsername: string, accountTypeId: number, isReviewed: boolean, isApproved: boolean) {
        this.id = id;
        this.customerUsername = customerUsername;
        this.accountTypeId = accountTypeId;
        this.isReviewed = isReviewed;
        this.isApproved = isApproved;
    }
}

export interface CreateAccountRequestDto {
    accountTypeId: number;
}

export interface AccountResponse {
    id: number;
    accountTypeId: number;
    customerUsername: string;
}
