import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfopageBewilligungenComponent } from './infopage-bewilligungen.component';

describe('InfopageBewilligungenComponent', () => {
  let component: InfopageBewilligungenComponent;
  let fixture: ComponentFixture<InfopageBewilligungenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfopageBewilligungenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfopageBewilligungenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
