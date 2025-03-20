import { TestBed } from '@angular/core/testing';

import { HijosService } from './hijos.service';

describe('HijosService', () => {
  let service: HijosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HijosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
