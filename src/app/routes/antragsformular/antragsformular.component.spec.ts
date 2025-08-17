import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntragsformularComponent } from './antragsformular.component';

describe('GrundbuchausdruckBeantragenComponent', () => {
  let component: AntragsformularComponent;
  let fixture: ComponentFixture<AntragsformularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntragsformularComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AntragsformularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
