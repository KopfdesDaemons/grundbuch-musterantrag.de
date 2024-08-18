import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SachlicheUndOrtlicheZustaendigkeitComponent } from './sachliche-und-ortliche-zustaendigkeit.component';

describe('SachlicheUndOrtlicheZustaendigkeitComponent', () => {
  let component: SachlicheUndOrtlicheZustaendigkeitComponent;
  let fixture: ComponentFixture<SachlicheUndOrtlicheZustaendigkeitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SachlicheUndOrtlicheZustaendigkeitComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SachlicheUndOrtlicheZustaendigkeitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
