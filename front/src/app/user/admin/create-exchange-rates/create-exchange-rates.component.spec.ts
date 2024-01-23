import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExchangeRatesComponent } from './create-exchange-rates.component';

describe('CreateExchangeRatesComponent', () => {
  let component: CreateExchangeRatesComponent;
  let fixture: ComponentFixture<CreateExchangeRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExchangeRatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExchangeRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
