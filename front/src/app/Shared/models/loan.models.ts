export class CreateLoanRequestDto {
    loanTypeId: number;
    amount: number;
    numberOfInstallments: number;

    constructor(loanTypeId: number, amount: number, numberOfInstallments: number) {
        this.loanTypeId = loanTypeId;
        this.amount = amount;
        this.numberOfInstallments = numberOfInstallments;
    }
}

export class LoanTypeDto {
    name: string;
    interestRate: number;
    description: string;

    constructor(name: string, interestRate: number, description: string) {
        this.name = name;
        this.interestRate = interestRate;
        this.description = description;
    }
}
