import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntragsinfosHeroComponent } from './antragsinfos-hero.component';

describe('AntragsinfosHeroComponent', () => {
  let component: AntragsinfosHeroComponent;
  let fixture: ComponentFixture<AntragsinfosHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntragsinfosHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntragsinfosHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
