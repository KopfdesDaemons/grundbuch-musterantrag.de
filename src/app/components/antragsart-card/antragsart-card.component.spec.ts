import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntragsartCardComponent } from './antragsart-card.component';

describe('AntragsartCardComponent', () => {
  let component: AntragsartCardComponent;
  let fixture: ComponentFixture<AntragsartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntragsartCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntragsartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
