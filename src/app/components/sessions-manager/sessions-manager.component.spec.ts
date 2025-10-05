import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsManagerComponent } from './sessions-manager.component';

describe('SessionsManagerComponent', () => {
  let component: SessionsManagerComponent;
  let fixture: ComponentFixture<SessionsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionsManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
