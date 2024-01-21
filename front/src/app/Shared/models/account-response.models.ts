export interface AccountTypeResponse {
    id: number;
    name: string;
}

export interface AccountRequestResponse {
    id: number;
    accountTypeId: number;
    customerUsername: string;
}

export interface AccountResponse {
    id: number;
    accountTypeId: number;
    customerUsername: string;
}
