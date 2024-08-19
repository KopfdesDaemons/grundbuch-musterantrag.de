import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntragslisteTileComponent } from './antragsliste-tile.component';

describe('AntragslisteTileComponent', () => {
  let component: AntragslisteTileComponent;
  let fixture: ComponentFixture<AntragslisteTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntragslisteTileComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AntragslisteTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
