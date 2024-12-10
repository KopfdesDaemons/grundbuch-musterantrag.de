import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTileComponent } from './settings-tile.component';

describe('SettingsTileComponent', () => {
  let component: SettingsTileComponent;
  let fixture: ComponentFixture<SettingsTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
