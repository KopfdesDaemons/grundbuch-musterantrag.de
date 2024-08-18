import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfopageSterbefallComponent } from './infopage-sterbefall.component';

describe('InfopageSterbefallComponent', () => {
  let component: InfopageSterbefallComponent;
  let fixture: ComponentFixture<InfopageSterbefallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [InfopageSterbefallComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(InfopageSterbefallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
