import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BewilligungComponent } from './bewilligung.component';

describe('BewilligungComponent', () => {
  let component: BewilligungComponent;
  let fixture: ComponentFixture<BewilligungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BewilligungComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(BewilligungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
