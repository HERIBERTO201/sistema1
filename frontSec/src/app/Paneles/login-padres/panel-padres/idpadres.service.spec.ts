import { TestBed } from '@angular/core/testing';

import { IdpadresService } from './idpadres.service';

describe('IdpadresService', () => {
  let service: IdpadresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdpadresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
