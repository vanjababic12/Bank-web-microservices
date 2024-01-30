import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeTransferComponent } from './exchange-transfer.component';

describe('ExchangeTransferComponent', () => {
  let component: ExchangeTransferComponent;
  let fixture: ComponentFixture<ExchangeTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
