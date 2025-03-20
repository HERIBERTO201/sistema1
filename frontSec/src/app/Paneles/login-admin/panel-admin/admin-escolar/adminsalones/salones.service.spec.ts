import { TestBed } from '@angular/core/testing';

import { SalonesService } from './salones.service';

describe('SalonesService', () => {
  let service: SalonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalonesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
