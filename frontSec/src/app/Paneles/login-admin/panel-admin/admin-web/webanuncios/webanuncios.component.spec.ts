import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebanunciosComponent } from './webanuncios.component';

describe('WebanunciosComponent', () => {
  let component: WebanunciosComponent;
  let fixture: ComponentFixture<WebanunciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebanunciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebanunciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
