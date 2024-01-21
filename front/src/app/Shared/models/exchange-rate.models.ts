export class ExchangeRateListDto {
    date: string; // Datum u ISO 8601 formatu
    rates: ExchangeRateDto[];

    constructor(date: string, rates: ExchangeRateDto[]) {
        this.date = date;
        this.rates = rates;
    }
}

export class ExchangeRateDto {
    currency: string;
    rate: number;

    constructor(currency: string, rate: number) {
        this.currency = currency;
        this.rate = rate;
    }
}
