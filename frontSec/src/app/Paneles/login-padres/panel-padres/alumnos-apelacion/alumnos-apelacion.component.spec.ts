import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnosApelacionComponent } from './alumnos-apelacion.component';

describe('AlumnosApelacionComponent', () => {
  let component: AlumnosApelacionComponent;
  let fixture: ComponentFixture<AlumnosApelacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnosApelacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnosApelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
