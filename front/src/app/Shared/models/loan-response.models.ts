export class LoanType {
    id: number;
    name: string;
    interestRate: number;
    description: string;
    isDeleted: boolean;

    constructor(id: number, name: string, interestRate: number, description: string, isDeleted: boolean) {
        this.id = id;
        this.name = name;
        this.interestRate = interestRate;
        this.description = description;
        this.isDeleted = isDeleted;
    }
}

export class LoanRequest {
    id: number;
    loanTypeId: number;
    customerUsername: string;
    amount: number;
    numberOfInstallments: number;
    isReviewed: boolean;
    isApproved: boolean;
    loanType: LoanType;

    constructor(id: number, loanTypeId: number, customerUsername: string, amount: number, numberOfInstallments: number, isReviewed: boolean, isApproved: boolean, loanType: LoanType) {
        this.id = id;
        this.loanTypeId = loanTypeId;
        this.customerUsername = customerUsername;
        this.amount = amount;
        this.numberOfInstallments = numberOfInstallments;
        this.isReviewed = isReviewed;
        this.isApproved = isApproved;
        this.loanType = loanType;
    }
}
