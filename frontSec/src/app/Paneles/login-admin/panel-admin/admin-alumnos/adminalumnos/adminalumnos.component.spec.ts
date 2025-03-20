import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminalumnosComponent } from './adminalumnos.component';

describe('AdminalumnosComponent', () => {
  let component: AdminalumnosComponent;
  let fixture: ComponentFixture<AdminalumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminalumnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminalumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
