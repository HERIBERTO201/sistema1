import { TestBed } from '@angular/core/testing';

import { TalleresService } from './talleres.service';

describe('TalleresService', () => {
  let service: TalleresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TalleresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
