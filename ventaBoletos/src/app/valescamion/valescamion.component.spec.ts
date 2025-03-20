import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValescamionComponent } from './valescamion.component';

describe('ValescamionComponent', () => {
  let component: ValescamionComponent;
  let fixture: ComponentFixture<ValescamionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValescamionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValescamionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
