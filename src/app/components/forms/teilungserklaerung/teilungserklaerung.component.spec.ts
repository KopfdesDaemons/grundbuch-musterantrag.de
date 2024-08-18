import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeilungserklaerungComponent } from './teilungserklaerung.component';

describe('TeilungserklaerungComponent', () => {
  let component: TeilungserklaerungComponent;
  let fixture: ComponentFixture<TeilungserklaerungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TeilungserklaerungComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TeilungserklaerungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
