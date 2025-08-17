import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntragsgenerierungComponent } from './antragsgenerierung.component';

describe('AntragsgenerierungComponent', () => {
  let component: AntragsgenerierungComponent;
  let fixture: ComponentFixture<AntragsgenerierungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntragsgenerierungComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AntragsgenerierungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
