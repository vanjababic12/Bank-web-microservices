import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExchangeRate } from '../../models/exchange-rate-response.models';
import { ExchangeRateListDto } from '../../models/exchange-rate.models';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  private apiUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  createExchangeRateList(exchangeRateListDto: ExchangeRateListDto): Observable<ExchangeRateListDto> {
    return this.http.post<ExchangeRateListDto>(`${this.apiUrl}/exchange-rates`, exchangeRateListDto);
  }

  getLatestExchangeRates(): Observable<ExchangeRate[]> {
    return this.http.get<ExchangeRate[]>(`${this.apiUrl}/exchange-rates/latest`);
  }

  getExchangeRatesByDate(date: string): Observable<ExchangeRate[]> {
    return this.http.get<ExchangeRate[]>(`${this.apiUrl}/exchange-rates`, { params: { date } });
  }
}
