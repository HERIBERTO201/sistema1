import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelcamionesComponent } from './panelcamiones.component';

describe('PanelcamionesComponent', () => {
  let component: PanelcamionesComponent;
  let fixture: ComponentFixture<PanelcamionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelcamionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelcamionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
