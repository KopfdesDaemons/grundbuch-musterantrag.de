import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechtAbteilung2Component } from './recht-abteilung2.component';

describe('RechtAbteilung2Component', () => {
  let component: RechtAbteilung2Component;
  let fixture: ComponentFixture<RechtAbteilung2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RechtAbteilung2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechtAbteilung2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
