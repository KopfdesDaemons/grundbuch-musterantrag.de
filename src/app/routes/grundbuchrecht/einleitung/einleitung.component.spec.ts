import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinleitungComponent } from './einleitung.component';

describe('EinleitungComponent', () => {
  let component: EinleitungComponent;
  let fixture: ComponentFixture<EinleitungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EinleitungComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EinleitungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
