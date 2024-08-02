import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfopageTeilungserklaerungComponent } from './infopage-teilungserklaerung.component';

describe('InfopageTeilungserklaerungComponent', () => {
  let component: InfopageTeilungserklaerungComponent;
  let fixture: ComponentFixture<InfopageTeilungserklaerungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfopageTeilungserklaerungComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfopageTeilungserklaerungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
