import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountTypeComponent } from './create-account-type.component';

describe('CreateAccountTypeComponent', () => {
  let component: CreateAccountTypeComponent;
  let fixture: ComponentFixture<CreateAccountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccountTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
