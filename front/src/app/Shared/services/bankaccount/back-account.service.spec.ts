import { TestBed } from '@angular/core/testing';

import { BackAccountService } from './back-account.service';

describe('BackAccountService', () => {
  let service: BackAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
