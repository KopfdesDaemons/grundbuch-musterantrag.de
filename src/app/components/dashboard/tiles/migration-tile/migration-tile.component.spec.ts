import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationTileComponent } from './migration-tile.component';

describe('MigrationTileComponent', () => {
  let component: MigrationTileComponent;
  let fixture: ComponentFixture<MigrationTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MigrationTileComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MigrationTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
