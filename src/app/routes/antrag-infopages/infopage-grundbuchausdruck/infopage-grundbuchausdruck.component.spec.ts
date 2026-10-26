import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfopageGrundbuchausdruckComponent } from './infopage-grundbuchausdruck.component';

describe('InfopageGrundbuchausdruckComponent', () => {
  let component: InfopageGrundbuchausdruckComponent;
  let fixture: ComponentFixture<InfopageGrundbuchausdruckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfopageGrundbuchausdruckComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InfopageGrundbuchausdruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
