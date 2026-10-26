import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeTrackingComponent } from './time-tracking.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TimeTrackingComponent', () => {
  let component: TimeTrackingComponent;
  let fixture: ComponentFixture<TimeTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeTrackingComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeTrackingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format duration correctly', () => {
    expect(component.formatDuration(undefined)).toBe('nicht bekannt');
    expect(component.formatDuration(0)).toBe('nicht bekannt');
    expect(component.formatDuration(5000)).toBe('5 Sek.');
    expect(component.formatDuration(65000)).toBe('1 Min. 5 Sek.');
  });
});
