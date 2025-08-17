import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestandsverzeichnisComponent } from './bestandsverzeichnis.component';

describe('BestandsverzeichnisComponent', () => {
  let component: BestandsverzeichnisComponent;
  let fixture: ComponentFixture<BestandsverzeichnisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestandsverzeichnisComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BestandsverzeichnisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
