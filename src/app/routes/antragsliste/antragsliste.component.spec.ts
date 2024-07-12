import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntragslisteComponent } from './antragsliste.component';

describe('AntragslisteComponent', () => {
  let component: AntragslisteComponent;
  let fixture: ComponentFixture<AntragslisteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AntragslisteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntragslisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
