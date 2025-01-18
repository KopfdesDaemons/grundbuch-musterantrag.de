import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntragsanzahltimeframeComponent } from './antragsanzahltimeframe.component';

describe('AntragsanzahltimeframeComponent', () => {
  let component: AntragsanzahltimeframeComponent;
  let fixture: ComponentFixture<AntragsanzahltimeframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntragsanzahltimeframeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntragsanzahltimeframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
