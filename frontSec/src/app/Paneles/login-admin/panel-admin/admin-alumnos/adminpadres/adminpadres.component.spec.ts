import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminpadresComponent } from './adminpadres.component';

describe('AdminpadresComponent', () => {
  let component: AdminpadresComponent;
  let fixture: ComponentFixture<AdminpadresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminpadresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminpadresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
