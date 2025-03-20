import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEscolarComponent } from './admin-escolar.component';

describe('AdminEscolarComponent', () => {
  let component: AdminEscolarComponent;
  let fixture: ComponentFixture<AdminEscolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEscolarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEscolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
