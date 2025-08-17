import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Abteilung1Component } from './abteilung1.component';

describe('Abteilung1Component', () => {
  let component: Abteilung1Component;
  let fixture: ComponentFixture<Abteilung1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Abteilung1Component]
    }).compileComponents();

    fixture = TestBed.createComponent(Abteilung1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
