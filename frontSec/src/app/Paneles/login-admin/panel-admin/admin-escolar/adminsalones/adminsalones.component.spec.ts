import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsalonesComponent } from './adminsalones.component';

describe('AdminsalonesComponent', () => {
  let component: AdminsalonesComponent;
  let fixture: ComponentFixture<AdminsalonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminsalonesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminsalonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
