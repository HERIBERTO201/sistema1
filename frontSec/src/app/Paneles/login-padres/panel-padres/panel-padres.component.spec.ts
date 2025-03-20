import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelPadresComponent } from './panel-padres.component';

describe('PanelPadresComponent', () => {
  let component: PanelPadresComponent;
  let fixture: ComponentFixture<PanelPadresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelPadresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelPadresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
