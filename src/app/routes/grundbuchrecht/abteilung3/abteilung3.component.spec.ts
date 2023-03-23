import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Abteilung3Component } from './abteilung3.component';

describe('Abteilung3Component', () => {
  let component: Abteilung3Component;
  let fixture: ComponentFixture<Abteilung3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Abteilung3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Abteilung3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
