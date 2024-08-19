import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiesTileComponent } from './cookies-tile.component';

describe('CookiesTileComponent', () => {
  let component: CookiesTileComponent;
  let fixture: ComponentFixture<CookiesTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookiesTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookiesTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
