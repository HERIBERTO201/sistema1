import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnosPadresComponent } from './alumnos-padres.component';

describe('AlumnosPadresComponent', () => {
  let component: AlumnosPadresComponent;
  let fixture: ComponentFixture<AlumnosPadresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnosPadresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnosPadresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
