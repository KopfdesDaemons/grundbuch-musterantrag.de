import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarbeComponent } from './farbe.component';

describe('FarbeComponent', () => {
  let component: FarbeComponent;
  let fixture: ComponentFixture<FarbeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FarbeComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(FarbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
