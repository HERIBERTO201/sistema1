import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebtalleresComponent } from './webtalleres.component';

describe('WebtalleresComponent', () => {
  let component: WebtalleresComponent;
  let fixture: ComponentFixture<WebtalleresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebtalleresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebtalleresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
