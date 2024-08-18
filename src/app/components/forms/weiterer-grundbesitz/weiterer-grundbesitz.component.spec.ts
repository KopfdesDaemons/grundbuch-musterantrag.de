import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeitererGrundbesitzComponent } from './weiterer-grundbesitz.component';

describe('WeitererGrundbesitzComponent', () => {
  let component: WeitererGrundbesitzComponent;
  let fixture: ComponentFixture<WeitererGrundbesitzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WeitererGrundbesitzComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(WeitererGrundbesitzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
