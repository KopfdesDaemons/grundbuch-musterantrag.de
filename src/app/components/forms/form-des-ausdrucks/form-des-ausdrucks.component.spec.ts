import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesAusdrucksComponent } from './form-des-ausdrucks.component';

describe('FormDesAusdrucksComponent', () => {
  let component: FormDesAusdrucksComponent;
  let fixture: ComponentFixture<FormDesAusdrucksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDesAusdrucksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDesAusdrucksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
