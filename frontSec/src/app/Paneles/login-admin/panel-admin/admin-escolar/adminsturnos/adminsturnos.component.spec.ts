import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsturnosComponent } from './adminsturnos.component';

describe('AdminsturnosComponent', () => {
  let component: AdminsturnosComponent;
  let fixture: ComponentFixture<AdminsturnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminsturnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminsturnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
