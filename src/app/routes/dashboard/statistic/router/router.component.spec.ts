import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterComponent } from './router.component';

describe('RouterComponent', () => {
  let component: RouterComponent;
  let fixture: ComponentFixture<RouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RouterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
