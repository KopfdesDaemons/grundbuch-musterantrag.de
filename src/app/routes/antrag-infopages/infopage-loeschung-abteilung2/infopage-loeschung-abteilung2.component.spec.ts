import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfopageLoeschungAbteilung2Component } from './infopage-loeschung-abteilung2.component';

describe('InfopageLoeschungAbteilung2Component', () => {
  let component: InfopageLoeschungAbteilung2Component;
  let fixture: ComponentFixture<InfopageLoeschungAbteilung2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfopageLoeschungAbteilung2Component]
    }).compileComponents();

    fixture = TestBed.createComponent(InfopageLoeschungAbteilung2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
