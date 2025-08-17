import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrundbuchamtComponent } from './grundbuchamt.component';

describe('GrundbuchamtComponent', () => {
  let component: GrundbuchamtComponent;
  let fixture: ComponentFixture<GrundbuchamtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrundbuchamtComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GrundbuchamtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
