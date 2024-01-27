import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhangeListComponent } from './exhange-list.component';

describe('ExhangeListComponent', () => {
  let component: ExhangeListComponent;
  let fixture: ComponentFixture<ExhangeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExhangeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExhangeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
