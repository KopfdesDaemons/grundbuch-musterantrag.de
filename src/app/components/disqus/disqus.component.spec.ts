import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisqusComponent } from './disqus.component';

describe('DisqusComponent', () => {
  let component: DisqusComponent;
  let fixture: ComponentFixture<DisqusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisqusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisqusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
