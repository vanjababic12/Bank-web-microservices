import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchAppointmentsComponent } from './branch-appointments.component';

describe('BranchAppointmentsComponent', () => {
  let component: BranchAppointmentsComponent;
  let fixture: ComponentFixture<BranchAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchAppointmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
