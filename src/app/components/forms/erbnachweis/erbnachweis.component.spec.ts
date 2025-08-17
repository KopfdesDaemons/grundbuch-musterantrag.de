import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErbnachweisComponent } from './erbnachweis.component';

describe('ErbnachweisComponent', () => {
  let component: ErbnachweisComponent;
  let fixture: ComponentFixture<ErbnachweisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErbnachweisComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ErbnachweisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
