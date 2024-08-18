import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Abteilung2Component } from './abteilung2.component';

describe('Abteilung2Component', () => {
  let component: Abteilung2Component;
  let fixture: ComponentFixture<Abteilung2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Abteilung2Component]
})
    .compileComponents();

    fixture = TestBed.createComponent(Abteilung2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
