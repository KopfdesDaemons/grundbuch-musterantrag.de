import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrundbuchausdruckBeantragenComponent } from './grundbuchausdruck-beantragen.component';

describe('GrundbuchausdruckBeantragenComponent', () => {
  let component: GrundbuchausdruckBeantragenComponent;
  let fixture: ComponentFixture<GrundbuchausdruckBeantragenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrundbuchausdruckBeantragenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrundbuchausdruckBeantragenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
