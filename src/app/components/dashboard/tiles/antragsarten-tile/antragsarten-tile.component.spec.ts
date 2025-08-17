import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntragsartenTileComponent } from './antragsarten-tile.component';

describe('AntragsartenTileComponent', () => {
  let component: AntragsartenTileComponent;
  let fixture: ComponentFixture<AntragsartenTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntragsartenTileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AntragsartenTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
