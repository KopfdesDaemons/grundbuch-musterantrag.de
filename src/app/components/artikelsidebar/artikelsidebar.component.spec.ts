import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtikelsidebarComponent } from './artikelsidebar.component';

describe('ArtikelsidebarComponent', () => {
  let component: ArtikelsidebarComponent;
  let fixture: ComponentFixture<ArtikelsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtikelsidebarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ArtikelsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
