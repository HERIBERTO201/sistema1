import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAsistenciaComponent } from './admin-asistencia.component';

describe('AdminAsistenciaComponent', () => {
  let component: AdminAsistenciaComponent;
  let fixture: ComponentFixture<AdminAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAsistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
