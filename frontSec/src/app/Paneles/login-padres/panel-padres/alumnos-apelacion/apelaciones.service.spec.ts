import { TestBed } from '@angular/core/testing';

import { ApelacionesService } from './apelaciones.service';

describe('ApelacionesService', () => {
  let service: ApelacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApelacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
