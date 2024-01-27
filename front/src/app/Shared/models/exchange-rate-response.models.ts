export class ExchangeRate {
    id: number;
    currency: string;
    rate: number;
    date: string; // Datum u ISO 8601 formatu

    constructor(id: number, currency: string, rate: number, date: string) {
        this.id = id;
        this.currency = currency;
        this.rate = rate;
        this.date = date;
    }
}

export interface ExchangeRateDisplays {
    id: number;
    currency: string;
    rate: number;
};
