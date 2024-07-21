import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErblasserComponent } from './erblasser.component';

describe('ErblasserComponent', () => {
  let component: ErblasserComponent;
  let fixture: ComponentFixture<ErblasserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErblasserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErblasserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
