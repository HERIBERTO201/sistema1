import { TestBed } from '@angular/core/testing';

import { MostrarContenidoService } from './mostrar-contenido.service';

describe('MostrarContenidoService', () => {
  let service: MostrarContenidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MostrarContenidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
