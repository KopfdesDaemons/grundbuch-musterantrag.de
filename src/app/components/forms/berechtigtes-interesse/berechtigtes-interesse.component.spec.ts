import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BerechtigtesInteresseComponent } from './berechtigtes-interesse.component';

describe('BerechtigtesInteresseComponent', () => {
  let component: BerechtigtesInteresseComponent;
  let fixture: ComponentFixture<BerechtigtesInteresseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BerechtigtesInteresseComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(BerechtigtesInteresseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
