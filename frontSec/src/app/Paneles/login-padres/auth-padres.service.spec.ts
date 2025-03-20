import { TestBed } from '@angular/core/testing';

import { AuthPadresService } from './auth-padres.service';

describe('AuthPadresService', () => {
  let service: AuthPadresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthPadresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
