import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRequestComponent } from './create-loan-request.component';

describe('CreateLoanRequestComponent', () => {
  let component: LoanRequestComponent;
  let fixture: ComponentFixture<LoanRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoanRequestComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoanRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
