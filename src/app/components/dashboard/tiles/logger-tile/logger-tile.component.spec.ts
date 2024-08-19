import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggerTileComponent } from './logger-tile.component';

describe('LoggerTileComponent', () => {
  let component: LoggerTileComponent;
  let fixture: ComponentFixture<LoggerTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggerTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggerTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
