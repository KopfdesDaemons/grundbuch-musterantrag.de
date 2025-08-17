import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAntragslisteComponent } from './dashboard-antragsliste.component';

describe('DashboardComponent', () => {
  let component: DashboardAntragslisteComponent;
  let fixture: ComponentFixture<DashboardAntragslisteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAntragslisteComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAntragslisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
