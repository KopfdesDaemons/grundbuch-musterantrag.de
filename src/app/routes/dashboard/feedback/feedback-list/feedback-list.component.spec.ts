import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FeedbackListComponent } from './feedback-list.component';

describe('FeedbackListComponent', () => {
  let component: FeedbackListComponent;
  let fixture: ComponentFixture<FeedbackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

