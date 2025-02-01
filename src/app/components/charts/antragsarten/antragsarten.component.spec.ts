import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntragsartenComponent } from './antragsarten.component';

describe('AntragsartenComponent', () => {
  let component: AntragsartenComponent;
  let fixture: ComponentFixture<AntragsartenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntragsartenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntragsartenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
