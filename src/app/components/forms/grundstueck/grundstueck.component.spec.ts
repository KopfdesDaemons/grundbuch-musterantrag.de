import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrundstueckComponent } from './grundstueck.component';

describe('GrundstueckComponent', () => {
  let component: GrundstueckComponent;
  let fixture: ComponentFixture<GrundstueckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrundstueckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrundstueckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
