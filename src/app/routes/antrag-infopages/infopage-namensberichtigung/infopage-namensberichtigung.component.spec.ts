import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfopageNamensberichtigungComponent } from './infopage-namensberichtigung.component';

describe('InfopageNamensberichtigungComponent', () => {
  let component: InfopageNamensberichtigungComponent;
  let fixture: ComponentFixture<InfopageNamensberichtigungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfopageNamensberichtigungComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InfopageNamensberichtigungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
