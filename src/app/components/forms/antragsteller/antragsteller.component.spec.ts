import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntragstellerComponent } from './antragsteller.component';

describe('AntragstellerComponent', () => {
  let component: AntragstellerComponent;
  let fixture: ComponentFixture<AntragstellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntragstellerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AntragstellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
