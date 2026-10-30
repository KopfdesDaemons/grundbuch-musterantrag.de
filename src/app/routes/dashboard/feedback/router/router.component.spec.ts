import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterComponent } from './router.component';

describe('RouterComponent', () => {
  let component: RouterComponent;
  let fixture: ComponentFixture<RouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

